:warning: This repository contains a standalone example to be used as a reference to help our partners integrate with Tilled. It is **not** intended to be implemented in a production environment nor is it intended to be installed as a dependency in any way.

# Dependencies

- [Xcode](https://developer.apple.com/xcode/)
- [SwiftUI](https://developer.apple.com/xcode/swiftui/)
- [Node.js](https://nodejs.org)
- [Express.js](https://expressjs.com/)
- [tilled-node](https://www.npmjs.com/package/tilled-node)

You can find documentation for `tilled-node` on
[docs.tilled.com](https://docs.tilled.com/resources/sdks/tilled-node/) and
[Github Pages](https://gettilled.github.io/tilled-node/).

# Get started

- Clone the project
- Install dependencies (be sure to navigate to the directory for this project
  `cd ios/swift-checkout/server`):
  ```
  $ npm install
  $ cd client && npm install
  ```
- Navigate to the the directory you cloned the project into using Finder, and open the ios-checkout.xcodeproj file with Xcode.

# Create a sandbox account and add your configuration values

- Create a .env file in this project's server directory (`ios/swift-checkout/server`)
  with your secret API key:

```
TILLED_PUBLIC_KEY=pk_XXXX
TILLED_SECRET_KEY=sk_XXXX
TILLED_MERCHANT_ACCOUNT_ID=acct_XXXX
TILLED_PARTNER_ACCOUNT_ID=acct_XXXX
```

# Start the backend server

- Enter the following command from this the `server` directory :

```
$ npm run start
```

Your server will run on port 5053.

## Configuring the Network class

The [Network class](https://github.com/gettilled/tilled-example-monorepo/blob/ios/ios-checkout/ios-checkout/Services/Network.swift) has a public variable, `serverUrl`, assigned to `"http://localhost:5053"`. For testing on a physical iOS device, you will need to either expose port 5053 using [ngrok](https://ngrok.com/) or host the server on a development server and replace the current. In either case, you will need to set up some form [certificate authority](./server/setting-up-certificate-authority.md) or [add an ATS exception](https://developer.apple.com/news/?id=jxky8h89) to comply with Apple's [Root Certificate Program](https://www.apple.com/certificateauthority/ca_program.html).

# Process your first payment

<p align="center">
  <img src="https://github.com/gettilled/tilled-example-monorepo/blob/ios/ios-checkout/images/checkout.png" />
</p>

- In Xcode, use the toggle to checkout using hosted checkout or the custom tilled.js form.
  - Selecting "Checkout with Tilled?" will use Tilled's [checkout sessions](https://docs.tilled.com/api/#tag/Checkout-Sessions).<p align="center"><img src="https://github.com/gettilled/tilled-example-monorepo/blob/ios/ios-checkout/images/hosted-form.png" /></p>
  - Not selecting "Checkout with Tilled?" will use the custom [tilled.js form](https://github.com/gettilled/tilled-example-monorepo/blob/ios/ios-checkout/server/tilled-form/index.html) in this project.<p align="center"><img src="https://github.com/gettilled/tilled-example-monorepo/blob/ios/ios-checkout/images/tilledjs-form.png" /></p>
- Enter a name, country and ZIP code.
- Enter `4037111111000000` as the test card
  number with a valid expiration date and `123` as the CVV Code and click Pay
- Optional: Look in the browser's developer console to see payment intent
  creation logs
- Go [here](https://sandbox-app.tilled.com/payments) to see your payment
