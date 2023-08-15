//
//  CartSummaryView.swift
//  Tilled iOS Example
//
//  Created by Daniel Patton on 7/11/23.
//

import SwiftUI

struct CartSummaryView: View {
    @Binding public var cart: Cart
    
    var body: some View {
        VStack {
            Label("Average Joes", systemImage: "arrow.left.circle")
                .frame(maxWidth: .infinity, alignment: .leading)
            
            VStack{
                Text("Pay Average Joes")
                    .foregroundColor(Color.gray)
                    .font(.system(size: 24))
                
                Text("$219.97")
                    .bold()
                    .font(.system(size: 30))
            }
            .padding(10)
            Spacer()
                .frame(maxHeight: 10)
            
            CartGridView(cart: $cart)
        }
        .padding()
    }
}

struct CartGridView: View {
    @Binding public var cart: Cart
    
    let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(cart.products, id: \.name) { item in
                    CartItem(name: item.name, price: item.price, image: item.image)
                }
            }
            .padding()
        }
    }
}

struct CartItem: View {
    let name: String
    let price: Double
    let image: String
    
    var body: some View {
        GridRow {
            Image(image)
                .resizable(resizingMode: .stretch)
                .frame(width: 75, height: 75)
                .cornerRadius(10)
            Text(name)
            Text(String(format: "$%.02f", price))
        }
    }
}

struct CartSummaryView_Previews: PreviewProvider {
    @State static var previewCart = runSampleCart()
    
    static var previews: some View {
        CartSummaryView(cart: $previewCart)
    }
}
