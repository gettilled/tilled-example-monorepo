<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Client\RequestException;
use App\Services\TilledService; // Import the TilledService class

class ListPaymentIntentsController extends Controller
{
    public function ListPaymentIntents(Request $request)
    {
        $accountId = $request->header('tilled-account');
        $offset = $request->query('offset') ?? 0;
        $payoutId = $request->query('payout_id') ?? '';
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
            $response = Http::withHeaders($headers)->timeout(10)->get($baseUrl . '/v1/payment-intents?offset= ' . $offset . ' &payout_id=' . $payoutId . '&limit=15');
            // Check if the API request was successful
            if ($response->successful()) {
                $data = $response->json();
                // Return the list of PaymentIntents as a JSON response
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
}
