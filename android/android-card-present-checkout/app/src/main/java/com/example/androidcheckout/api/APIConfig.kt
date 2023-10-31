package com.example.androidcheckout.api

import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object APIConfig {

    private const val baseUrl = "https://sandbox-api.tilled.com"
    const val terminalReaderId = "term_XXXX" // Replace with your own terminal reader ID
    private var retrofit: Retrofit? = null
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("tilled-account", "acct_XXXX") // Replace with your own Account ID
                .addHeader("tilled-api-key", "sk_XXXX") // Replace with your own Secret Key
                .addHeader("Content-Type", "application/json")
                .addHeader("Accept", "application/json")
                .build()
            chain.proceed(request)
        }
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    private val gson = GsonBuilder()
        .setLenient()
        .create()

    fun getRetrofitClient(): Retrofit {
        return retrofit ?: synchronized(this) {
            retrofit ?: Retrofit.Builder()
                .baseUrl(baseUrl)
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build().also { retrofit = it }
        }
    }
}
