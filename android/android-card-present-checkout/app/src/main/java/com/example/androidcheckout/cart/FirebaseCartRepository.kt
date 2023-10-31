package com.example.androidcheckout.cart

import android.util.Log
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener

class FirebaseCartRepository : CartDataSource {
    private val database: FirebaseDatabase = FirebaseDatabase.getInstance()
    private val cartReference: DatabaseReference = database.getReference("cart")

    override fun getCart(callback: (Result<MutableList<CartItem>>) -> Unit) {
        // Read from the database
        cartReference.addListenerForSingleValueEvent(object : ValueEventListener {
            // This method is called once with the initial value and again whenever data is updated.
            override fun onDataChange(dataSnapshot: DataSnapshot) {
                val cartList = dataSnapshot.children.mapNotNull { it.getValue(CartItem::class.java) }.toMutableList()
                callback(Result.Success(cartList))
            }

            override fun onCancelled(databaseError: DatabaseError) {
                callback(Result.Failure(Exception("Error fetching cart items: ${databaseError.message}")))
                Log.e("FirebaseCartRepository", "Error fetching cart items: ${databaseError.message}")
            }
        })
    }
    override fun updateCart(updatedCart: List<CartItem>) {
        cartReference.setValue(updatedCart)
    }

    override fun addItem(cartItem: CartItem) {
        updateItemQuantity(cartItem, 1)
    }

    override fun removeItem(cartItem: CartItem) {
        updateItemQuantity(cartItem, -1)
    }

    private fun updateItemQuantity(cartItem: CartItem, delta: Int) {
        getCart { result ->
            when (result) {
                is Result.Success -> {
                    val cartList = result.value
                    val targetItem = cartList.find { it.product.id == cartItem.product.id }
                    if (targetItem == null && delta > 0) {
                        cartItem.quantity = delta
                        cartList.add(cartItem)
                    } else {
                        targetItem?.let {
                            it.quantity += delta
                            if (it.quantity <= 0) {
                                cartList.remove(it)
                            }
                        }
                    }
                    saveCart(cartList)
                }
                is Result.Failure -> {
                    Log.e("FirebaseCartRepository", "Error updating cart: ${result.exception.message}")
                }
            }
        }
    }

    private fun saveCart(cart: MutableList<CartItem>) {
        cartReference.setValue(cart)
    }

    // Used to monitor and update the cart items when they change (i.e. when an item is added or removed).
    fun observeCartUpdates(callback: (List<CartItem>) -> Unit) {
        cartReference.addValueEventListener(object : ValueEventListener {
            override fun onDataChange(dataSnapshot: DataSnapshot) {
                val updatedCart = dataSnapshot.children.mapNotNull { it.getValue(CartItem::class.java) }.filter { it.quantity > 0 }
                callback(updatedCart)
            }

            override fun onCancelled(databaseError: DatabaseError) {
                Log.e("FirebaseCartRepository", "Error observing cart updates: ${databaseError.message}")
            }
        })
    }

    override fun getCheckoutCartSize(callback: (Int) -> Unit) {
        cartReference.addValueEventListener(object : ValueEventListener {
            override fun onDataChange(dataSnapshot: DataSnapshot) {
                val cartSize = dataSnapshot.children.sumOf { it.getValue(CartItem::class.java)?.quantity ?: 0 }
                callback(cartSize)
            }

            override fun onCancelled(databaseError: DatabaseError) {
                Log.e("FirebaseCartRepository", "Error getting cart size: ${databaseError.message}")
            }
        })
    }

    // Clears the cart by setting the cart to an empty list in Firebase.
    override fun clearCart(function: () -> Unit) {
        cartReference.setValue(emptyList<CartItem>())
            .addOnSuccessListener { function() }
            .addOnFailureListener { error ->
                Log.e("FirebaseCartRepository", "Failed to clear cart: ${error.message}")
            }
    }
}