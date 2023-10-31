package com.example.androidcheckout.checkout

import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.androidcheckout.api.APIConfig
import com.example.androidcheckout.api.APIService
import com.example.androidcheckout.api.CancelPaymentResponse
import com.example.androidcheckout.api.PaymentIntentRequest
import com.example.androidcheckout.api.PaymentIntentResponse
import com.example.androidcheckout.api.PaymentMethodRequest
import com.example.androidcheckout.api.PaymentMethodResponse
import com.example.androidcheckout.api.PaymentStatusResponse
import com.example.androidcheckout.cart.CartItem
import com.example.androidcheckout.cart.FirebaseCartRepository
import com.example.androidcheckout.cart.Result
import com.example.androidcheckout.products.Product
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class CheckoutViewModel(
    private val cartRepository: FirebaseCartRepository,
    private val apiService: APIService
) : ViewModel() {

    // These LiveData objects will hold data to be observed by the UI.
    val cartItems = MutableLiveData<List<CartItem>>()
    val products = MutableLiveData<List<Product>>()
    val errorMessages = MutableLiveData<String>()
    // paymentCanceled and paymentSuccess are used to notify the UI when the payment is successful, failed, or canceled.
    val paymentCanceled = MutableLiveData<Boolean>()
    val paymentSuccess = MutableLiveData<Boolean>()

    companion object {
        private const val terminalReaderId = APIConfig.terminalReaderId // Defined in APIConfig.kt
    }


    private val handler = Handler(Looper.getMainLooper())

    // Initialize and fetch data when this ViewModel is created.
    init {
        fetchData()
    }

    // Variable to hold the current payment ID.
    private lateinit var currentPaymentId: String

    /*
    * This function sends a GET request to /v1/payment-intents/{id} to retrieve the status of the PaymentIntent every 5 seconds until the status changes from `requires_action`
    * This is only being done as an example. In a real-world application, you would utilize webhooks to retrieve the status of the PaymentIntent.
    */
    private fun pollPaymentStatus() {
        Log.d("CheckoutViewModel", "Polling payment status for ID: $currentPaymentId")
        apiService.getPaymentStatus(currentPaymentId).enqueue(object : Callback<PaymentStatusResponse> {
            override fun onResponse(call: Call<PaymentStatusResponse>, response: Response<PaymentStatusResponse>) {
                Log.d("CheckoutViewModel", "Received response for payment status of ID: $currentPaymentId. Response: ${response.body()?.status}")
                when (response.body()?.status) {
                    "succeeded" -> {
                        paymentSuccess.value = true
                    }
                    "canceled" -> {
                        paymentCanceled.value = true
                    }
                    "requires_payment_method" -> {
                        paymentSuccess.value = false
                    }
                    else -> handler.postDelayed(paymentPollingRunnable, 5000) // Continue polling
                }
            }

            override fun onFailure(call: Call<PaymentStatusResponse>, t: Throwable) {
                Log.e("CheckoutViewModel", "Failed to poll payment status for ID: $currentPaymentId. Error: ${t.message}")
                handler.removeCallbacks(paymentPollingRunnable)  // Stop the polling
            }
        })
    }

    // Runnable to repeatedly poll payment status.
    private val paymentPollingRunnable = Runnable {
        pollPaymentStatus()
    }

    fun fetchData() {
        fetchCartItems()
        startObservingCartUpdates()
    }

    // Fetches the cart items from firebase if any exist.
    private fun fetchCartItems() {
        cartRepository.getCart { result ->
            when (result) {
                is Result.Success -> {
                    cartItems.value = result.value
                }
                is Result.Failure -> {
                    errorMessages.value = "Error fetching cart items: ${result.exception.message}"
                }
            }
        }
    }

    // Sets the products to the ViewModel.
    fun setProducts(products: List<Product>) {
        this.products.value = products
    }

    // Used to monitor and update the cart items when they change (i.e. when an item is added or removed).
    private fun startObservingCartUpdates() {
        cartRepository.observeCartUpdates { updatedCart ->
            cartItems.value = updatedCart
        }
    }

    /* This function begins by creating a `card_present` PaymentMethod, specifying the ID of the terminal reader being used.
    * Using the PaymentMethod ID, a PaymentIntent is created, which triggers the terminal to begin the payment process.*/
    fun initiatePaymentProcess(totalAmount: Double) {
        Log.d("CheckoutViewModel", "Initiating payment process.")
        // Define and send the request to create a PaymentMethod. Make sure that you have defined the terminalReaderId in APIConfig.kt
        val paymentMethodRequest = PaymentMethodRequest(type = "card_present", terminal_reader_id = terminalReaderId)
        apiService.createPaymentMethod(paymentMethodRequest).enqueue(object : Callback<PaymentMethodResponse> {
            override fun onResponse(call: Call<PaymentMethodResponse>, response: Response<PaymentMethodResponse>) {
                // If the PaymentMethod is created successfully, a PaymentIntent is created using the PaymentMethod ID.
                if (response.isSuccessful) {
                    val paymentMethodId = response.body()?.id
                    if (paymentMethodId != null) {
                        // Define and send the request to create a PaymentIntent.
                        val paymentIntentRequest = PaymentIntentRequest(
                            amount = (totalAmount * 100).toInt(), // Convert the cart total to cents
                            currency = "usd",
                            payment_method_types = listOf("card_present"),
                            payment_method_id = paymentMethodId, // Use the PaymentMethod ID from the response
                            confirm = true // Set as `true` so the PaymentIntent is confirmed immediately after the customer's card is accepted by the terminal reader.
                        )
                        apiService.createPaymentIntent(paymentIntentRequest).enqueue(object : Callback<PaymentIntentResponse> {
                            override fun onResponse(call: Call<PaymentIntentResponse>, response: Response<PaymentIntentResponse>) {
                                /* If the PaymentIntent is created successfully, the ID is stored and the payment status is polled.
                                * In a real-world application, you would be awaiting a webhook to be notified of the payment status.
                                * You should probably add a timeout to the polling to prevent it from running indefinitely. */
                                if (response.isSuccessful) {
                                    currentPaymentId = response.body()?.id.toString()
                                    pollPaymentStatus()
                                } else {
                                    Log.e("CheckoutViewModel", "Error in createPaymentIntent: ${response.errorBody()?.string()}")
                                    paymentSuccess.value = false
                                }
                            }
                            override fun onFailure(call: Call<PaymentIntentResponse>, t: Throwable) {
                                Log.e("CheckoutViewModel", "Error in createPaymentIntent", t)
                                paymentSuccess.value = false
                            }
                        })
                    } else {
                        Log.e("CheckoutViewModel", "PaymentMethod ID is null")
                        paymentSuccess.value = false
                    }
                } else {
                    Log.e("CheckoutViewModel", "Error in createPaymentMethod: ${response.errorBody()?.string()}")
                    paymentSuccess.value = false
                }
            }

            override fun onFailure(call: Call<PaymentMethodResponse>, t: Throwable) {
                Log.e("CheckoutViewModel", "Error in createPaymentMethod", t)
                paymentSuccess.value = false
            }
        })
    }

    // Function to cancel the payment.
    fun cancelPayment() {
        // Stop polling the payment status when the payment is canceled.
        handler.removeCallbacks(paymentPollingRunnable)
        apiService.cancelPayment(currentPaymentId).enqueue(object : Callback<CancelPaymentResponse> {
            override fun onResponse(call: Call<CancelPaymentResponse>, response: Response<CancelPaymentResponse>) {
                if (response.isSuccessful) {
                    paymentCanceled.value = true
                    // Clear the cart when the payment is canceled.
                    cartRepository.clearCart {
                        Log.d("CheckoutViewModel", "Cart cleared")
                    }
                } else {
                    Log.e("CheckoutViewModel", "Error in cancelPayment: ${response.code()}")
                }
            }
            override fun onFailure(call: Call<CancelPaymentResponse>, t: Throwable) {
                Log.e("CheckoutViewModel", "Error in cancelPayment: ${t.message}")
            }
        })
    }
}
