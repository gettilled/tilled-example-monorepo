//
//  Network.swift
//  ios-checkout
//
//  Created by Daniel Patton on 7/17/23.
//

import SwiftUI

class Network: ObservableObject {
    public var serverUrl = "https://0abc-2600-6c5e-4c3f-1a58-00-1004.ngrok-free.app"
    
    func createPaymentIntent(tilledAccount: String, amount: Int, currency: String, paymentMethodTypes: [String], products: [Product], completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void) {
        print(amount)
        let urlString = serverUrl + "/payment-intents"
        
        guard let url = URL(string: urlString) else {
            print("Invalid URL: \(urlString)")
            return
        }
        
        let lineItems = products.map { item in
            return ["name": item.name, "price": String(item.price)]
        }
        
        let requestBody = [
            "amount": amount,
            "currency": currency,
            "payment_method_types": paymentMethodTypes,
            "line_items": lineItems
        ] as [String : Any]
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: requestBody, options: [])
            
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue(tilledAccount, forHTTPHeaderField: "tilled_account")
            request.httpBody = jsonData
            
            let session = URLSession.shared
            let task = session.dataTask(with: request, completionHandler: completionHandler)
            task.resume()
        } catch {
            print("Error while serializing request body: \(error)")
        }
    }
    
    func updatePaymentIntent(paymentMethodID: String, completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void) {
        let urlString = serverUrl + "/payment-intents"
        
        guard let url = URL(string: urlString) else {
            print("Invalid URL: \(urlString)")
            return
        }

        let requestBody = [
            "payment_method_id": paymentMethodID
        ]
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: requestBody, options: [])
            
            var request = URLRequest(url: url)
            request.httpMethod = "PATCH"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = jsonData
            
            let session = URLSession.shared
            let task = session.dataTask(with: request, completionHandler: completionHandler)
            task.resume()
        } catch {
            print("Error while serializing request body: \(error)")
        }
    }

    func createCheckoutSession(tilledAccount: String, products: [Product], completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void) {
        let urlString = serverUrl + "/checkout-sessions"
        
        guard let url = URL(string: urlString) else {
            print("Invalid URL: \(urlString)")
            return
        }

        let requestBody = products.map { product in
            return [
                "name": product.name,
                "price": product.price,
                "image": product.image
                // Add other product properties if needed
            ] as [String : Any]
        }
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: requestBody, options: [])
            
            // Create the URL request
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue(tilledAccount, forHTTPHeaderField: "tilled_account")
            request.httpBody = jsonData
            
            // Create a data task for the request
            let session = URLSession.shared
            let task = session.dataTask(with: request, completionHandler: completionHandler)
            task.resume()
        } catch {
            print("Error while serializing request body: \(error)")
        }
    }

}
