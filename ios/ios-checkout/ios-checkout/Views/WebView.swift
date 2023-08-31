//
//  WebView.swift
//  ios-checkout
//
//  Created by Daniel Patton on 7/19/23.
//

import SwiftUI
import UIKit
import WebKit

struct WebView: View {
    let urlString: String

    var body: some View {
        WebViewRepresentable(urlString: urlString)
    }
}

struct WebViewRepresentable: UIViewRepresentable {

    let urlString: String

    func makeUIView(context: Context) -> WKWebView {
        guard let url = URL(string: urlString) else {
            return WKWebView()
        }
//
        let webConfiguration = WKWebViewConfiguration()
        let preferences = WKWebpagePreferences()

        // Set whether JavaScript content is enabled for the webpage
        preferences.allowsContentJavaScript = true

        // Assign the preferences to the configuration
        webConfiguration.defaultWebpagePreferences = preferences

        // Create the WKWebView with the custom configuration
        let webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = context.coordinator // Set the navigation delegate to handle errors
        webView.load(URLRequest(url: url))
        
        webView.becomeFirstResponder()
        
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
            Coordinator()
        }
        
        class Coordinator: NSObject, WKNavigationDelegate {
            // Handle WebView loading errors
            func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
                print("WebView failed to load with error: \(error)")
                // You can handle the error here, e.g., display an error message to the user.
            }
        }
}

struct WebView_Previews: PreviewProvider {
    static var previews: some View {
//        WebView(urlString: "http://localhost:5053/tilled-form/pi_cEoyr0JzseQY8nv7J1VSq_secret_9ZUKKAzBFDzONfCGt8Mgiy2Me")
        WebView(urlString: "https://e525-2600-6c5e-4c3f-1a58-00-1004.ngrok-free.app/tilled-form/pi_cEoyr0JzseQY8nv7J1VSq_secret_9ZUKKAzBFDzONfCGt8Mgiy2Me")
    }
}
