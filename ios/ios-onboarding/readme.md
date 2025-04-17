# Tilled Merchant Onboarding – iOS App (SwiftUI)

This project is a SwiftUI iOS application that walks a user through the full **Tilled Merchant Onboarding** flow, including account creation, application submission, and contract signing via an embedded `WKWebView`.

---

## 🚀 Features

- Create a Connected Account via `POST /v1/accounts/connected`
- Submit onboarding data with all required fields via `POST /v1/onboarding`
- Finalize & retrieve signing link via `POST /v1/onboarding/submit`
- Display e‑signature link in an in‑app `WKWebView`
- **Sheet driven by optional URL** (`sheet(item:)`)
- **ATS exceptions** for DocuSign demo domains
- Navigation delegate prints load success/failure

---

## 🧱 Tech Stack

- **SwiftUI** – UI framework  
- **WKWebView** – In‑app web content  
- **URLSession** – Networking  
- **Tilled API** – Sandbox endpoints (`sandbox-api.tilled.com`)  

---

## 📝 Prerequisites

- Xcode 15+  
- iOS 15+  
- A **Tilled sandbox API key** (`sk_…`) and **Partner Account ID**

---

## 🔧 Configuration

1. **Set your credentials**  
   In **`SignUpView.swift`** and **`OnboardingFormView.swift`**, replace:
   ```swift
   request.addValue("<PARTNER_ACCOUNT_ID>", forHTTPHeaderField: "tilled-account")
   request.addValue("<YOUR_API_KEY>",          forHTTPHeaderField: "tilled-api-key")
   ```
   with your sandbox values.

2. **App Transport Security**  
   To allow `demo.docusign.net` (and its subdomains) to load in‑app, add to your **target’s Info → Custom iOS Target Properties**:

   | Key                                             | Type      | Value |
   | ------------------------------------------------| --------- | ----- |
   | **App Transport Security Settings**             | Dictionary |       |
   | └─ **Exception Domains**                        | Dictionary |       |
   | &nbsp;&nbsp;└─ **demo.docusign.net**            | Dictionary |       |
   | &nbsp;&nbsp;&nbsp;&nbsp;├─ Allow Arbitrary Loads – Exception Usage  | Boolean | YES   |
   | &nbsp;&nbsp;&nbsp;&nbsp;├─ Includes Subdomains                    | Boolean | YES   |
   | &nbsp;&nbsp;&nbsp;&nbsp;└─ Require Forward Secrecy               | Boolean | NO    |

   *(If DocuSign pulls resources from other hosts, you can either add them here or use `NSAllowsArbitraryLoadsInWebContent = YES` under `NSAppTransportSecurity`.)*

---

## 📲 How it Works

### 1. Sign Up View
- User taps **Sign Up**, calls `/v1/accounts/connected`.
- On success, navigates to **OnboardingFormView**.

### 2. Onboarding Form
- SwiftUI `Form` collects all required merchant fields.
- Calls `POST /v1/onboarding`.
- Displays any `validation_errors` in‑form.

### 3. Submit Application
- Calls `POST /v1/onboarding/submit` on success.
- Retrieves `signing_links[0].url` from JSON.

### 4. Signing Sheet
- **Binding** driven by `@State private var signingURL: URL?`
- Uses:
  ```swift
  .sheet(item: $signingURL) { url in
    SigningWebView(url: url)
  }
  ```
- `URL` is extended to conform to `Identifiable`:
  ```swift
  extension URL: Identifiable {
    public var id: String { absoluteString }
  }
  ```
- When you set `signingURL = someURL`, the sheet presents automatically.

---

## 📜 Key Code Snippets

### Sheet Binding

```swift
// in OnboardingFormView.body
.sheet(item: $signingURL) { url in
  SigningWebView(url: url)
}
```

### URL Identifiable Extension

```swift
extension URL: Identifiable {
  public var id: String { absoluteString }
}
```

### SigningWebView with NavigationDelegate

```swift
struct SigningWebView: UIViewRepresentable {
  let url: URL

  func makeUIView(context: Context) -> WKWebView {
    let prefs = WKPreferences()
    prefs.javaScriptEnabled = true
    prefs.javaScriptCanOpenWindowsAutomatically = true

    let config = WKWebViewConfiguration()
    config.preferences = prefs
    config.allowsInlineMediaPlayback = true

    let webView = WKWebView(frame: .zero, configuration: config)
    webView.navigationDelegate = context.coordinator
    return webView
  }

  func updateUIView(_ webView: WKWebView, context: Context) {
    webView.load(URLRequest(url: url))
  }

  func makeCoordinator() -> Coordinator { Coordinator() }

  class Coordinator: NSObject, WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
      print("🔴 WebView failed to load: \(error.localizedDescription)")
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
      print("✅ WebView finished: \(webView.url?.absoluteString ?? "<nil>")")
    }
  }
}
```

---

## ✅ TODO / Enhancements

- Secure storage for API keys (.xcconfig / keychain)  
- Support multiple principals (array UI)  
- MCC/category dropdowns fetched from API  
- Proxy server for production key security  
