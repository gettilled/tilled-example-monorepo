<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Client\RequestException;
use App\Services\TilledService; // Import the TilledService class


// This will be used for retrieving a Customer's PaymentMethods as well as attaching newly created ones.
class ListAttachPmController extends Controller
{
    // public function listPaymentMethods(Request $request, $accountId, $customerId, $type): JsonResponse
    public function listPaymentMethods(Request $request)
    {
        $accountId = $request->header('tilled-account');
        $customerId = $request->query('customer_id');
        $type = $request->query('type');
        try {
            // Create an instance of TilledService by passing the account ID
            $tilledService = new TilledService($accountId);
            // Call the getTilledVariables method to retrieve the required variables
            $tilledVariables = $tilledService->getTilledVariables();

            // Retrieve the required values from the returned variables
            $tilledSecretApiKey = $tilledVariables['tilledSecretApiKey'];
            $baseUrl = $tilledVariables['tilledBaseUrl'];
            $headers = [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $tilledSecretApiKey,
                'tilled-Account' => $accountId,
            ];
            // Make the API request using a timeout to handle any potential delays
            $response = Http::withHeaders($headers)->timeout(10)->get($baseUrl . '/v1/payment-methods?customer_id=' . $customerId . '&type=' . $type); // type can be 'card' or 'ach_debit'
            // Check if the API request was successful
            if ($response->successful()) {
                $data = $response->json();
                // Return the list of PaymentMethods as a JSON response
                return response()->json($data);
            }
            // If the request was not successful, handle errors
            $errorMsg = 'Server error. Please try again later.';
            $statusCode = $response->clientError() ? 400 : 500;
            // Check if the request was a client error
            if ($response->clientError()) {
                $errorData = $response->json();
                $errorMsg = $errorData['message'] ?? $errorMsg;
            }
            // Return the error message and status code as a JSON response
            return response()->json(['message' => $errorMsg], $statusCode);
        } catch (RequestException $exception) {
            return response()->json(['message' => 'Unable to process the request. Please try again later.'], 500);
        }
    }

    // This method will be used to attach a newly created PaymentMethod to a Customer. We will retrieve the newly created PaymentMethod ID and Customer ID from the client.
    // public function attachPaymentMethod(Request $request, $accountId, $paymentMethodId, $customerId): JsonResponse
    // {
    public function attachPaymentMethod(Request $request)
    {
        $accountId = $request->header('tilled-account');
        $paymentMethodId = $request->query('payment_method_id');
        $customerId = $request->post('customer_id');
        $csrfToken = $request->header('X-CSRF-TOKEN');
        try {
            // Create an instance of TilledService by passing the account ID
            $tilledService = new TilledService($accountId);
            // Call the getTilledVariables method to retrieve the required variables
            $tilledVariables = $tilledService->getTilledVariables();

            // Retrieve the required values from the returned variables
            $tilledSecretApiKey = $tilledVariables['tilledSecretApiKey'];
            $baseUrl = $tilledVariables['tilledBaseUrl'];
            $headers = [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $tilledSecretApiKey,
                'tilled-Account' => $accountId,
                'X-CSRF-TOKEN' => $csrfToken,
            ];
            // Make the API request using a timeout to handle any potential delays
            $response = Http::withHeaders($headers)->timeout(10)->put($baseUrl . '/v1/payment-methods/' . $paymentMethodId . '/attach', [
                'customer_id' => $customerId
            ]);
            // Check if the API request was successful
            if ($response->successful()) {
                $data = $response->json();
                // Return the response data as a JSON response
                return response()->json($data);
            }
            // If the request was not successful, handle errors appropriately
            $errorMsg = 'Server error. Please try again later.';
            $statusCode = $response->clientError() ? 400 : 500;
            // Check if the request was a client error
            if ($response->clientError()) {
                $errorData = $response->json();
                $errorMsg = $errorData['message'] ?? $errorMsg;
            }
            // Return the error message and status code as a JSON response
            return response()->json(['message' => $errorMsg], $statusCode);
        } catch (RequestException $exception) {
            return response()->json(['message' => 'Unable to process the request. Please try again later.'], 500);
        }
    }
}