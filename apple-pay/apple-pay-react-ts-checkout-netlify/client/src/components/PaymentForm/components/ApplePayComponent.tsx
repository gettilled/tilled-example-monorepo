import { useRef } from "react";
import useTilledApple from "../hooks/useTilledApple";
import { Divider } from "@mui/material";

export default function ApplePayComponent(props: {
  account_id: string;
  public_key: string;
  tilled: React.MutableRefObject<any>;
  total: number; // used to set the total amount for the paymentRequest
  clientSecret: string; // the client secret from the paymentIntent (used to confirm the payment)
}) {
  const { account_id, public_key, tilled, total, clientSecret } = props;
  const paymentRequestRef = useRef(null);
  const status = useTilledApple(
    account_id,
    public_key,
    tilled,
    total,
    clientSecret
  );

  return (
    <>
      <div
        id="native-payment-element"
        ref={paymentRequestRef}
        style={{
          marginTop: "-1rem",
          marginBottom: "1rem",
        }}
      />
      <Divider
        sx={{
          color: "text.secondary",
          marginTop: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        Or
      </Divider>
    </>
  );
}
