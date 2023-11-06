@file:Suppress("PropertyName", "PropertyName", "PropertyName")

package com.example.androidcheckout.api

@Suppress("PropertyName")
data class PaymentIntentRequest(
    val amount: Int,
    val currency: String,
    val payment_method_types: List<String>,
    val payment_method_id: String,
    val confirm: Boolean
)

data class PaymentIntentResponse(
    val id: String,
    val amount: Int,
    val currency: String,
    val status: String
)

data class PaymentStatusResponse(
    val id: String,
    val amount: Int,
    val currency: String,
    val status: String
)

data class CancelPaymentResponse(
    val id: String,
    val amount: Int,
    val currency: String,
    val status: String
)
