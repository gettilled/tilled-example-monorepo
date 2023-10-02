<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

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

Route::get('/listBalanceTransactions', 'App\Http\Controllers\ListBalanceTransactionsController@listBalanceTransactions');
Route::get('/listPayouts', 'App\Http\Controllers\ListPayoutsController@listPayouts');
Route::get('/listPaymentIntents', 'App\Http\Controllers\ListPaymentIntentsController@listPaymentIntents');
Route::get('/listDisputes', 'App\Http\Controllers\ListDisputesController@listDisputes');
