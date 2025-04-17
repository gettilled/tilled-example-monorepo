//
//  OnboardingFormView.swift
//  ios-onboarding
//
//  Created by Daniel Patton on 4/17/25.
//

import Foundation
import SwiftUICore
import SwiftUI

extension URL: @retroactive Identifiable {
    public var id: String { absoluteString }
}

struct OnboardingFormView: View {
    let accountId: String  // ID of the connected account being onboarded
    
    // Business info state variables
    @State private var legalName = ""
    @State private var dbaName = ""
    @State private var taxId = ""
    @State private var businessPhone = ""
    @State private var businessWebsite = ""
    @State private var businessDescription = ""
    @State private var mccCode = "RETAIL"        // or category selection
    @State private var businessStructure = "limited_liability_company"  // default, could use Picker
    @State private var yearlyVolumeRange = "MEDIUM"  // e.g. LOW/MEDIUM/HIGH
    
    // Processing volume
    @State private var monthlyProcessingVolume = ""
    @State private var monthlyProcessingCount = ""
    @State private var processingVolumeCurrency = "usd"
    @State private var highTicketAmount = ""
    @State private var avgTransactionAmountCard = ""
    @State private var avgTransactionAmountDebit = ""
    @State private var percentB2B = 0  // percentage of business-to-business transactions
    
    // Card checkout method breakdown
    @State private var percentECommerce = 0
    @State private var percentManualCardNotPresent = 0
    @State private var percentSwiped = 0
    
    // Patriot Act details
    @State private var patriotActForm = "business_license" // business_license or articles_of_incorporation
    @State private var businessLicenseDocumentId = ""
    @State private var businessLicenseExpirationDate = ""  // format YYYY-MM-DD
    @State private var businessLicenseIssueDate = ""  // format YYYY-MM-DD
    @State private var businessLicenseName = ""
    @State private var businessLicenseState = ""
    @State private var articlesOfIncorporationDocumentId = ""
    @State private var articlesOfIncorporationIssueDate = "" // format YYYY-MM-DD
    @State private var articlesOfIncorporationState = ""

    
    // Address
    @State private var street = ""
    @State private var street2 = ""
    @State private var city = ""
    @State private var state = ""
    @State private var postalCode = ""
    @State private var country = "US"
    
    // Principal (owner) info
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var dateOfBirth = ""  // format YYYY-MM-DD
    @State private var principalEmail = ""
    @State private var principalPhone = ""
    @State private var principalAddressStreet = ""
    @State private var principalAddressCity = ""
    @State private var principalAddressState = ""
    @State private var principalAddressZip = ""
    @State private var principalAddressCountry = "US"
    @State private var principalTitle = "owner"
    @State private var ownershipPercentage = ""
    @State private var ssn = ""
    @State private var isApplicant = true    // this principal is the applicant
    @State private var isControlProng = true // this principal is the controlling owner
    
    // Bank account info
    @State private var accountNumber = ""
    @State private var routingNumber = ""
    
    // Terms
    @State private var acceptTerms = false
    
