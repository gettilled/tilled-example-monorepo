//
//  HostedCheckoutButtonView.swift
//  ios-checkout
//
//  Created by Daniel Patton on 7/26/23.
//

import SwiftUI
import UIKit
import WebKit


struct HostedCheckoutButtonView: View {
    @Binding public var cart: Cart
    @State private var isWebViewPresented = false
    @State private var checkoutUrl: String?
    @State private var isLoading = false
    public var network = Network()
    

    var body: some View {
        Button(action: {
            isLoading = true // Set loading state to true when the network call starts
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                isLoading = false
            }
            var merchantAccountId = ""
            
            if ProcessInfo.processInfo.environment["merchant_account_id"] != nil {
                merchantAccountId = ProcessInfo.processInfo.environment["merchant_account_id"]!
            } else {
                print("Please provide a merchant_account_id in the environment.")
            }
            
            
            network.createCheckoutSession(tilledAccount: merchantAccountId, products: cart.products, completionHandler: { (data, response, error) in
                // Handle the response or error here
                if let error = error {
                    print("Error occurred: \(error)")
                    return
                }

                // Check if there's valid data and parse it if needed
                if let data = data {
                    // Process the data as needed (e.g., parse JSON response)
                    do {
                        try JSONSerialization.jsonObject(with: data, options: [])
                        if let jsonResponse = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                           let url = jsonResponse["url"] as? String {
                                checkoutUrl = url
                                print(checkoutUrl ?? "checkoutUrl is undefined")
                                isWebViewPresented = true
                            } else {
                                print("Invalid response data or missing 'url' key.")
                            }
                    } catch {
                        print("Error while parsing response: \(error)")
                    }
                } else {
                    print("No data received.")
                }
            })
        }) {
            Text("Checkout with Tilled")
                .foregroundColor(.white)
                .font(.headline)
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.accentColor)
                .cornerRadius(10)
        }
        .sheet(isPresented: $isWebViewPresented) {
            Button(action: {
                isWebViewPresented = false
            }) {
                Label("Back", systemImage: "arrow.left.circle")
                    .foregroundColor(Color.primary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
            }
            
            if isLoading {
                CenteredProgressView()
            } else if (checkoutUrl != nil) {
                WebView(urlString: checkoutUrl!)
            } else {
                    Spacer()
                    HStack {
                        Spacer()
//                        Text("Error: Failed to fetch checkout URL.")
                        Spacer()
                    }
                    Spacer()
            }
        }
    }
}

struct HostedCheckoutButtonView_Previews: PreviewProvider {
    @State static var previewCart = runSampleCart()
    
    static var previews: some View {
        HostedCheckoutButtonView(cart: $previewCart)
    }
}
