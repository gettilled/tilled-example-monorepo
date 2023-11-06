package com.example.androidcheckout.api

@Suppress("PropertyName")
data class PaymentMethodRequest(
    val type: String,
    val terminal_reader_id: String
)

data class PaymentMethodResponse(
    val id: String
)