import { IPaymentIntent } from "../../../models/PaymentIntents";

export const fetchPaymentIntent = async (
  amount: number,
  preventDuplicates = true
): Promise<IPaymentIntent> => {
  const tilledAccount = import.meta.env.VITE_TILLED_MERCHANT_ACCOUNT_ID;
  const salesTax = Number(import.meta.env.VITE_TILLED_MERCHANT_TAX) || 1;
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  if (tilledAccount) requestHeaders.set("tilled_account", tilledAccount);

  const response = await fetch("/api/payment-intents", {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({
      payment_intent: {
        amount: Math.round(amount * salesTax),
        currency: "usd",
        payment_method_types: ["card", "ach_debit"],
        metadata: {
            user_id: "user_12345",
        }, 
      },
      prevent_duplicates: preventDuplicates,
    }),
  });

  if (!response.ok)
    throw new (Error as any)(
      `Unable to fetch payments from backend. Status: ${response.statusText}`
    );

  return response.json();
};

export default fetchPaymentIntent;
