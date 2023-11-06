package com.example.androidcheckout.checkout

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.androidcheckout.api.APIService
import com.example.androidcheckout.cart.FirebaseCartRepository

class CheckoutViewModelFactory(private val cartDataSource: FirebaseCartRepository, private val apiService: APIService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(CheckoutViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return CheckoutViewModel(cartDataSource, apiService) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}