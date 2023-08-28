//
//  Cart.swift
//  ios-checkout
//
//  Created by Daniel Patton on 7/18/23.
//
import SwiftUI
import UIKit
import WebKit

struct Product {
    let name: String
    let price: Double
    let image: String
}

class Cart {
    var products: [Product]
//    TODO: move payment intent logic into cart
//    let network = Network()

    init() {
        products = []
    }

    func addToCart(product: Product) {
        products.append(product)
        print("\(product.name) added to cart.")
    }

    func removeFromCart(product: Product) {
        if let index = products.firstIndex(where: { $0.name == product.name }) {
            products.remove(at: index)
            print("\(product.name) removed from cart.")
        } else {
            print("\(product.name) is not in the cart.")
        }
    }

    func calculateTotal() -> Double {
        let total = products.reduce(0.0) { $0 + $1.price }
        return total
    }

    func printCart() {
        if products.isEmpty {
            print("Cart is empty.")
        } else {
            print("Cart:")
            for product in products {
                print("\(product.name) - $\(product.price)")
            }
            let total = calculateTotal()
            print("Total: $\(total)")
        }
    }
}

// For preview purposes0
func runSampleCart() -> Cart {
    let cart = Cart()

    let product1 = Product(name: "Running Shoes", price: 99.99, image: "shoes")
    let product2 = Product(name: "Socks", price: 19.99, image: "socks")
    let product3 = Product(name: "Training Session", price: 99.99, image: "gym")

    cart.addToCart(product: product1)
    cart.addToCart(product: product2)
    cart.addToCart(product: product3)

    return cart
}

