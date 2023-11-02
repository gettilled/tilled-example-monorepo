import {
    Configuration,
    PaymentMethodsApi,
} from "tilled-node";
import * as dotenv from "dotenv";
dotenv.config();

const basePath = "https://sandbox-api.tilled.com";

// set up the configuration
const config = new Configuration({ apiKey: process.env.TILLED_SECRET_KEY, basePath, baseOptions: { timeout: 2000 } });

// Set up apis
const paymentMethodsApi = new PaymentMethodsApi(config);

export async function handler(event, context) {
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const query = event.queryStringParameters;

    try {
        const response = await paymentMethodsApi.listPaymentMethods(query);
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