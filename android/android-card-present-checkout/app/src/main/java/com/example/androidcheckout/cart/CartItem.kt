package com.example.androidcheckout.cart

import com.example.androidcheckout.products.Product

@Suppress("unused")
data class CartItem (
    val product: Product,
    var quantity: Int = 0
)
// Default constructor required for calls to the database
{
    constructor() : this(Product(), 0) {
        require(quantity >= 0) { "Quantity cannot be negative." }
    }
}
