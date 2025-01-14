import { useState, useRef, SetStateAction } from "react";
import { useQuery } from "react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CreditCardFields from "./components/CreditCardFields";
import AchDebitFields from "./components/AchDebitFields";
import BillingDetailsFields from "./components/BillingDetailsFields";
import PaymentMethodsSelect from "./components/PaymentMethodsSelect";
import { TilledFieldOptions } from "./utils/TilledFieldOptions";
import { fetchPaymentIntent } from "./utils/fetchPaymentIntent";
import "./index.css";

import {
  Box,
  FormGroup,
  FormControlLabel,
  Tabs,
  Tab,
  Switch,
  Button,
} from "@mui/material";

import {
  IPaymentMethodResponse,
  IPaymentMethodParams,
} from "../../models/PaymentMethods";
import { IPaymentIntent } from "../../models/PaymentIntents";
import SubmitButton from "./components/SubmitButton";

const pk_PUBLISHABLE_KEY = import.meta.env.VITE_TILLED_PUBLIC_KEY as string;
const account_id = import.meta.env.VITE_TILLED_MERCHANT_ACCOUNT_ID as string;
const customer_id = import.meta.env.VITE_TILLED_CUSTOMER_ID;

function PaymentForm(props: {
  paymentIntent?: IPaymentIntent;
  amount?: number;
  subscriptions?: Array<{
    billing_cycle_anchor: Date | string;
    currency: string;
    interval_unit: string;
    price: number;
  }>;
  onSubmitted?: () => void;
}) {
  const { subscriptions, amount, onSubmitted } = props;
  let { paymentIntent } = props;
  const [type, setType] = useState("card");
  const buttonDisabledRef = useRef(false); // Ref to track button disabled state without re-rendering

  const [error, setError] = useState<Error | null>(null);

  type FormValues = {
    name: string;
    street: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    account_type?: string;
    savePaymentMethod: boolean;
  };

  const { handleSubmit, control } = useForm<FormValues | any>();

  const [paymentMethodId, setPaymentMethodId] = useState<string>("");
  const tilled = useRef({ card: null, ach_debit: null });

  const onSubmit = async (data: FormValues) => {
    if (tilled.current === null) throw new Error("Tilled not loaded");

    if (!paymentIntent && !subscriptions && !amount)
      throw new Error("No paymentIntent, subscriptions, or totals");

    if (buttonDisabledRef.current) {
      console.warn("Button is disabled. Submission skipped.");
      return;
    }

    buttonDisabledRef.current = true; // Disable the button
    try {
      if (amount && !paymentIntent) {
        const res = await fetchPaymentIntent(amount);
        if (!res) throw new Error("No paymentIntent");
        paymentIntent = res;
      }

      const tilledInstance: any =
        tilled.current[type as keyof typeof tilled.current];
      let newPM: IPaymentMethodResponse | null = null;
      let tilledParams: { payment_method?: string };

      const {
        name,
        street,
        country,
        state,
        city,
        zip,
        account_type,
        savePaymentMethod,
      } = data;

      const billing_details = {
        name,
        address: {
          street,
          country,
          state,
          city,
          zip,
        },
      };

      if (!paymentMethodId) {
        const paymentMethodParams: IPaymentMethodParams = {
          type,
          billing_details,
        };

        if (type === "ach_debit" && account_type) {
          paymentMethodParams.ach_debit = {
            account_type,
            account_holder_name: name.slice(0, 22),
          };
        }

        newPM = await tilledInstance.createPaymentMethod(paymentMethodParams);

        if (newPM) {
          tilledParams = { payment_method: newPM.id };
        } else {
          throw new Error("Failed to create a payment method");
        }
      } else {
        tilledParams = { payment_method: paymentMethodId };
      }

      if (savePaymentMethod && newPM) {
        await fetch(`/api/payment-methods/${newPM.id}/attach`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            tilled_account: account_id,
          },
          body: JSON.stringify({ customer_id }),
        });
      }

      if (paymentIntent) {
        await tilledInstance.confirmPayment(
          paymentIntent.client_secret,
          tilledParams
        );
      }

      if (subscriptions) {
        subscriptions.forEach(async (sub) => {
          await fetch("/api/subscriptions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              tilled_account: account_id,
            },
            body: JSON.stringify({
              ...sub,
              customer_id,
              payment_method_id: tilledParams.payment_method,
            }),
          });
        });
      }

      if (onSubmitted) onSubmitted();
    } catch (err) {
      setError(err as Error);
    } finally {
      buttonDisabledRef.current = false; // Re-enable the button
    }
  };

  const handleChange = (
    _: React.SyntheticEvent,
    newValue: SetStateAction<string>
  ) => {
    setType(newValue);
  };

  return !error ? (
    <Box
      className="App checkout-app max-w-md p-5 items-center justify-center mx-auto"
      data-testid="payment-form-container"
    >
      {customer_id ? (
        <PaymentMethodsSelect
          handler={(e) => setPaymentMethodId(e.target.value)}
          account_id={account_id}
          type={type}
          customer_id={customer_id}
        />
      ) : (
        ""
      )}
      <Box component="form" autoComplete="off">
        <BillingDetailsFields form={{ control }} />
        <Tabs className="mt-2" value={type} onChange={handleChange} centered>
          <Tab key="tab-card" label="Card" value="card" />
          <Tab key="tab-ach_debit" label="Bank Transfer" value="ach_debit" />
        </Tabs>
        <Box className="mt-2 mb-6">
          {type === "card" ? (
            <CreditCardFields
              account_id={account_id}
              public_key={pk_PUBLISHABLE_KEY}
              options={TilledFieldOptions}
              tilled={tilled}
            />
          ) : (
            <AchDebitFields
              account_id={account_id}
              public_key={pk_PUBLISHABLE_KEY}
              options={TilledFieldOptions}
              tilled={tilled}
              control={control}
            />
          )}
        </Box>
        {customer_id ? (
          <Box className="text-slate-600">
            <Controller
              defaultValue={subscriptions ? true : false}
              control={control}
              name="savePaymentMethod"
              // @ts-ignore: field has no type
              render={({ field }) => (
                <FormGroup>
                  <FormControlLabel
                    className="flex justify-center"
                    control={
                      <Switch
                        color="primary"
                        {...field}
                        disabled={subscriptions ? true : false}
                        defaultChecked={subscriptions ? true : false}
                      />
                    }
                    label="Save this payment method?"
                    labelPlacement="start"
                  />
                </FormGroup>
              )}
            />
          </Box>
        ) : (
          ""
        )}
        <SubmitButton
          handler={handleSubmit(onSubmit as SubmitHandler<FormValues>)}
          disabled={buttonDisabledRef.current} // Directly control the button state
        />
      </Box>
    </Box>
  ) : (
    <Box className="text-slate-600 text-center">
      <h1 className="text-2xl font-bold">Error: {error?.name}</h1>
      <p className="text-lg">{error?.message}</p>
    </Box>
  );
}

export default PaymentForm;
