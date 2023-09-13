:warning: This repository contains a standalone example to be used as a reference to help our partners integrate with Tilled. It is **not** intended to be implemented in a production environment nor is it intended to be installed as a dependency in any way.

# Dependencies

- [PHP](https://www.php.net/downloads.php)
- [Composer](https://getcomposer.org/download/)
- [Laravel](https://laravel.com/docs/installation)

# Get started

- Clone the project
- Install dependencies *be sure to run this command from the* `laravel/laravel-php-checkout` *directory*:

  ```bash
  $ composer install
  ```

# Create a sandbox account and add your configuration values

- Create a .env file in this project's root directory `laravel-php-checkout` with your Secret API Key, Publishable API Key, Merchant Account ID, Customer ID, and a blank value for `APP_KEY`:

  ```env
  # Leave this blank, it will be generated for you when `php artisan key:generate` is run
  APP_KEY =

  # Tilled Credentials
  # Tilled Merchant Account ID
  TILLED_ACCOUNT_ID=acct_...
  # Tilled Secret API Key
  TILLED_SECRET_KEY=sk_...
  # Tilled Publishable API Key
  TILLED_PUBLISHABLE_KEY=pk_...
  # Customer ID - Not required, but needed if you want to save and use saved payment methods
  TILLED_CUSTOMER_ID=cus_...
  ```

- After creating the .env file, in this project's root, run the following command to generate the key value for `APP_KEY`:

  ```bash
  $ php artisan key:generate
  ```

# Run the Laravel server

- Enter the following command from this project's root:

  ```bash
  $ php artisan serve
  ```

# Process your first payment

<p align="center">
  <img src="./assets/laravel-php-checkout.png">
</p>

- Open your web browser and go to [http://localhost:8000](http://localhost:8000/).
  - Enter `4037111111000000` as the card number, use a valid expiration date for the card, and enter `123` as the CVV code.
  - Fill out the billing details section.
  - Click the **Pay** to complete the payment.
    - Optionally, you can use your browser's developer console to review the logs related to the creation of the payment intent.
- To view the payment in the Tilled Console, go **[here](https://sandbox-app.tilled.com/payments)**.

- You can utilize the **[Testing](https://docs.tilled.com/docs/testing)** page in our Tilled Docs for Test Card Numbers and ACH routing numbers, Simulating Errors, and more.
  - For test cards to use in the Sandbox environment, see the **[Basic Test Card Numbers](https://docs.tilled.com/docs/testing#basic-test-cards)** section.
  - For ACH payments, the **Account Number** can be any 4 or 17-digit number, but the **Routing Number** must a valid test routing number. See the **[ACH Debit Testing](https://docs.tilled.com/docs/testing#ach-debit-testing)** section.

# Re-using and saving payment methods

To save a payment method, you must a value for `TILLED_CUSTOMER_ID` in your .env file. This Customer ID must be associated with the Merchant Account you are using.

# Saving a payment method

- In the browser, toggle the **Save payment method?** switch, make sure to fill out the billing details, and then click the **Save** button.
  - This will create the payment method and attach it to the customer.
- View the paymentMethod ID in the alert or the console.

# Using a the Customer's saved payment methods

- In the browser, select a payment method from the **Select a Payment Method** dropdown and then click the **Pay** button.
  - This will use the selected payment method to complete the payment.

# What's Next?

- [Tilled Docs](https://docs.tilled.com/docs)
- [Tilled.js Docs](https://docs.tilled.com/docs/payment-methods/tilledjs/)
- [API Docs](https://docs.tilled.com/api)
- [Partner Help Center](https://tilledpartners.zendesk.com/hc/en-us)