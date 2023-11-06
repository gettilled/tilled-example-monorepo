package com.example.androidcheckout.products

import com.google.gson.annotations.SerializedName

data class Photo(
    @SerializedName("file")
    var file: String? = null
)
