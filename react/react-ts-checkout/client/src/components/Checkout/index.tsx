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
import { useState, useMemo } from "react";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#334155" },
    secondary: { main: "#01a2e9" },
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

export default function Checkout({ cart }: { cart: CartType }) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [preventDuplicates, setPreventDuplicates] = useState(false); // change this to true to detect duplicate payments in the last 5 minutes

  const subscriptions = useMemo(
    () => cart.filter((item) => item.subscription).map((item) => item.subscription!),
    [cart]
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (item.subscription ? 0 : item.price * item.quantity), 0),
    [cart]
  );

  // This is an ecommerce app, so we would create the payment intent as soon as the user adds
  // an item to the cart. This allows us to record all attempted payments for conversion metrics. This is just a
  // mock example, so we'll create the payment intent when the user goes to the checkout page.
  // Alternatively, we could create the payment intent when the user clicks the "Pay" button
  // if we don't care about this data.
  const {
    isLoading,
    isError,
    error,
    data: paymentIntent,
    refetch,
  } = useQuery<IPaymentIntent>(
    ["paymentIntent", total, preventDuplicates],
    () => fetchPaymentIntent(total, preventDuplicates),
    {
      enabled: total > 0,
      keepPreviousData: true,
      onError: (err: any) => {
        if (err.response?.status === 409) {
          // Handle duplicate case by resetting preventDuplicates flag
          setPreventDuplicates(false);
        }
      },
    }
  );

  const tryAgain = () => {
    setPreventDuplicates(false);
    refetch();
  };

  if (isLoading) return <LoadingWheel />;

  if (isError) {
    const errorMessage =
      (error as any)?.response?.status === 409
        ? "Duplicate payment detected. Please try again."
        : (error as any)?.message || "An unknown error occurred";

    return <Error message={errorMessage} tryAgain={tryAgain} />;
  }

  return (
    <div className="container bg-white rounded-xl w-max shadow-md p-4 m-auto">
      {showReceipt ? (
        <Receipt total={total} cart={cart} />
      ) : (
        <div className="lg:grid lg:grid-cols-2 lg:divide-x divide-slate-400/25">
          <CartSummary cart={cart} />
          <ThemeProvider theme={theme}>
            <PaymentForm
              paymentIntent={paymentIntent}
              amount={total}
              subscriptions={subscriptions}
              onSubmitted={() => setShowReceipt(true)}
            />
          </ThemeProvider>
        </div>
      )}
    </div>
  );
}
