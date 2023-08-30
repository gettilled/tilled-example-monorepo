const public_key =
	'pk_AuYSsbLcWRrVx4AHAKU4FVLIgZlRLxf6LLtG04bspyo8YZnPhQsN9Ibm733Im3kUwGSpBy72QgfWhO1QJmtwPsWQdWmIssQWEVTs';
let account_id = 'acct_iITmFPIzjDBqiXOFwNv6V';

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

async function initTilled() {
	console.log('Initializing Tilled');

	// Create a new tilled instance
	tilled = new window.Tilled(public_key, account_id, {
		sandbox: true,
		log_level: 0,
	});

	// await the form
	const form = await tilled.form({
		payment_method_type: 'card',
	});

	// loop through fields and inject them
	Object.entries(fields).forEach((entry) => {
		const [field, fieldId] = entry;
		const fieldElement = document.getElementById(fieldId);
		console.log(fieldId, fieldElement);

		if (fieldElement.childElementCount === 0)
			form
				.createField(field, fieldOptions ? fieldOptions : {})
				.inject(fieldElement);
	});

	// Build the form
	form.build();
	console.log('Tilled initialized');
}

initTilled();
