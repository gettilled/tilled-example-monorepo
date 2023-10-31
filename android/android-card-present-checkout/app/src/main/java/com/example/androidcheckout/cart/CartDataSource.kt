package com.example.androidcheckout.cart

// Functionality for interacting with the cart
interface CartDataSource {
    fun getCart(callback: (Result<MutableList<CartItem>>) -> Unit)
    fun updateCart(updatedCart: List<CartItem>)
    fun addItem(cartItem: CartItem)
    fun removeItem(cartItem: CartItem)
    fun getCheckoutCartSize(callback: (Int) -> Unit)
    fun clearCart(function: () -> Unit)
}