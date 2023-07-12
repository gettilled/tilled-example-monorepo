import {
    Configuration,
    PaymentIntentsApi,
    PaymentIntentCreateParams,
} from "tilled-node";
import * as dotenv from "dotenv";
dotenv.config();

const basePath = "https://sandbox-api.tilled.com";

// set up the configuration
const config = new Configuration({ apiKey: process.env.TILLED_SECRET_KEY, basePath, baseOptions: { timeout: 2000 } });

// Set up apis
const paymentIntentsApi = new PaymentIntentsApi(config);

export async function handler(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { tilled_account } = event.headers;
    const body: PaymentIntentCreateParams = JSON.parse(event.body);

    try {
        const response = await paymentIntentsApi.createPaymentIntent({
            tilled_account,
            PaymentIntentCreateParams: body,
        });
        const data = response.data;
        console.log(data);
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 404,
            body: JSON.stringify(error),
        };
    }
}