import React from 'react';
import { useForm } from 'react-hook-form';
import useTilled from '../hooks/useTilled';

export default function AchDebitFields(props) {
	const {
		register,
		formState: { errors },
	} = useForm();

	const fieldOptions = {
		styles: {
			base: {
				fontFamily:
					'-apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
				color: '#304166',
				fontWeight: '400',
				fontSize: '16px',
			},
			invalid: {
				':hover': {
					textDecoration: 'underline dotted red',
				},
				color: '#777777',
			},
			valid: {
				color: '#32CD32',
			},
		},
	};

	const status = useTilled(
		props.account_id,
		props.public_key,
		'ach_debit',
		props.paymentTypeObj,
		fieldOptions
	);
	console.log(status);

	return (
		<div>
			<label className="flex flex-col p-3">
				Account Type
				<select
					className="tilled-js_input max-width-max border rounded-md"
					id="bank-account-type-element"
					{...register('accountType')}
				>
					<option value="" />
					<option value="checking">Checking</option>
					<option value="savings">Saving</option>
				</select>
				{errors.accountType?.type === 'required' && 'Account Type is required'}
			</label>
			<label className="flex flex-col p-3">
				Account Number
				<div
					className="tilled-js_input max-width-max border rounded-md"
					id="bank-account-number-element"
					type="text"
					placeholder=""
					{...register('accountNumber', { required: true, maxLength: 16 })}
				/>
				{errors.accountNumber?.type === 'required' &&
					'Account Number is required'}
			</label>
			<label className="flex flex-col p-3">
				Routing Number
				<div
					className="tilled-js_input max-width-max border rounded-md"
					id="bank-routing-number-element"
					type="number"
					placeholder=""
					{...register('routingNumber', { required: true, maxLength: 10 })}
				/>
				{errors.routingNumber?.type === 'required' &&
					'Routing Number is required'}
			</label>
		</div>
	);
}
