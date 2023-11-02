const tilledFormContainer = document.getElementById('tilled-js-form-container');
const client_secret = window.location.href.slice(-57);
const public_key = 'pk_XXXX';
const account_id = 'acct_XXXX';

const fields = {
	cardNumber: 'tilled-js-card-number-container',
	cardExpiry: 'tilled-js-expiry-date-container',
	cardCvv: 'tilled-js-cvv-container',
};
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
const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
});

(async function () {
	let tilled;
	try {
		tilled = new window.Tilled(public_key, account_id, {
			sandbox: true,
		});
	} catch (error) {
		// tilledFormContainer.innerHTML = error.message;
		console.error(error);
		return;
	}
	const form = await tilled.form({
		payment_method_type: 'card',
	});
	Object.entries(fields).forEach((entry) => {
		const [field, fieldId] = entry;
		const fieldElement = document.getElementById(fieldId);

		if (fieldElement.childElementCount === 0)
			form
				.createField(field, fieldOptions ? fieldOptions : {})
				.inject(fieldElement);
	});
	form.build();
	tilledFormContainer.addEventListener('submit', async function (event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const plainFormData = Object.fromEntries(formData.entries());
		const billing_details = {
			name: plainFormData.name,
			address: {
				country: plainFormData.country,
				zip: plainFormData.zip,
			},
		};
		const payment_intent = await tilled.confirmPayment(client_secret, {
			payment_method: {
				type: 'card',
				billing_details,
			},
		});
		if (!payment_intent)
			return (tilledFormContainer.innerHTML =
				'Payment failed: No payment intent found.');
		console.log(payment_intent);
		const response = await fetch(
			'/orders/' + payment_intent.metadata.order_number,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const order = await response.json();
		const line_items = order.line_items
			.map(
				(item) =>
					`<div class="flex justify-between"><p>${item.name}</p><p>${
						'$' + item.price
					}</p></div>`
			)
			.join('');
		console.log(order, line_items);
		tilledFormContainer.innerHTML =
			payment_intent.status === 'succeeded'
				? `
                <div class="flex flex-col gap-8">
                <div class="flex flex-col w-full text-gray-500 gap-4 bg-white p-4 pt-8 pb-4 rounded">
                <h2 class="text-xl text-center">
                    Receipt for Order #${payment_intent.metadata.order_number}
                </h2>
                <hr />
                <div class="flex flex-col">
                    <div class="flex justify-between">
                        <p>Date paid</p>
                        <p>${new Date(
													payment_intent.charges[0].captured_at
												).toLocaleDateString('en-US', {
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}</p>
                    </div>
                    <div class="flex justify-between">
                        <p>Amount paid</p>
                        <p>${formatter.format(
													payment_intent.charges[0].amount_captured / 100
												)}</p>
                    </div>
                    <div class="flex justify-between">
                        <p>Payment method</p>
                        <p>${
													payment_intent.payment_method.card.brand[0].toUpperCase() +
													payment_intent.payment_method.card.brand.slice(1)
												} ${payment_intent.payment_method.card.last4}</p>
                    </div>
                </div>
            </div>
            <div
                class="flex flex-col w-full text-gray-500 gap-4 bg-white p-4 pt-8 pb-4 rounded"
            >
                <div class="flex flex-col">
                    ${line_items}
                </div>
                <hr />
                <h2 class="text-xl text-center flex justify-between">
                    <div>Total:</div>
                    <div>${formatter.format(
											payment_intent.charges[0].amount_captured / 100
										)}</div>
                </h2>
            </div>
            </div>
            `
				: 'Payment failed:' + payment_intent?.last_payment_error?.message;
	});
})();
