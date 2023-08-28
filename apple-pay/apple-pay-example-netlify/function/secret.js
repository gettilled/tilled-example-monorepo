const secretKey = 'Add Your Key Here';
const axios = require('axios');

exports.handler = async (event, context) => {
	const tilledAccountId = event.path.split('/').pop();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: 'Bearer ' + secretKey,
		'tilled-account': tilledAccountId,
	};
	try {
		const response = await axios.post(
			'https://sandbox-api.tilled.com/v1/payment-intents',
			{
				amount: 5000,
				currency: 'usd',
				payment_method_types: ['card', 'ach_debit'],
			},
			{
				headers: headers,
			}
		);
		console.log('Successfully created payment intent:');
		console.log(response.data);
		return {
			statusCode: 200,
			body: JSON.stringify({ client_secret: response.data.client_secret }),
		};
	} catch (error) {
		let errorMsg = 'Unable to create and return paymentIntent';

		if (error.response) {
			// Request made and server responded
			console.log(error.response.data);
			errorMsg = error.response.data.message;
		} else if (error.request) {
			// The request was made but no response was received
			console.log(error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			console.log('Error', error.message);
		}

		return {
			statusCode: 400,
			body: JSON.stringify({ message: errorMsg }),
		};
	}
};
