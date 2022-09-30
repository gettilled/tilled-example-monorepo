import React from "react";

import { useForm } from "react-hook-form";

export default function CreditCardFields() {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <div>
      <label className="flex flex-col p-3">
        Card Number
        <div className="tilled-js_input max-width-max border rounded-md flex justify-between">
          <div id="card-number-element" {...register("cardNumber", { required: true, maxLength: 15 })} />
          <div id="card-brand-icon" />
        </div>
        {errors.cardNumber?.type === "required" && "Card Number is required"}
      </label>
      <div className="grid grid-cols-2">
        <label className="flex flex-col p-3">
          Expiration
          <div
            className="tilled-js_input border rounded-md"
            id="card-expiration-element"
            {...register("expiration", { required: true })}
          />
          {errors.expiration?.type === "required" && "Expiration is required"}
        </label>
        <label className="flex flex-col p-3">
          CVV
          <div
            className="tilled-js_input border rounded-md"
            id="card-cvv-element"
            {...register("cvv", { required: true, maxLength: 3 })}
          />
          {errors.cvv?.type === "required" && "cvv is required"}
        </label>
      </div>
    </div>
  );
}
