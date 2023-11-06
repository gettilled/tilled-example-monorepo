package com.example.androidcheckout.cart

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.androidcheckout.databinding.CartListItemBinding
import com.example.androidcheckout.products.loadImageInto

class CheckoutCartAdapter(
    private val context: Context,
    private var cartItems: MutableList<CartItem>,
    private val onItemAdd: (CartItem) -> Unit,
    private val onItemRemove: (CartItem) -> Unit
) : RecyclerView.Adapter<CheckoutCartAdapter.ViewHolder>() {

    class ViewHolder(
        private val binding: CartListItemBinding,
        private val onItemAdd: (CartItem) -> Unit,
        private val onItemRemove: (CartItem) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {
//        Binds the product data to the view
        fun bindItem(cartItem: CartItem) {
            val product = cartItem.product
            // Set the product name, price, and quantity in the view
            binding.apply {
                productName.text = product.name.toString()
                productPrice.text = "$${product.price}"
                productQuantity.text = cartItem.quantity.toString()
                product.loadImageInto(productImage)
                // Set the click listeners for the add and remove buttons
                addToCart.setOnClickListener {
                    onItemAdd(cartItem)
                }

                removeFromCart.setOnClickListener {
                    onItemRemove(cartItem)
                }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = CartListItemBinding.inflate(LayoutInflater.from(context), parent, false)
        return ViewHolder(binding, onItemAdd, onItemRemove)
    }

    override fun getItemCount(): Int = cartItems.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bindItem(cartItems[position])
    }

    // Sets the data for the adapter and notifies the RecyclerView to update
    fun setData(newData: List<CartItem>) {
        cartItems.clear()
        cartItems.addAll(newData)
        notifyDataSetChanged()
    }

    // Returns the total price of all items in the cart
    fun getTotal(): Double {
        return cartItems.sumOf { cartItem ->
            val price = cartItem.product.price?.toDoubleOrNull()
            if (price != null) {
                price * cartItem.quantity
            } else {
                0.0
            }
        }
    }

    fun getItemsDescription(): String = cartItems.joinToString { "${it.product.name}: ${it.quantity}" }
}
