import { MutableRefObject, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useQuery } from "react-query";
import Error from "../../Error/Error";
import { Stack } from "@mui/system";
import {
  IAchDebit,
  ICard,
  IEftDebit,
  IPaymentMethodResponse,
} from "../../../models/PaymentMethods";

export default function PaymentMethodsSelect(props: {
  paymentMethodId: MutableRefObject<string>;
  account_id?: string;
  type: string;
  customer_id: string;
}) {
  const { account_id, type, customer_id, paymentMethodId } = props;
  // const { paymentMethodId, setPaymentMethodId } = state;

  const fetchPaymentMethods = async () => {
    const params = {
      tilled_account: account_id,
      type,
      customer_id,
    };
    const response = await fetch(
      "/api/listPaymentMethods?" + new URLSearchParams(params as any)
    );

    if (!response.ok)
      throw new (Error as any)(
        `Unable to fetch payment methods from backend. Status: ${response.statusText}`
      );

    return response.json();
  };

  const { isLoading, isError, error, data, isFetching, isPreviousData } =
    useQuery(["listPaymentMethods"], () => fetchPaymentMethods());
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const paymentMethods = (
    data as {
      has_more: boolean;
      items: Array<IPaymentMethodResponse>;
      limit?: number;
      offset?: number;
      total?: number;
    }
  )?.items;

  const handleChange: (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => void = (e) => {
    paymentMethodId.current = e.target.value;
    setSelectedPaymentMethod(paymentMethodId.current);
  };

  const paymentMethodOption = (pm: {
    updated_at: string;
    created_at: string;
    chargeable: boolean;
    type: string;
    id: string;
    card?: ICard;
    ach_debit?: IAchDebit | null;
    eft_debit?: IEftDebit | null;
  }) => {
    const { chargeable, type, id } = pm;
    let option;

    if (!chargeable) return;

    if (type === "card" && pm.card) {
      const { last4, brand, funding } = pm.card;
      const brandStr = brand ? brand[0].toUpperCase() + brand.slice(1) : "";
      const fundingStr = funding
        ? funding[0].toUpperCase() + funding.slice(1)
        : "";
      option = (
        <MenuItem value={id} key={id}>
          {/* <CardIcon brand={brand} /> */}
          {brandStr + " (" + fundingStr + ")" + " ****" + last4}
        </MenuItem>
      );
    } else if (type === "ach_debit" && pm.ach_debit) {
      const { account_type, bank_name, last2 } = pm.ach_debit;
      option = (
        <MenuItem value={id} key={id}>
          {bank_name + " " + account_type + " ****" + last2}
        </MenuItem>
      );
    } else if (type === "eft_debit" && pm.eft_debit) {
      const { bank_name, last2 } = pm.eft_debit;
      option = (
        <MenuItem value={id} key={id}>
          {bank_name + " " + " ****" + last2}
        </MenuItem>
      );
    } else {
      option = "";
    }
    return option;
  };

  return isLoading ? (
    <Stack height={"7em"} spacing={2}>
      <Skeleton variant="rounded" width={"full"} height={"3em"} />
      <Skeleton variant="text" width={"full"} />
    </Stack>
  ) : isError ? (
    <div />
  ) : paymentMethods ? (
    <FormControl fullWidth>
      <InputLabel id="payment-method-select-label">
        Select a payment method
      </InputLabel>
      <Select
        IconComponent={ExpandMoreIcon}
        label="Select a payment method"
        labelId="payment-method-select-label"
        id="payment-method-select"
        value={selectedPaymentMethod}
        onChange={handleChange}
        variant="outlined"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {paymentMethods.map((pm) => paymentMethodOption(pm))}
      </Select>
    </FormControl>
  ) : (
    <div />
  );
}
