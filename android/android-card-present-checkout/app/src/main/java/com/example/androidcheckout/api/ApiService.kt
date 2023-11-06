package com.example.androidcheckout.api

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface APIService {
    @POST("/v1/payment-methods")
    fun createPaymentMethod(@Body payload: PaymentMethodRequest): Call<PaymentMethodResponse>

    @POST("/v1/payment-intents")
    fun createPaymentIntent(@Body payload: PaymentIntentRequest): Call<PaymentIntentResponse>

    @GET("/v1/payment-intents/{id}")
    fun getPaymentStatus(@Path("id") paymentId: String): Call<PaymentStatusResponse>

    @POST("/v1/payment-intents/{id}/cancel")
    fun cancelPayment(@Path("id") paymentId: String): Call<CancelPaymentResponse>
}
