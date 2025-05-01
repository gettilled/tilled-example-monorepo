//
//  SignUpView.swift
//  ios-onboarding
//
//  Created by Daniel Patton on 4/17/25.
//


import SwiftUI

struct AccountIdentifier: Identifiable {
    let id: String
}

struct SignUpView: View {
    @State private var businessName = ""
    @State private var email = ""
    @State private var isCreating = false
    @State private var errorMessage: String?
    // This will hold the new account ID on success:
    @State private var newAccount: AccountIdentifier?

    
    var body: some View {
        VStack(spacing: 20) {
            Text("Create Merchant Account")
                .font(.headline)
            TextField("Business Name", text: $businessName)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            TextField("Email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .keyboardType(.emailAddress)
            if let error = errorMessage {
                Text(error).foregroundColor(.red)
            }
            Button(action: createAccount) {
                Text(isCreating ? "Creating..." : "Sign Up")
                    .padding()
                    .frame(maxWidth: .infinity)
            }
            .disabled(isCreating || businessName.isEmpty || email.isEmpty)
            .buttonStyle(.borderedProminent)
        }
        .padding()
        // Once account is created, navigate to the onboarding form:
        .fullScreenCover(item: $newAccount) { account in
            OnboardingFormView(accountId: account.id)
        }

    }
    
    func createAccount() {
        errorMessage = nil
        isCreating = true
        // Build the request to POST /v1/accounts/connected
        // Note: this request requires a secret key and should not be made client-side. It is included here for the sake of simplicity
        guard let url = URL(string: "https://sandbox-api.tilled.com/v1/accounts/connected") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("<Your Account ID>", forHTTPHeaderField: "tilled-account")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("<Your API Key>", forHTTPHeaderField: "tilled-api-key")
        let body: [String: String] = ["name": businessName, "email": email]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        print(request)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isCreating = false
                if let error = error {
                    errorMessage = "Network error: \(error.localizedDescription)"
                    return
                }
                guard let httpResponse = response as? HTTPURLResponse,
                      let responseData = data else {
                    errorMessage = "No response from server."
                    return
                }
                if httpResponse.statusCode == 200 || httpResponse.statusCode == 201 {
                    // Decode the account ID from the response JSON
                    if let json = try? JSONSerialization.jsonObject(with: responseData) as? [String: Any],
                       let accountId = json["id"] as? String {
                        newAccount = AccountIdentifier(id: accountId) // trigger navigation to form
                    } else {
                        errorMessage = "Failed to parse account ID."
                    }
                } else {
                    // Handle error response
                    if let json = try? JSONSerialization.jsonObject(with: responseData) as? [String: Any],
                       let message = json["error"] as? String {
                        errorMessage = "Error: \(message)"
                    } else {
                        errorMessage = "Account creation failed (status \(httpResponse.statusCode))."
                    }
                }
            }
        }.resume()
    }
}
