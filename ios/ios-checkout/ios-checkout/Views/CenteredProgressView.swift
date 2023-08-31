//
//  CenteredProgressView.swift
//  ios-checkout
//
//  Created by Daniel Patton on 7/27/23.
//

import SwiftUI

struct CenteredProgressView: View {
    var body: some View {
        VStack {
            Spacer()
            HStack {
                Spacer()
                ProgressView() // This will be centered
                Spacer()
            }
            Spacer()
        }
    }
}

struct CenteredProgressView_Previews: PreviewProvider {
    static var previews: some View {
        CenteredProgressView()
    }
}
