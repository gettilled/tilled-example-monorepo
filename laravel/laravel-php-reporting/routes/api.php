<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('index');
});

Route::get('/balance-transactions', function () {
    return view('balance_transactions');
});

Route::get('/payouts', function () {
    return view('payouts');
});

Route::get('/payment-intents', function () {
    return view('payment_intents');
});

Route::get('/disputes', function () {
    return view('disputes');
});

Route::get('/listBalanceTransactions{account_id}', 'App\Http\Controllers\ListBalanceTransactionsController@listBalanceTransactions');
Route::get('/listPayouts{account_id}', 'App\Http\Controllers\ListPayoutsController@listPayouts');
Route::get('/listPaymentIntents{account_id}', 'App\Http\Controllers\ListPaymentIntentsController@listPaymentIntents');
Route::get('/listDisputes{account_id}', 'App\Http\Controllers\ListDisputesController@listDisputes');
