import { useRef } from 'react';

import { useForm } from 'react-hook-form';
import useTilled from '../hooks/useTilled';

export default function CreditCardFields(props) {
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
		'card',
		props.paymentTypeObj,
		fieldOptions
	);
	console.log(status);

	return (
		<div>
			<label className="flex flex-col p-3">
				Card Number
				<div className="tilled-js_input max-width-max border rounded-md flex justify-between">
					<div
						id="card-number-element"
						{...register('cardNumber', { required: true, maxLength: 15 })}
					/>
					<div id="card-brand-icon" />
				</div>
				{errors.cardNumber?.type === 'required' && 'Card Number is required'}
			</label>
			<div className="grid grid-cols-2">
				<label className="flex flex-col p-3">
					Expiration
					<div
						className="tilled-js_input border rounded-md"
						id="card-expiration-element"
						{...register('expiration', { required: true })}
					/>
					{errors.expiration?.type === 'required' && 'Expiration is required'}
				</label>
				<label className="flex flex-col p-3">
					CVV
					<div
						className="tilled-js_input border rounded-md"
						id="card-cvv-element"
						{...register('cvv', { required: true, maxLength: 3 })}
					/>
					{errors.cvv?.type === 'required' && 'cvv is required'}
				</label>
			</div>
		</div>
	);
}
