import { useQuery } from "react-query";
import LoadingWheel from "../LoadingWheel";
import Error from "../Error/Error";
import PaymentForm from "../PaymentForm";
import CartSummary from "../CartSummary";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { fetchPaymentIntent } from "../PaymentForm/utils/fetchPaymentIntent";
import { IPaymentIntent } from "../../models/PaymentIntents";
import Receipt from "../Reciept";
import { useState } from "react";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#334155",
    },
    secondary: {
      main: "#01a2e9",
    },
  },
});

type Subscription = {
  billing_cycle_anchor: Date | string;
  currency: string;
  interval_unit: string;
  price: number;
};

export type CartType = Array<{
  name: string;
  price: number;
  imagePath: string;
  quantity: number;
  subscription?: Subscription;
}>;

export default function Checkout(props: { cart: CartType }) {
  const cart = props.cart;
  let loading = false;
  let errored = false;
  let errorObj = null;
  let paymentIntent: IPaymentIntent | undefined = undefined;
  let subscriptions: Array<Subscription> = [];
  const [showReceipt, setShowReceipt] = useState(false);

  cart.forEach((item) => {
    if (item?.subscription) subscriptions.push(item.subscription);
  });

  const total = cart
    .map((item) => (!item?.subscription ? item.price * item.quantity : 0)) // Convert the amounts to an array
    .reduce((acc, num) => acc + num, 0); // Sum the array

  // This is an ecommerce app, so we would create the payment intent as soon as the user adds
  // an item to the cart. This allows us to record all attempted payments for conversion metrics. This is just a
  // mock example, so we'll create the payment intent when the user goes to the checkout page.
  // Alternatively, we could create the payment intent when the user clicks the "Pay" button
  // if we don't care about this data.
  if (total > 0) {
    const { isLoading, isError, error, data } = useQuery(
      ["paymentIntent"],
      () => fetchPaymentIntent(total),
      {
        keepPreviousData: true,
      }
    );
    loading = isLoading;
    errored = isError;
    errorObj = error;
    paymentIntent = data;
  }

  // Uncomment for subscriptions only:
  // const isLoading = false;
  // const isError = false;
  // const error = null;

  return loading ? (
    <LoadingWheel />
  ) : (
    <div className="container bg-white rounded-xl w-max shadow-md p-4 m-auto">
      {errored ? (
        <Error message={(errorObj as any).message} />
      ) : showReceipt ? (
        <Receipt total={total} cart={cart} />
      ) : (
        <div className="lg:grid lg:grid-cols-2 lg:divide-x divide-slate-400/25">
          <>
            <CartSummary cart={cart} />
            <ThemeProvider theme={theme}>
              <PaymentForm
                paymentIntent={paymentIntent}
                amount={total}
                subscriptions={subscriptions}
                onSubmitted={() => setShowReceipt(true)}
              />
              {/* Uncomment to test subscriptions */}
              {/* <PaymentForm recurring={true} /> */}
            </ThemeProvider>
          </>
        </div>
      )}
    </div>
  );
}
