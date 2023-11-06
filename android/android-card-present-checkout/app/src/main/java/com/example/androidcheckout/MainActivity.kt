package com.example.androidcheckout

import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.androidcheckout.api.APIConfig
import com.example.androidcheckout.api.APIService
import com.example.androidcheckout.cart.CartItem
import com.example.androidcheckout.cart.CheckoutCartAdapter
import com.example.androidcheckout.cart.FirebaseCartRepository
import com.example.androidcheckout.checkout.CheckoutViewModel
import com.example.androidcheckout.checkout.CheckoutViewModelFactory
import com.example.androidcheckout.databinding.ActivityMainBinding
import com.example.androidcheckout.products.Product
import com.example.androidcheckout.products.ProductAdapter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.IOException

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var cartAdapter: CheckoutCartAdapter
    private lateinit var productAdapter: ProductAdapter
    private lateinit var checkoutViewModel: CheckoutViewModel
    private val cartDataSource = FirebaseCartRepository()
    private val coroutineScope = CoroutineScope(Dispatchers.Main)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        initializeComponents()
        setupClickListeners()
        setupObservers()
        fetchProductsAndSetToViewModel()
    }

    private fun initializeComponents() {
        cartAdapter = initializeCartAdapter()
        productAdapter = initializeProductAdapter()
        checkoutViewModel = initializeViewModel()
        setupUI()
    }

    private fun setupUI() {
        binding.swipeRefreshLayout.apply {
            setColorSchemeColors(ContextCompat.getColor(this@MainActivity, R.color.colorPrimary))
            isRefreshing = true
        }
        initializeRecyclerViews()
        initializeSwipeToRefresh()
    }

    // Set up RecyclerViews for cart and products
    private fun initializeRecyclerViews() {
        // Cart items are displayed in a vertical list, using LinearLayoutManager
        binding.cartRecyclerview.apply {
            adapter = cartAdapter
            layoutManager = LinearLayoutManager(this@MainActivity)
        }

        // Set up RecyclerView for products with GridLayoutManager and dynamic span count based on screen size
        binding.productsRecyclerview.apply {
            layoutManager = GridLayoutManager(this@MainActivity, calculateSpanCount())
            adapter = productAdapter
        }
    }

    // Calculate the span count for the staggered grid layout based on screen size
    private fun calculateSpanCount(): Int {
        val displayMetrics = resources.displayMetrics
        val screenWidthDp = displayMetrics.widthPixels / displayMetrics.density
        val desiredCardWidth = (displayMetrics.widthPixels / displayMetrics.density) * 0.25
        return (screenWidthDp / desiredCardWidth).toInt()
    }

    private fun initializeSwipeToRefresh() {
        binding.swipeRefreshLayout.setOnRefreshListener {
            fetchProductsAndSetToViewModel()
            checkoutViewModel.fetchData()
        }
    }

    private fun setupClickListeners() {
        binding.checkoutButton.setOnClickListener {
            initiatePaymentProcess()
        }
        binding.cancelPaymentButton.setOnClickListener {
            checkoutViewModel.cancelPayment()
            binding.awaitingPaymentModal.visibility = View.GONE
        }
        binding.canceledPaymentClose.setOnClickListener {
            binding.paymentCanceledModal.visibility = View.GONE
        }
    }

    // Initialize the ViewModel with the cartDataSource and APIService
