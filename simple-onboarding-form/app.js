const dotenv = require("dotenv").config();
const { json } = require("express");
const express = require("express");
const { get } = require("https");
const app = express();
const path = require("path");
// const open = require('open')
const port = process.env.port || 7070;

const apiURL = "https://sandbox-api.tilled.com";
const headers = {
	"Content-Type": "application/json",
	Authorization: "Bearer " + process.env.TILLED_SECRET_KEY,
	"Tilled-Account": process.env.PARTNER_ACCOUNT_ID,
};

let merchantAccountId;

app.use(express.static("public"));
app.use(express.json());

app.get("/product-codes", (req, res) => {
	// Currently just gets all product codes for the partner account
	// Could be customized to only show certain PC's to merchant
	async function getProductCodes(url = "") {
		const response = await fetch(apiURL + url, {
			method: "GET",
			headers: headers,
		});
		return response.json();
	}

	getProductCodes("/v1/product-codes").then((data) => {
		res.json(data);
	});
});

app.post("/accounts/connected", (req, res) => {
	async function createAccount(url = "") {
		const response = await fetch(apiURL + url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(req.body),
		});
		return response.json();
	}

	createAccount("/v1/accounts/connected")
		.then((data) => {
			console.log(data);
			if (data.statusCode) data.reject(); // Force fail if response has a status code
			// if (data.statusCode.toString()[0] !== "2") data.reject(); // Force fail if statusCode isn't in 200s
			console.log("Connected account created successfully");
			// console.log('name: ' + req.body.name,'email: ' + req.body.email)

			merchantAccountId = data.id;
			console.log(merchantAccountId);
			res.json({ id: merchantAccountId });
		})
		.catch((error) => {
			let errorMsg = "Unable to create connected account.";

			if (error.response) {
				// Request made and server responded
				console.log(error.response.data);
				errorMsg = error.response.data.message;
			} else if (error.request) {
				// The request was made but no response was received
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log("Error", error.message);
			}
			res.status(400).send({ message: errorMsg });
		});
});

app.post(`/accounts`, (req, res) => {
	async function updateApplication(url = "") {
		const response = await fetch(apiURL + url, {
			method: "PUT",
			headers: headers,
			body: JSON.stringify(req.body),
		});

		return response.json();
	}

	// merchantAccountId = ""; // hardcode merchantId for testing
	updateApplication(`/v1/applications/${merchantAccountId}`)
		.then((data) => {
			console.log(data);

			if (data.statusCode) data.reject(); // Force fail if statusCode isn't in 200s

			// Submit application if validation_errors is defined and is not an empty array
			if (
				typeof data.validation_errors !== "undefined" &&
				data.validation_errors !== []
			) {
				async function submitApplication(url = "") {
					const response = await fetch(apiURL + url, {
						method: "POST",
						headers: headers,
					});

					return response.json();
				}

				submitApplication(`/v1/applications/${merchantAccountId}/submit`)
					.then((data) => {
						console.log(
							`Onboarding form for ${data.business_legal_entity.name} submitted successfully!`
						);
						res.json(data);
					})
					.catch((error) => {
						let errorMsg =
							"Unexpected error, we were unable to submit your merchant application.";

						if (error.response) {
							// Request made and server responded
							console.log(error.response.data);
							errorMsg = error.response.data.message;
						} else if (error.request) {
							// The request was made but no response was received
							console.log(error.request);
						} else {
							// Something happened in setting up the request that triggered an Error
							console.log("Error", error.message);
						}
					});
			}
			res.status(201).send(data);
		})
		.catch((error) => {
			let errorMsg = "Unable to submit onboarding form.";

			if (error.response) {
				// Request made and server responded
				console.log(error.response.data);
				errorMsg = error.response.data.message;
			} else if (error.request) {
				// The request was made but no response was received
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log("Error", error.message);
			}
			error.message = errorMsg;
			res.status(400).send(error);
		});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
	//   open(`http://localhost:${port}`)
});
