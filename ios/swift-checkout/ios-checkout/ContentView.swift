//
//  ContentView.swift
//  ios-checkout
//
//  Created by Daniel Patton on 7/17/23.
//

import SwiftUI

struct ContentView: View {
    @State public var cart = runSampleCart()
    @State private var showHosted = true

    var body: some View {
        VStack {
            CartSummaryView(cart: $cart)
            Spacer()
            VStack {
                // example demonstrates both our hosted checkout experience and a custom form
                Toggle("Checkout with Tilled?", isOn: $showHosted)
                    .padding()
                    .tint(.accentColor)
                
                if (showHosted) {
                    HostedCheckoutButtonView(cart: $cart)
                } else {
                    TilledJsCheckoutButtonView(cart: $cart)
                }
            }
            
        }
        .padding()
    }
    
    struct ContentView_Previews: PreviewProvider {
        static var previews: some View {
            ContentView()
        }
    }
}
