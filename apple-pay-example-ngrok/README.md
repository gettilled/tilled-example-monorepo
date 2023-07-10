
# Dependencies
- [Node.js](https://nodejs.org)

## Getting Started
#### Installation
- Clone the project
- Install dependencies:
  ```$ npm install```
  
#### Before you start
1. [Register a Tilled Sandbox Account](https://sandbox-app.tilled.com/auth/register)
2. [Create secret and publishable API keys](https://sandbox-app.tilled.com/api-keys)
	  - Add your secret API key to the `tilledSecretApiKey` variable in `app.js`
	  - Add your publishable API Key to the `pk_PUBLISHABLE_KEY` variable in `index.html`
3. [View your list of connected accounts](https://sandbox-app.tilled.com/connected-accounts) and either use the auto-created `Shovel Shop (demo)` account or create your own connected account. *Note: Prefix the name of the account with an asterisk (ex. '\*The Surf Shop') to bypass needing to submit an onboarding form*.
	  - Add an *active* connected Account ID to the `account_id` variable in `index.html`
4. [Create an Apple Developer Account](https://developer.apple.com/programs/enroll/) <sub> *(this will be used when testing Apple Pay on your Website)*
	- On your Apple Developer Account, [create a Sandbox Tester Account](https://developer.apple.com/apple-pay/sandbox-testing/#:~:text=supports%20TLS%201.2.-,Create%20a%20Sandbox%20Tester%20Account,-To%20create%20a).
	- Sign in to your Sandbox Tester Account on a [Compatible Device](https://support.apple.com/en-us/HT208531) you would like to test out your integration on.
	- Once you are signed in, you will [add a Test Card Number to your Apple Pay Wallet](https://developer.apple.com/apple-pay/sandbox-testing/#:~:text=Adding%20a%20Test%20Card%20Number) using one of the [Test Cards provided by Apple.](https://developer.apple.com/apple-pay/sandbox-testing/#:~:text=Test%20Cards%20for%20Apps%20and%20the%20Web)
	
 5. Sign up and download [ngrok](https://ngrok.com): 
	- [Sign up for ngrok](https://dashboard.ngrok.com/signup)
	- [Download ngrok](https://ngrok.com/download)
	- [Setup & Installation for ngrok](https://dashboard.ngrok.com/get-started/setup)

#### Running the server

1.	Run the sample server:
	- ```$ node app.js```
2. Expose the local server using ngrok:
	-	`$ ngrok http 5001`
3. Only access the server using the public-facing domain.

### Domain Verification

> #### **:warning: Important to note::warning:**
>Apple's Documentation for [Apple Pay on the Web](https://developer.apple.com/documentation/apple_pay_on_the_web) instructs you to create a >Merchant Identifier, Payment Processing Certificate, and to Register your Domain through them. Tilled takes care of all of this on your behalf when you [verify your Domain through our API](https://docs.tilled.com/api#tag/ApplePayDomains/operation/CreateApplePayDomain) using our [Apple Domain Verification File](https://api.tilled.com/apple-developer-merchantid-domain-association).

You must register and verify all top-level domains and subdomains where you will display the Apple Pay button. For example, if you were to host a Payment Form that displays the Apple Pay button on `https://pay.example.com/` and `https://example.com/`, you will need to complete Domain Verification for both.

> #### **:warning: Important to note::warning:**
>In the Production environment, to receive your Domain Verification files for Apple Pay, you will need to reach out to the Onboarding Team at [integrations@tilled.com](integrations@tilled.com) and provide the following information:
>
>1.  On how many domains do you plan to host the Apple Pay button?
    -   If each Merchant will be using a different domain or subdomain, you will need to include that in your answer if the Merchant will be hosting the Apple Pay button.
    -   You will need to register and verify all top-level domains and subdomains where you will display the Apple Pay button. For example, if you were to host a payment form that displayed the Apple Pay button on  `https://pay.example.com/`  and  `https://example.com/`, you would need to complete domain verification for both.  
>
>2.  How many merchants are you planning to enable Apple Pay for?  
>
> 3.  Will you be using your own payment/checkout page (using Tilled.js) or Tilled’s Checkout Sessions?
<hr>

### Verifying your Domain for Apple Pay

 1. In this example, we have already added [**Tilled's Apple Domain Verification File**](https://api.tilled.com/apple-developer-merchantid-domain-association) and it should be reachable at  `/.well-known/apple-developer-merchantid-domain-association` in the domain path. You can find the file in the repo [here](.well-known/apple-developer-merchantid-domain-association).
	- Make sure the file is accessible in your domain at `https://YOURDOMAIN.com/.well-known/apple-developer-merchantid-domain-association`. The page should either show the contents of what is shown [here](.well-known/apple-developer-merchantid-domain-association) or the file should be automatically downloaded when visiting the page.
2. After confirming that your file is being hosted and is accessible, you will need to utilize Tilled's API to [**Create an Apple Domain**](https://docs.tilled.com/api#tag/ApplePayDomains), which will verify the Domain through Apple.

<p align ="center"> 
<strong>Example: POST /v1/apple-pay-domains Request</strong>
</p>

```
$ curl -X POST 'https://sandbox-api.tilled.com/v1/apple-pay-domains' \
-H 'tilled-account: {{MERCHANT_ACCOUNT_ID}}' \
-H 'tilled-api-key: {{SECRET_KEY}}' \
-H 'Content-Type: application/json' \
--data-raw '{"hostname": "https://example.com"}'
```
<p align ="center"> 
<strong>Example: POST /v1/apple-pay-domains Response</strong>
</p>

```
{
  "updated_at": "2019-08-24T14:15:22Z",
  "created_at": "2019-08-24T14:15:22Z",
  "id": "string",
  "hostname": "string",
  "account_id": "string"
}
```
3. After successful Domain Verification, you are now able to start accepting Payments on your site.
### 
---


# Paying with Apple Pay
After completing the steps above, you will follow the instructions below to access your publicly facing domain where the server is being hosted:
1. [Sign in to your Apple Sandbox Tester Account on the device you are using](https://support.apple.com/en-us/HT204053)
	- If you haven't already, use [Apple's Test Cards](Apple%27s%20Test%20Cards) to [add a card to your Apple Pay Wallet](https://support.apple.com/en-us/HT204506)
2. In Safari, open the link to your publicly-facing domain where the example is being hosted.
 	- ** *<u>you are not able to make payments with Apple Pay in localhost*</u> **
3. Click the **Buy with Pay** Button under Pay with Card.
	-	Authorize the payment through the Apple Pay pop-up.
- `Optional: Look in the browser's developer console to see payment intent creation logs`
4. Go [here](https://sandbox-app.tilled.com/payments) to see your payment

---
# Pay with Card or ACH <sub><sup>(NOT Apple Pay)</sub></sup>
To complete a card or ACH payment without using Apple Pay, complete the following steps:

1. Navigate to your example's domain in your browser.
	- <sub> You do not need to use a public domain to process Card and ACH payments in our Sandbox Environment, [http://localhost:5001](http://localhost:5001/) will work fine, but the Apple Pay button will not be visible.</sub>
2. Enter `4037111111000000` as the test card number with a valid expiration date and `123` as the CVV Code and click Pay
- `Optional: Look in the browser's developer console to see payment intent creation logs`

3. Go [here](https://sandbox-app.tilled.com/payments) to see your payment

- To pay with ACH, you can click on the ACH tab and enter the following details:
	-	**Routing Number:** `011000138`
	-	**Account Number:** Any 12-digit number can be passed as an account number.

<sub>This example was made with Apple Pay in mind and will show errors if you are not using a compatible device or browser, if you would like to see a payment example without Apple Pay, you can use our [simple-payment-example](https://github.com/gettilled/simple-payment-example). </sub>

# What's Next?
[Apple Pay | Tilled Docs](https://docs.tilled.com/docs/payments/apple-pay/)<br>
[Tilled Docs](https://docs.tilled.com/)<br>
[API Docs](https://docs.tilled.com/api)<br>
[Tilled.js](https://docs.tilled.com/tilledjs/)<br>
