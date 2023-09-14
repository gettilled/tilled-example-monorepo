<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('index');
});

Route::get('/secret/{account_id}', 'App\Http\Controllers\PaymentController@createPaymentIntent');
Route::get('/listPaymentMethods', 'App\Http\Controllers\ListAttachPmController@listPaymentMethods');
Route::put('/attachPaymentMethod', 'App\Http\Controllers\ListAttachPmController@attachPaymentMethod');