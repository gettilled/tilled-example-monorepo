//
//  SigningWebView.swift
//  ios-onboarding
//
//  Created by Daniel Patton on 4/17/25.
//


import SwiftUI
import WebKit

struct SigningWebView: UIViewRepresentable {
    let url: URL

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        // 1) Enable JavaScript explicitly
        let prefs = WKPreferences()
        prefs.javaScriptCanOpenWindowsAutomatically = true

        // 2) Attach prefs to a configuration
        let config = WKWebViewConfiguration()
        config.preferences = prefs
        config.allowsInlineMediaPlayback = true

        // 3) Create the webview with that config
        let webView = WKWebView(frame: .zero, configuration: config)

        // 4) Wire up the delegate so you’ll see errors/logs
        webView.navigationDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true

        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        webView.load(URLRequest(url: url))
    }

    class Coordinator: NSObject, WKNavigationDelegate {
        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            print("🔴 WebView failed to load: \(error.localizedDescription)")
        }
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print("✅ WebView finished loading: \(webView.url?.absoluteString ?? "<no URL>")")
        }
    }
}