    // For handling API response
    @State private var validationErrors: [String] = []
    @State private var signingURL: URL?
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Business Information")) {
                    TextField("Legal Business Name", text: $legalName)
                    TextField("DBA (Trading Name)", text: $dbaName)
                    TextField("Business Description", text: $businessDescription)
                    TextField("Website URL", text: $businessWebsite)
                    Picker("Business Structure", selection: $businessStructure) {
                        Text("LLC").tag("limited_liability_company")
                        Text("Sole Proprietorship").tag("sole_proprietorship")
                        Text("Corporation").tag("corporation")
                        Text("Partnership").tag("partnership")
                        // etc.
                    }
                    TextField("Tax ID (EIN)", text: $taxId)
                        .keyboardType(.numberPad)
                    Picker("Business Category", selection: $mccCode) {
                        // In a real app, populate with actual MCC or category options
                        Text("Beauty / Personal Care").tag("BEAUTY")
                        Text("Retail").tag("RETAIL")
                        Text("Food & Beverage").tag("RESTAURANT")
                        // ...
                    }
                    TextField("Annual Volume Range", text: $yearlyVolumeRange)
                    TextField("Mothly Transaction Volume", text: $monthlyProcessingVolume)
                        .keyboardType(.numberPad)
                    TextField("Mothly Transaction Count", text: $monthlyProcessingCount)
                        .keyboardType(.numberPad)
                    Picker("Processing Volume Currency", selection: $processingVolumeCurrency) {
                        Text("USD").tag("usd")
                        Text("CAD").tag("cad")
                        Text("EUR").tag("eur")
                        Text("GBP").tag("gbp")
                        // ... other currencies if needed
                    }
                    TextField("Avg Transaction Amount Card", text: $avgTransactionAmountCard)
                        .keyboardType(.numberPad)
                    TextField("Avg Transaction Amount Debit", text: $avgTransactionAmountDebit)
                        .keyboardType(.numberPad)
                    TextField("% Transactions B2B", value: $percentB2B, format: .number)
                        .keyboardType(.numberPad)
                    TextField("Support Phone", text: $businessPhone)
                        .keyboardType(.phonePad)
                    TextField("Support Email", text: $principalEmail)
                        .keyboardType(.emailAddress)
                }
                Section(header: Text("Card Checkout Method Breakdown")) {
                    TextField("Percent E-commerce", value: $percentECommerce, format: .number)
                        .keyboardType(.numberPad)
                    TextField("Percent Manual Card Not Present", value: $percentManualCardNotPresent, format: .number)
                        .keyboardType(.numberPad)
                    TextField("Percent Swiped", value: $percentSwiped, format: .number)
                        .keyboardType(.numberPad)
                }
                Section(header: Text("Patriot Act Details")) {
                    Picker(selection: $patriotActForm, label: Text("Document Type:")) {
                        Text("Business License").tag("business_license")
                        Text("Articles of Incorporation").tag("articles_of_incorporation")
                    }
                    if (patriotActForm == "business_license") {
                        TextField("Business Name:", text: $businessLicenseName)
                        TextField("State:", text: $businessLicenseState)
                        TextField("Issue Date:", text: $businessLicenseIssueDate)
                        TextField("Expiration Date:", text: $businessLicenseExpirationDate)
                        TextField("Document ID", text: $businessLicenseDocumentId)
                    } else if (patriotActForm == "articles_of_incorporation") {
                        TextField("State:", text: $articlesOfIncorporationState)
                        TextField("Issue Date:", text: $articlesOfIncorporationIssueDate)
                        TextField("Document ID", text: $articlesOfIncorporationDocumentId)
                    }
                }
                Section(header: Text("Business Address")) {
                    TextField("Street", text: $street)
                    TextField("Street 2", text: $street2)
                    TextField("City", text: $city)
                    TextField("State/Province", text: $state)
                    TextField("ZIP/Postal Code", text: $postalCode)
                    Picker("Country", selection: $country) {
                        Text("United States").tag("US")
                        Text("Canada").tag("CA")
                        // ... other countries if needed
                    }
                }
                Section(header: Text("Owner / Principal")) {
                    TextField("First Name", text: $firstName)
                    TextField("Last Name", text: $lastName)
                    TextField("Date of Birth (YYYY-MM-DD)", text: $dateOfBirth)
                        .keyboardType(.numbersAndPunctuation)
                    Picker("Title/Role", selection: $principalTitle) {
                        Text("Owner").tag("owner")
                        Text("CEO").tag("chief_executive_officer")
                        Text("Director").tag("director")
                        // etc.
                    }
                    TextField("Ownership Percentage", text: $ownershipPercentage)
                        .keyboardType(.numberPad)
                    TextField("Principal Email", text: $principalEmail)
                        .keyboardType(.emailAddress)
                    TextField("Principal Phone", text: $principalPhone)
                        .keyboardType(.phonePad)
                    TextField("Home Street", text: $principalAddressStreet)
                    TextField("Home City", text: $principalAddressCity)
                    TextField("Home State", text: $principalAddressState)
                    TextField("Home ZIP", text: $principalAddressZip)
                        .keyboardType(.numbersAndPunctuation)
                    Picker("Home Country", selection: $principalAddressCountry) {
                        Text("US").tag("US"); Text("CA").tag("CA")
                    }
                    TextField("SSN (9 digits)", text: $ssn)
                        .keyboardType(.numberPad)
                    Toggle("This person is the application signer", isOn: $isApplicant)
                    Toggle("This person is the controlling owner", isOn: $isControlProng)
                }
                Section(header: Text("Bank Account")) {
                    TextField("Routing Number", text: $routingNumber)
                        .keyboardType(.numberPad)
                    TextField("Account Number", text: $accountNumber)
                        .keyboardType(.numberPad)
                }
                Section {
                    Toggle("Accept Terms and Conditions", isOn: $acceptTerms)
                    Button(action: submitOnboarding) {
                        Text("Submit Application")
                    }
                    .disabled(!acceptTerms)  // must accept terms to submit
                }
                
                // Display validation errors, if any
                if !validationErrors.isEmpty {
                    Section(header: Text("Please Fix the Following")) {
                        ForEach(validationErrors, id: \.self) { err in
                            Text("• \(err)").foregroundColor(.red)
                        }
                    }
                }
            }
            .navigationBarTitle("Merchant Application", displayMode: .inline)
            .sheet(item: $signingURL) { url in
                SigningWebView(url: url)
            }
        }
    }
    
    func submitOnboarding() {
            validationErrors.removeAll()

            // 1) Build the `patriot_act_details` locally
            var patriotActDetails: [String: Any] = [:]
            if patriotActForm == "business_license" {
                patriotActDetails["business_license"] = [
                    "document_id": businessLicenseDocumentId,
                    "issued_at": businessLicenseIssueDate,
                    "expires_at": businessLicenseExpirationDate,
                    "name": businessLicenseName,
                    "state": businessLicenseState
                ]
            } else {
                patriotActDetails["articles_of_incorporation"] = [
                    "document_id": articlesOfIncorporationDocumentId,
                    "issued_at": articlesOfIncorporationIssueDate,
                    "state": articlesOfIncorporationState
                ]
            }

            // 2) Build the rest of your payload
            var appData: [String: Any] = [
                "tos_acceptance": acceptTerms
            ]

            let legalEntity: [String: Any] = [
                "legal_name": legalName,
                "dba_name": dbaName,
                "tax_id_number": taxId,
                "structure": businessStructure,
                "mcc": mccCode,
                "product_description": businessDescription,
                "website": addHttpsPrefix(to: businessWebsite),
                "phone": businessPhone,
                "region": country,
                "statement_descriptor": String(dbaName.prefix(20)),
                "processing_volume": [
                    "annual_volume_range": yearlyVolumeRange,
                    "monthly_processing_volume": Int(monthlyProcessingVolume) ?? 0,
                    "monthly_transaction_count": Int(monthlyProcessingCount) ?? 0,
                    "currency": processingVolumeCurrency,
                    "average_transaction_amount_card": Int(avgTransactionAmountCard) ?? 0,
                    "average_transaction_amount_debit": Int(avgTransactionAmountDebit) ?? 0,
                    "percent_business_to_business": percentB2B
                ],
                "card_checkout_method_breakdown": [
                    "percent_e_commerce": percentECommerce,
                    "percent_manual_card_not_present": percentManualCardNotPresent,
                    "percent_swiped": percentSwiped
                ],
                // attach your local patriotActDetails
                "patriot_act_details": patriotActDetails,
                "address": [
                    "street": street,
                    "street2": street2,
                    "city": city,
                    "state": state,
                    "postal_code": postalCode,
                    "country": country
                ],
                "principals": [[
                    "first_name": firstName,
                    "last_name": lastName,
                    "email": principalEmail,
                    "phone": principalPhone,
                    "date_of_birth": dateOfBirth,
                    "job_title": principalTitle,
                    "percent_ownership": Int(ownershipPercentage) ?? 0,
                    "is_applicant": isApplicant,
                    "is_control_prong": isControlProng,
                    "id_number": ssn,
                    "address": [
                        "street": principalAddressStreet,
                        "city": principalAddressCity,
                        "state": principalAddressState,
                        "postal_code": principalAddressZip,
                        "country": principalAddressCountry
                    ]
                ]],
                "bank_account": [
                    "routing_number": routingNumber,
                    "account_number": accountNumber
                ],
                "days_billed_prior_to_shipment": 0, // hardcodeing
                "date_of_incorporation": "2021-01-01" // hardcodeing
            ]

            appData["legal_entity"] = legalEntity

            // 3) Send to API
            // Note: this request requires a secret key and should not be made client-side. It is included here for the sake of simplicity
            guard let url = URL(string: "https://sandbox-api.tilled.com/v1/onboarding") else { return }
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.addValue(accountId, forHTTPHeaderField: "tilled-account")
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("<Your API Key>", forHTTPHeaderField: "tilled-api-key")
            request.httpBody = try? JSONSerialization.data(withJSONObject: appData)
        
        print(request)
        print(request.value(forHTTPHeaderField: "payments-account") ?? "unknown")

            URLSession.shared.dataTask(with: request) { data, resp, err in
                DispatchQueue.main.async {
                    if let err = err {
                        validationErrors = ["Network error: \(err.localizedDescription)"]
                        return
                    }
                    guard let http = resp as? HTTPURLResponse,
                          let data = data else {
                        validationErrors = ["No response from server"]
                        return
                    }
                    if (200...201).contains(http.statusCode) {
                        submitOnboardingApplication()
                    } else if [400,422].contains(http.statusCode),
                              let json = try? JSONSerialization.jsonObject(with: data) as? [String:Any],
                              let errors = json["validation_errors"] as? [String] {
                        validationErrors = errors
                    } else {
                        validationErrors = ["Submission failed (HTTP \(http.statusCode))."]
                    }
                }
            }.resume()
        }

        func submitOnboardingApplication() {
            // Note: this request requires a secret key and should not be made client-side. It is included here for the sake of simplicity
            guard let url = URL(string: "https://sandbox-api.tilled.com/v1/onboarding/submit") else { return }
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.addValue(accountId, forHTTPHeaderField: "tilled-account")
            request.addValue("<Your API Key>", forHTTPHeaderField: "tilled-api-key")

            URLSession.shared.dataTask(with: request) { data, resp, err in
                DispatchQueue.main.async {
                    if let err = err {
                        validationErrors = ["Network error: \(err.localizedDescription)"]
                        return
                    }
                    guard let http = resp as? HTTPURLResponse,
                          let data = data else {
                        validationErrors = ["No response from server"]
                        return
                    }
                    if (200..<300).contains(http.statusCode) {
                        // parse your signing_links
                        if let json = try? JSONSerialization.jsonObject(with: data) as? [String:Any],
                           let links = json["signing_links"] as? [[String:Any]],
                           let link = links.first?["url"] as? String,
                           let downURL = URL(string: link) {
                            // 3) assign directly to signingURL to present the sheet
                            signingURL = downURL
                            return
                        }
                        // fallback into body.signing_links if needed...
                        validationErrors = ["Onboarding completed successfully!"]
                    } else {
                        validationErrors = ["Submit failed (HTTP \(http.statusCode))."]
                    }
                }
            }.resume()
        }
    }

    // MARK: - Helper
    func addHttpsPrefix(to urlString: String) -> String {
        urlString.hasPrefix("https://") ? urlString : "https://" + urlString
    }
