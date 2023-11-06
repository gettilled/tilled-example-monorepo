package com.example.androidcheckout.cart

// Used to wrap API responses in a Result object calls to realtime database
sealed class Result<out T> {
    data class Success<out T>(val value: T) : Result<T>()
    data class Failure(val exception: Throwable) : Result<Nothing>()
}