private fun initializeViewModel(): CheckoutViewModel {
    val apiService = APIConfig.getRetrofitClient().create(APIService::class.java)
    return ViewModelProvider(this, CheckoutViewModelFactory(cartDataSource, apiService))[CheckoutViewModel::class.java].also {
            it.fetchData()
        }
}

    // Setups the observers for the LiveData objects in the ViewModel
    private fun setupObservers() {
        checkoutViewModel.cartItems.observe(this) { cartItems ->
            val cartSize = cartItems.sumOf { it.quantity }
            updateCartSize(cartSize)
            cartAdapter.setData(cartItems)
            updateTotalPrice(cartAdapter.getTotal())
            binding.swipeRefreshLayout.isRefreshing = false
        }

        checkoutViewModel.errorMessages.observe(this) { errorMessage ->
            Toast.makeText(this, errorMessage, Toast.LENGTH_LONG).show()
        }

        checkoutViewModel.paymentCanceled.observe(this) { canceled ->
            if (canceled) {
                binding.awaitingPaymentModal.visibility = View.GONE
                binding.paymentCanceledModal.visibility = View.VISIBLE
            }
        }
        checkoutViewModel.products.observe(this) { products ->
            productAdapter.products = products
            productAdapter.notifyDataSetChanged()
            binding.swipeRefreshLayout.isRefreshing = false
        }

        checkoutViewModel.paymentSuccess.observe(this) { success ->
            if (success) {
                updateModalWithSuccess()
                postPaymentCleaner()
            } else {
                updateModalWithFailure()
                postPaymentCleaner()
            }
        }
    }

    private fun initializeCartAdapter() = CheckoutCartAdapter(
        this, mutableListOf(),
        onItemAdd = { cartItem ->
            cartDataSource.addItem(cartItem)
            checkoutViewModel.fetchData()
        },
        onItemRemove = { cartItem ->
            cartDataSource.removeItem(cartItem)
            checkoutViewModel.fetchData()
        })

    private fun initializeProductAdapter() = ProductAdapter(
        onProductClick = { product ->
            cartDataSource.addItem(CartItem(product))
            checkoutViewModel.fetchData()
        })

    private fun initiatePaymentProcess() {
        val totalAmount = cartAdapter.getTotal()
        checkoutViewModel.initiatePaymentProcess(totalAmount)
        binding.awaitingPaymentModal.visibility = View.VISIBLE
    }

    private fun postPaymentCleaner() {
        binding.awaitingPaymentModal.visibility = View.GONE
        cartDataSource.clearCart {
            checkoutViewModel.fetchData()
        }
    }

    // Set the products to the ViewModel by fetching them from a JSON file
    private fun fetchProductsAndSetToViewModel() {
        coroutineScope.launch {
            try {
                val productsData = fetchProductsFromJson()
                checkoutViewModel.setProducts(productsData)
            } catch (e: IOException) {
                Log.e("MainActivity", "Error reading products from JSON", e)
                Toast.makeText(this@MainActivity, R.string.error_reading_products, Toast.LENGTH_LONG).show()
            }
        }
    }

    // Fetch products from a JSON file in the assets folder and return them as a list
    private suspend fun fetchProductsFromJson(): List<Product> = withContext(Dispatchers.IO) {
        var productList = emptyList<Product>()
        try {
            val inputStream = resources.openRawResource(R.raw.products)
            val size = inputStream.available()
            val buffer = ByteArray(size)
            inputStream.read(buffer)
            inputStream.close()

            val json = String(buffer, Charsets.UTF_8)

            productList = Gson().fromJson(json, object : TypeToken<List<Product>>() {}.type)
        } catch (e: Exception) {
            Log.e("MainActivity", "Error reading products from JSON", e)
            Toast.makeText(this@MainActivity, R.string.error_reading_products, Toast.LENGTH_LONG).show()
        }
        productList
    }

    // Update the cart size TextView with the current cart size
    private fun updateCartSize(cartSize: Int) {
        binding.cartSize.text = cartSize.toString()
    }

    // Update the total price TextView with the current total price
    private fun updateTotalPrice(total: Double) {
        binding.totalPrice.text = getString(R.string.total_price, total)
    }

//     Show an AlertDialog with order details on successful payment
    private fun updateModalWithSuccess() {
        val totalAmount = cartAdapter.getTotal()
        val cartItemsDescription = cartAdapter.getItemsDescription()

        val orderBreakdown = """

        Items: $cartItemsDescription

        Order Total with Tax: $${String.format("%.2f", totalAmount)}
    """.trimIndent()

        AlertDialog.Builder(this)
            .setTitle("Order Breakdown:")
            .setMessage(orderBreakdown)
            .setPositiveButton("Close") { dialog, _ ->
                dialog.dismiss()
            }
            .show()
    }

    // Show an AlertDialog with a failure message on failed payment
    private fun updateModalWithFailure() {
        AlertDialog.Builder(this)
            .setTitle("Payment Failed")
            .setMessage("Payment failed. Please try again.")
            .setPositiveButton("Close") { dialog, _ ->
                dialog.dismiss()
            }
            .show()
    }

}