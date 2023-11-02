import { useEffect } from 'react';
import useScript from './useScript';

// This hook should be called from inside the form field components ach-debit-fields.js and credit-card-fields.js
export default function useTilled(
	account_id,
	public_key,
	type,
	paymentTypeObjRef,
	fieldOptions
) {
	// const paymentTypeObjRef.current[type] = paymentTypeObjRef.current[type]Ref.current[type];

	// dynamically load tilled.js when component mounts
	const status = useScript('https://js.tilled.com/v2', 'tilled-js-script');
	const message =
		status === 'error'
			? 'Tilled.js was unable to load.'
			: `Tilled.js is ${status}.`;

	async function initTilled() {
		console.log('Initializing Tilled', paymentTypeObjRef.current[type]);

		// Create a new tilled instance
		if (!paymentTypeObjRef.current[type].tilled) {
			paymentTypeObjRef.current[type].tilled = new window.Tilled(
				public_key,
				account_id,
				{
					sandbox: true,
					log_level: 0,
				}
			);
		}

		// await the form
		paymentTypeObjRef.current[type].form = await paymentTypeObjRef.current[
			type
		].tilled.form({
			payment_method_type: paymentTypeObjRef.current[type].type,
		});

		// teardown to remove old fields
		paymentTypeObjRef.current[type].form.teardown();

		// loop through fields and inject them
		Object.entries(paymentTypeObjRef.current[type].fields).forEach((entry) => {
			const [field, fieldId] = entry;
			const fieldElement = document.getElementById(fieldId.slice(1));

			if (fieldElement.childElementCount === 0)
				paymentTypeObjRef.current[type].form
					.createField(field, fieldOptions ? fieldOptions : {})
					.inject(fieldElement);
		});

		// update card brand
		if (
			paymentTypeObjRef.current[type].type === 'card' &&
			document.getElementById('card-brand-icon')
		) {
			paymentTypeObjRef.current[type].form.fields.cardNumber.on(
				'change',
				(evt) => {
					const cardBrand = evt.brand;
					const icon = document.getElementById('card-brand-icon');

					switch (cardBrand) {
						case 'amex':
							icon.classList = 'fa fa-cc-amex';
							break;
						case 'mastercard':
							icon.classList = 'fa fa-cc-mastercard';
							break;
						case 'visa':
							icon.classList = 'fa fa-cc-visa';
							break;
						case 'discover':
							icon.classList = 'fa fa-cc-discover';
							break;
						case 'diners':
							icon.classList = 'fa fa-cc-diners-club';
							break;
						default:
							icon.classList = '';
					}
				}
			);
		}
		// Build the form
		paymentTypeObjRef.current[type].form.build();
		console.log('Tilled initialized', paymentTypeObjRef.current[type]);
	}

	function teardown() {
		if (paymentTypeObjRef.current[type].form) {
			paymentTypeObjRef.current[type].form.teardown((success) => {
				paymentTypeObjRef.current[type].form = undefined;
				console.log('The form teardown has run successfully:', success);
			});
		}
	}

	useEffect(() => {
		// We could probably proxy the status, but this is simpler
		if (status === 'ready') initTilled();

		return teardown();
	});

	return message;
}
