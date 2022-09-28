import React from 'react';
import { useForm } from 'react-hook-form';


export default function AchDebitFields() {
  const { register, formState: { errors } } = useForm();

  return (
    <div>
      <label className='flex flex-col p-3'>
        Account Type
        <select className='tilled-js_input max-width-max border rounded-md' id='bank-account-type-element' {...register("accountType")}>
          <option value="" />
          <option value="checking">Checking</option>
          <option value="savings">Saving</option>
        </select>
        {errors.accountType?.type === 'required' && "Account Type is required"}
      </label>
      <label className='flex flex-col p-3'>
        Account Number
        <div className='tilled-js_input max-width-max border rounded-md' id='bank-account-number-element' type="text" placeholder="" {...register("accountNumber", {required: true, maxLength: 16})} />
        {errors.accountNumber?.type === 'required' && "Account Number is required"}
      </label>
      <label className='flex flex-col p-3'>
        Routing Number
        <div className='tilled-js_input max-width-max border rounded-md' id='bank-routing-number-element' type="number" placeholder="" {...register("routingNumber", {required: true, maxLength: 10})} />
        {errors.routingNumber?.type === 'required' && "Routing Number is required"}
      </label>
    </div>
  );
}