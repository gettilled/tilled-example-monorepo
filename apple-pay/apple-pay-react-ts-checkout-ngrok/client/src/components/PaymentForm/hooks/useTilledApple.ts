import { useEffect, useRef } from "react";
import useScript from "./useScript";

declare global {
  interface Window {
    Tilled: any;
  }
}

export default function useTilledApple(
  account_id: string,
  public_key: string,
  tilled: React.MutableRefObject<any>,
  total: number, // adds the total to the paymentRequest
  clientSecret: any // the client secret from the paymentIntent
): string {
  const type = "card"; // Apple Pay will always be a card payment method
  const form = useRef(null);

  // Dynamically load Tilled.js when component mounts
  const status = useScript("https://js.tilled.com/v2", "tilled-js-script");
  const message =
    status === "error"
      ? "Tilled.js was unable to load."
      : `Tilled.js is ${status}.`;

  const getNativePaymentElement = (): HTMLElement | null => {
    return document.getElementById("native-payment-element");
  };

  async function initializePaymentAndForm() {
    // Create a new Tilled instance if one does not already exist for the specified payment type
    if (!tilled.current[type]) {
      tilled.current[type] = new window.Tilled(public_key, account_id, {
        sandbox: true,
        log_level: 0,
      });
    }

    const tilledInstance = tilled.current[type];
    const merchantName =
      import.meta.env.VITE_TILLED_MERCHANT_NAME || "Merchant"; // Uses default value "Merchant Name" if undefined

    // Create the PaymentRequest field and inject it
    const paymentRequest = tilledInstance.paymentRequest({
      total: {
        label: `${merchantName} Cart Total`,
        amount: total, // Use the total prop value for the amount
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    const formInstance = await tilledInstance.form({
      payment_method_type: type,
    });

    form.current = formInstance;

    const paymentRequestField = formInstance.createField(
      "paymentRequestButton",
      {
        paymentRequest: paymentRequest,
      }
    );
    // Check if the user can make an Apple Pay payment
    const canMakePayment = await paymentRequest.canMakePayment();
    if (canMakePayment) {
      paymentRequestField.inject("#native-payment-element");
    } else {
      // Hide the native payment element if the user cannot make a payment
      const nativePaymentElement = getNativePaymentElement();
      if (nativePaymentElement) {
        nativePaymentElement.style.display = "none";
      }
    }

    paymentRequest.on("paymentmethod", (ev: { paymentMethod: any; complete: (arg0: string) => void; }) => {
      const paymentMethod = ev.paymentMethod;
      tilledInstance
        .confirmPayment(clientSecret, {
          payment_method: paymentMethod.id,
        })
        .then(
          (paymentIntent: {
            status: string;
            last_payment_error: { message: any };
          }) => {
            if (
              paymentIntent.status === "succeeded" ||
              paymentIntent.status === "processing"
            ) {
              ev.complete("success");
              console.log("Successful payment");
            } else {
              ev.complete("fail");
              const errMsg = paymentIntent.last_payment_error?.message;
              console.error("Payment failed: " + errMsg);
            }
          },
          (err: any) => {
            ev.complete("fail");
            console.error(err);
          }
        )
        .catch((error: any) => {
          console.error("Error in payment method:", error);
        });
    });
    paymentRequest.on("cancel", (ev: any) => {
      console.log("Payment cancelled");
    });

    try {
      formInstance.build();
    } catch (error) {
      console.error("Error building form instance:", error);
    }
  }

  // Function to prevent duplicate Apple Pay buttons from being injected
  function cleanup() {
    const nativePaymentElement = getNativePaymentElement();
    if (nativePaymentElement) {
      nativePaymentElement.innerHTML = "";
    }
  }

  useEffect(() => {
    if (status === "ready") {
      initializePaymentAndForm();
      return cleanup;
    }
  }, [status]);

  return message;
}
