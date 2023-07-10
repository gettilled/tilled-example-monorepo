import { useState, useRef, SetStateAction } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CreditCardFields from "./components/CreditCardFields";
import AchDebitFields from "./components/AchDebitFields";
import BillingDetailsFields from "./components/BillingDetailsFields";
import PaymentMethodsSelect from "./components/PaymentMethodsSelect";
import { TilledFieldOptions } from "./utils/TilledFieldOptions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import "./index.css";

import {
  Box,
  FormGroup,
  FormControlLabel,
  Tabs,
  Tab,
  Switch,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import {
  IPaymentMethodResponse,
  IPaymentMethodParams,
} from "../../models/PaymentMethods";
import { IPaymentIntent } from "../../models/PaymentIntents";
import SubmitButton from "./components/SubmitButton";
import ApplePayComponent from "./components/ApplePayComponent";

declare global {
  interface Window {
    ApplePaySession: any;
  }
}

const pk_PUBLISHABLE_KEY = import.meta.env.VITE_TILLED_PUBLIC_KEY as string;
const account_id = import.meta.env.VITE_TILLED_MERCHANT_ACCOUNT_ID as string;
const customer_id = import.meta.env.VITE_TILLED_CUSTOMER_ID;

const ExpandIcon = styled(ExpandMoreIcon)({
  marginRight: "-0.6rem",
});

function PaymentForm(props: {
  paymentIntent?: IPaymentIntent;
  total: number; // Adds the total property to the ApplePay paymentRequest
}) {
  const { paymentIntent, total } = props;
  const [type, setType] = useState("card");
  const [isNativePaymentVisible, setIsNativePaymentVisible] = useState(true);

  const [supportsApplePay, setSupportsApplePay] = useState(
    window.ApplePaySession && window.ApplePaySession.canMakePayments()
  ); // Check if the user can make Apple Pay payments

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
  const {
    handleSubmit,
    control,
    // formState: { errors }, // Can't use this because form validation triggers a re-render
    setError,
  } = useForm<FormValues | any>();

  const paymentMethodId = useRef("");
  const tilled = useRef({ card: null, ach_debit: null });

  const onSubmit = async (data: FormValues) => {
    if (tilled.current === null) throw new Error("Tilled not loaded");

    const tilledInstance: any =
      tilled.current[type as keyof typeof tilled.current]; // cast tilled.current to any to avoid TS errors
    let newPM: IPaymentMethodResponse | null = null;
    let tilledParams: {
      payment_method?: string;
    };
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

    if (paymentMethodId.current) {
      console.log(
        "Processing payment with selected pm:",
        paymentMethodId.current
      );

      tilledParams = {
        payment_method: paymentMethodId.current,
      };
    } else {
      console.log("creating new pm", type, billing_details);
      let paymentMethodParams: IPaymentMethodParams = {
        type,
        billing_details,
      };
      if (type === "ach_debit" && account_type)
        paymentMethodParams.ach_debit = {
          account_type,
          account_holder_name: name.slice(0, 22),
        };
      console.log(paymentMethodParams);
      console.log(tilledInstance);

      paymentMethodParams.ach_debit = newPM =
        await tilledInstance.createPaymentMethod(paymentMethodParams);

      if (newPM) {
        tilledParams = { payment_method: newPM.id };
        console.log("new pm", newPM);
      } else return console.error("no new pm");
    }

    if (savePaymentMethod && newPM) {
      console.log("attaching pm to customer", newPM);
      const response = await fetch(`/api/payment-methods/${newPM.id}/attach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          tilled_account: account_id,
        },
        body: JSON.stringify({
          customer_id,
        }),
      });
      console.log(response);
    }
    if (paymentIntent) {
      try {
        const response: Promise<IPaymentIntent> =
          await tilledInstance.confirmPayment(
            paymentIntent.client_secret,
            tilledParams
          );

        console.log(response);
      } catch (error) {
        setError("noResponse", {
          type: "tilledjsError",
          message: "no response",
        });
        console.error(error);
      }
      console.log("confirmed payment");
    }
    // TODO: Handle response => display receipt
  };

  const handleChange = (
    _: React.SyntheticEvent,
    newValue: SetStateAction<string>
  ) => {
    setType(newValue);
  };

  const clientSecret = paymentIntent?.client_secret as string;

  return (
    <Box
      className="App checkout-app max-w-md p-5 items-center justify-center mx-auto"
      sx={{
        margin: "auto",
      }}
    >
      {/* Only render ApplePayComponent if user can make Apple Pay payments (For Demo purposes, I have added an error message if the user cannot make Apple Pay payments) */}
      {supportsApplePay ? (
        <ApplePayComponent
          account_id={account_id}
          public_key={pk_PUBLISHABLE_KEY}
          tilled={tilled}
          total={total}
          clientSecret={clientSecret}
        />
      ) : (
        <Typography
          variant="body1"
          style={{
            color: "error",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Apple Pay is not available on this device
        </Typography>
      )}
      {customer_id ? (
        <div className="mb-3">
          <PaymentMethodsSelect
            paymentMethodId={paymentMethodId}
            account_id={account_id}
            type={type}
            customer_id={customer_id}
          />
        </div>
      ) : (
        ""
      )}
      <Box component="form" autoComplete="off">
        <Accordion
          sx={{
            boxShadow: "none",
            border: "#C4C4C4 0.063rem solid",
            borderRadius: "0.3rem",
            ":hover": {
              border: "black 0.063rem solid",
            },
            "&.Mui-expanded": {
              border: "transparent 0.063rem solid",
              ":hover": {
                border: "#C4C4C4 0.063rem solid",
              },
              ":active": {
                border: "transparent 0.063rem solid",
              },
            },
            backgroundColor: "transparent",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandIcon />}
            sx={{
              height: "3.5rem",
              color: "text.secondary",
              borderRadius: "0.3rem",
              ":hover": {
                backgroundColor: "#F5F5F5",
                color: "text.primary",
              },
              "&.Mui-expanded": {
                ":hover": {
                  backgroundColor: "transparent",
                },
              },
            }}
          >
            Create a new payment method
          </AccordionSummary>
          <AccordionDetails>
            <BillingDetailsFields form={{ control }} />
            <Tabs
              className="mt-2"
              value={type}
              onChange={handleChange}
              centered
            >
              <Tab key="tab-card" label="Card" value="card" />
              <Tab
                key="tab-ach_debit"
                label="Bank Transfer"
                value="ach_debit"
              />
            </Tabs>
            <Box className="mt-2">
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
          </AccordionDetails>
        </Accordion>
        {customer_id ? (
          <Box className="mt-6 text-slate-600">
            <Controller
              defaultValue={false}
              control={control}
              name="savePaymentMethod"
              render={({ field }) => (
                <FormGroup>
                  <FormControlLabel
                    className="flex justify-center"
                    control={<Switch color="primary" {...field} />}
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
        />
      </Box>
    </Box>
  );
}

export default PaymentForm;
