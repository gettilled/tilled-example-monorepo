//
//  TilledJsCheckoutButtonView.swift
//  Tilled iOS Example
//
//  Created by Daniel Patton on 7/17/23.
//

import SwiftUI
import UIKit
import WebKit


struct TilledJsCheckoutButtonView: View {
    @Binding public var cart: Cart
    @State private var isWebViewPresented = false
    @State private var secret: String?
    @State private var isLoading = false
    public var network = Network()
    
    
    var body: some View {
        Button(action: {
            isLoading = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                isLoading = false            }
            network.createPaymentIntent(tilledAccount: "acct_iITmFPIzjDBqiXOFwNv6V", amount: Int(round(cart.calculateTotal() * 100)), currency: "usd", paymentMethodTypes: ["card"], products: cart.products,  completionHandler: { (data, response, error) in
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
                           let clientSecret = jsonResponse["client_secret"] as? String {
                            secret = clientSecret
                            print(secret ?? "secret is undefined")
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
            Text("Checkout")
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
            } else if (secret != nil) {
                WebView(urlString: network.serverUrl + "/tilled-form/" + secret!)
            } else {
                Spacer()
                HStack {
                    Spacer()
//                    Text("Error: Failed to fetch client secret.")
                    Spacer()
                }
                Spacer()
            }
        }
    }
}
    
struct TilledJsCheckoutButtonView_Previews: PreviewProvider {
    @State static var previewCart = runSampleCart()
    
    static var previews: some View {
        TilledJsCheckoutButtonView(cart: $previewCart)
    }
}
