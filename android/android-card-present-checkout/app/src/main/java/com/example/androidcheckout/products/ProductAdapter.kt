package com.example.androidcheckout.products

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.ImageView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.bitmap.RoundedCorners
import com.example.androidcheckout.R
import com.example.androidcheckout.databinding.ProductRowItemBinding
import com.google.android.material.snackbar.Snackbar

class ProductAdapter(
    private val onProductClick: (Product) -> Unit,
    var products: List<Product> = listOf()
) : RecyclerView.Adapter<ProductAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ProductRowItemBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding, onProductClick)
    }

    override fun getItemCount(): Int = products.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bindProduct(products[position])
    }

    // ViewHolder represents a single item view within the RecyclerView.
    class ViewHolder(
        private val binding: ProductRowItemBinding, // Binding object for the item view
        private val onProductClick: (Product) -> Unit // Callback for product click
    ) : RecyclerView.ViewHolder(binding.root) {

        private var currentProduct: Product? = null // Reference to the currently bound product

        // Initialize the click listener, which is used to add an item to the cart when the user taps on it.
        init {
            binding.root.setOnClickListener {
                currentProduct?.let { product ->
                    onProductClick(product)
                    Snackbar.make(binding.root, "${product.name} added to cart", Snackbar.LENGTH_SHORT).show()
                }
            }
        }

        fun bindProduct(product: Product) {
            currentProduct = product
            binding.apply {
                productName.text = product.name
                product.loadImageInto(productImage)
                val resourceId = productImage.context.resources.getIdentifier(product.photos[0].file, "drawable", productImage.context.packageName)
                Log.d("resourceId", resourceId.toString())
            }
        }
    }
}

// Load the product image into the view using Glide, allows for easy image loading and customization.
fun Product.loadImageInto(imageView: ImageView) {
    val context = imageView.context // Get the context from the ImageView
    // Associate the image with the resource ID based on the `photos.file` value of the `products.json` file
    val resourceId = context.resources.getIdentifier(photos[0].file, "drawable", context.packageName)
    val questionMark = R.drawable.question_mark
    if (resourceId != 0) {
        Glide.with(imageView)
            .load(resourceId)// Load the resource associated with the name to the ImageView
            .fitCenter()
            .transform(RoundedCorners(7))
            .into(imageView)
    } else {
        Glide.with(imageView)
            .load(questionMark) // Load the question mark drawable to the ImageView
            .fitCenter()
            .transform(RoundedCorners(7))
            .into(imageView)
    }
}