:warning: This repository contains a standalone example to be used as a reference to help our partners integrate with Tilled. It is **not** intended to be implemented in a production environment nor is it intended to be installed as a dependency in any way.

## Dependencies

- [Vite](https://vitejs.dev/)
- [Node.js](https://nodejs.org)
- [TailwindCSS](https://tailwindcss.com/)
- [Material UI](https://mui.com/)
- [tilled-node](https://www.npmjs.com/package/tilled-node)

You can find documentation for `tilled-node` on
[docs.tilled.com](https://docs.tilled.com/resources/sdks/tilled-node/) and
[Github Pages](https://gettilled.github.io/tilled-node/).

## Get started

- Clone the project
- Install dependencies (be sure to navigate to the directory for this project
  `cd react/react-ts-checkout`):
  ```
  $ npm install
  $ cd client && npm install
  ```

## Create a sandbox account and add your configuration values

- Create a .env file in this project's root directory (`react-ts-checkout`)
  with your secret API key:

```
TILLED_SECRET_KEY=sk_XXXX
```

- Create a second .env file in the client directory
  (`react-ts-checkout/client`) with your merchant's `account_id` and your
  publishable API key.

```
VITE_TILLED_PUBLIC_KEY=pk_XXXX
VITE_TILLED_MERCHANT_ACCOUNT_ID=acct_XXXX
VITE_TILLED_CUSTOMER_ID=cus_XXXX // needed if you want to save and use saved payment methods
VITE_TILLED_MERCHANT_NAME=Merchant's Name // use your merchant's name in the checkout summary
VITE_TILLED_MERCHANT_TAX = 1.08 // add the sales tax for your merchant
```

_Note: Vite environment variables must be prefixed with `VITE_` and they must be
included in a separate .env file in the client directory to work properly.\_

## Start your backend and client servers

- Enter the following command from this project's root:

```
$ npm run dev
```

## Process your first payment

<p align="center">
  <img src="./assets/react-ts-checkout.png" />
</p>

- Navigate to [http://localhost:5173](http://localhost:5173) in your browser,
  fill out the billing details, enter `4037111111000000` as the test card
  number with a valid expiration date and `123` as the CVV Code and click Pay
- Optional: Look in the browser's developer console to see payment intent
  creation logs
- Go [here](https://sandbox-app.tilled.com/payments) to see your payment

## Updating the Cart

The Checkout component takes a single property, `cart`. The cart is hard-coded
in
[App.tsx](https://github.com/gettilled/tilled-example-monorepo/blob/react-ts-checkout/react-ts-checkout/client/src/App.tsx)
for simplicity. The optional property, `subscription`, contains subscription
data; if included, it will create a separate subscription for that item. Ex:

<p align="center">
  <img src="./assets/cart.png" />
</p>

## Detect duplicate payments in the last 5 minutes

Initialize [`preventDuplicates`](https://github.com/gettilled/tilled-example-monorepo/blob/4c706c6465c4280c79ea5a3021f46c367842a998/react/react-ts-checkout/client/src/components/Checkout/index.tsx#L38) as true to prevent accidental payments.
```
  const [preventDuplicates, setPreventDuplicates] = useState(false); // change this to true to detect duplicate payments in the last 5 minutes
```

This will:
- Pass the `prevent_duplicates` param to our [server](https://github.com/gettilled/tilled-example-monorepo/blob/master/react/react-ts-checkout/server/index.ts#L51), resulting in additional call to list payment intents to check for payment intents with the same `amount` and `metadata` that were created in the last 5 minutes:
```typescript
if (prevent_duplicates) {
          const now = new Date();
          const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
  
          // Check for duplicate payment intents
          const response = await paymentIntentsApi.listPaymentIntents({
            tilled_account,
            q: (payment_intent.amount/100).toFixed(2),
            created_at_gte: fiveMinutesAgo.toISOString(),
            metadata: payment_intent.metadata,
          });
  
          const data = response.data;
          console.log(data);
          if (data.items.length > 0) {
            // If duplicate found, return early with a 409 status
            return res.status(409).json({
                message: "Duplicate payment detected. Please try again if this payment was created intentionally.",
                data: data.items,
            });
          }
        }
```
- If duplicates are found, it logs the data and returns a 409 status with a message indicating a duplicate payment was detected.
- The client [handles the error](https://github.com/gettilled/tilled-example-monorepo/blob/master/react/react-ts-checkout/client/src/components/Checkout/index.tsx#L83) by displaing an Error component:
```tsx
f (isError) {
    const errorMessage =
      (error as any)?.response?.status === 409
        ? "Duplicate payment detected. Please try again."
        : (error as any)?.message || "An unknown error occurred";

    return <Error message={errorMessage} tryAgain={tryAgain} />;
  }
```
- From this component, the user can click "Try Again" to retry the payment with `preventDuplicates = false` to bypass the check.

## useTilled

This hook was created to make this example more reactive and to make it easier
for Tilled partners to get up and running with Tilled. This version is written
in Typescript.

### Parameters

```typescript
account_id: string,
public_key: string,
paymentTypeObj: {
    type: string,
    fields: {
        cardNumber?: React.MutableRefObject<any>,
        cardExpiry?: React.MutableRefObject<any>,
        cardCvv?: React.MutableRefObject<any>,
        bankRoutingNumber?: React.MutableRefObject<any>,
        bankAccountNumber?: React.MutableRefObject<any>
    },
    cardBrandIcon?: React.MutableRefObject<any>
},
tilled: React.MutableRefObject<any>,
options: ITilledFieldOptions
```

- `account_id`: the Tilled merchant account id. Ex: acct_XXXX
- `public_key`: publishable Tilled API key. Ex: pk_XXXX
- `paymentTypeObj`: an object with the payment method type and and object
  describing the fields to be injected. Ex:

```typescript
const cardObject = {
	type: 'card',
	fields: {
		cardNumber: numberInputRef,
		cardExpiry: expirationInputRef,
		cardCvv: cvvInputRef,
	},
};
```

- `fieldOptions`: The Tilled.js form
  [options object](https://docs.tilled.com/tilledjs/#formcreatefieldformfieldtype-options-formfield)
  as well as option on focus/blur/error callbacks. Ex:

```typescript
export const TilledFieldOptions = {
    fieldOptions: {
        styles: {
            base: {
                fontFamily:
                    '-apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                color: '#304166',
                fontWeight: '400',
                fontSize: '16px',
            },
            invalid: {
                ':hover': {
                    textDecoration: 'underline dotted red',
                },
                color: '#777777',
            },
            valid: {
                color: '#32CD32',
            },
        },
    },
    onFocus(field: { element: Element, valid: boolean }) {
        const { element, valid } = field;
        const label = element.nextElementSibling;

        applyBaseStyles(element, label);

        if (valid) {
            element.classList.add(...focusStyles.element);
            label?.classList.add(...focusStyles.label);
        } else {
            element.classList.add(...errorStyles.element);
            label?.classList.add(...errorStyles.label);
        }
    },
    onBlur(field: { element: Element, empty: boolean, valid: boolean }) {
        const { element, empty, valid } = field;
        const label = element.nextElementSibling;

        applyBaseStyles(element, label);
        if (valid) {
            element.classList.add(...blurStyles.element);
            label?.classList.add(...blurStyles.label);
        } else {
            element.classList.add(...errorStyles.element);
            label?.classList.add(...errorStyles.label);
        }

        if (empty) {
            label?.classList.remove('text-xs');
            label?.classList.add(...emptyStyles.label);
        } else {
            label?.classList.add('top-0', 'text-xs');
        }
    },
    onError(field: { element: Element }) {
        const element = field.element;
        const label = element.nextElementSibling;

        applyBaseStyles(element, label);
        element.classList.add(...errorStyles.element);
        label?.classList.add(...errorStyles.label);
    }
};
```
[Link to example](

### Functionality

This hook can be called from inside the component containing the Tilled.js
fields and uses the `useScript` hook to insert the Tilled.js script into the
DOM. When the component it's called from mounts, it waits until the script is
ready and then does the following:

- Creates a new Tilled instance
- Awaits a new form instance
- Loops through and inject the `paymentTypeObj.fields`
- Builds the form

Once the component unmounts, it checks to see if a form exists and runs the
[teardown method](https://docs.tilled.com/tilledjs/#formteardownhandler-promiseboolean--void)
and returns a status message.

### Usage

Invoke the hook from inside the component containing your Tilled.js fields:

<p align="center">
  <img src="./assets/creditcard-component.png" />
</p>

## Other helpful notes

- A tilled ref is created in the Checkout component with separate tilled
  instances for card and ach_debit. These instances are a sort of shared state
  between the fields components (ach-debit-fields.tsx and
  credit-card-fields.tsx) and App.tsx (specifically the submit logic).
  `confirmPayment` and `createPaymentMethod` are methods of the tilled
  instances created with `useTilled`. Therefore, the ref needs to be lifted to
  their closest common ancestor, App.js. For more information on lifting
  state, visit the
  [Lifting State Up](https://reactjs.org/docs/lifting-state-up.html) page in
  React's documentation.
- By design, Tilled.js inserts iFrames into the DOM for PCI compliance. The
  values therein **cannot** be accessed by your client-side code. Running the
  teardown function, as demonstrated in `useTilled` **will** delete the form
  instance and the values stored in its respective iFrames. This will prevent
  duplicate form inputs that could result in difficult to troubleshoot errors.
