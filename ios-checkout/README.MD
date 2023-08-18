# iOS Checkout

Welcome to the iOS Checkout Example App! This repository contains a sample application that demonstrates how to seamlessly integrate Tilled.js, our powerful JavaScript library, with your SaaS company's application to facilitate payment processing. Tilled helps SaaS companies like yours accept payments easily and securely.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Setting Up a Custom Tilled.js Server](#setting-up-a-custom-tilledjs-server)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Tilled.js Integration Example App showcases how to leverage Tilled.js to enhance your SaaS application's payment capabilities. With Tilled.js, you can seamlessly integrate our payment processing system into your app, allowing your users to make payments efficiently and securely. This example app demonstrates how to open a webview for either our hosted checkout or a custom Tilled.js served from a server within your app.

## Features

- Seamless integration of Tilled.js for payment processing.
- Options to open a webview to either Tilled's hosted checkout or a custom Tilled.js instance.
- Demonstrates best practices for integrating Tilled.js with your SaaS application.

## Getting Started

Follow the steps below to get started with the Tilled.js Integration Example App.

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/gettilled/tilled-example-monorepo.git
   ```

2. Navigate to the project directory:

```bash
cd ios-checkout
```

### Configuration

1. Obtain your Tilled API credentials from your Tilled account dashboard.
2. In the config.js file, replace the placeholders with your Tilled API credentials:

```javascript
module.exports = {
	apiKey: 'YOUR_API_KEY',
	apiSecret: 'YOUR_API_SECRET',
};
```

### Setting Up the Server

To host a custom Tilled.js form for your application, follow these steps:

1. Generate a self-signed CA certificate for secure communication between your app and the server. You can use tools like OpenSSL to create a certificate.

2. Configure your development server (e.g., Node.js with Express) to use the generated CA certificate for HTTPS. Refer to your server's documentation for specific instructions.

3. Replace 'checkout_url_here' in the index.html file with the URL of your custom Tilled.js server:

```html
<iframe src="https://your-custom-tilledjs-server.com" frameborder="0"></iframe>
```

### Usage

1. Open the project in your preferred code editor.
2. Navigate to the index.html file in the public directory.
3. Update the iframe src attribute to point to your custom Tilled.js form.
4. Save your changes.
5. Launch the app by opening the index.html file in a web browser or deploying it to a web server.
6. Test the payment processing flow by interacting with the custom Tilled.js instance.

### Contributing

We welcome contributions to the Tilled.js Integration Example App! If you encounter issues or would like to add new features, feel free to submit a pull request. Please ensure that your code follows the project's coding standards and includes relevant documentation.

For more information about Tilled.js and our payment processing solutions, visit our website or contact our support team at support@tilled.com.

We hope you find this example app helpful in integrating Tilled.js into your iOS app!
