import * as dotenv from 'dotenv';
import {
  Configuration,
  PaymentIntentCreateParams,
  PaymentIntentsApi,
} from 'tilled-node';
const express = require('express');
const cors = require('cors');
dotenv.config();

const basePath = 'https://sandbox-api.tilled.com';
const port = process.env.port || 5052;

const app = express();
app.use(express.json());
app.use(cors());

// set up the configuration
const config = new Configuration({
  apiKey: process.env.TILLED_SECRET_KEY,
  basePath,
  baseOptions: { timeout: 2000 },
});

// Set up api client
const paymentIntentsApi = new PaymentIntentsApi(config);

app.post(
  '/payment-intents',
  (
    req: Request & {
      headers: {
        tilled_account: string;
      };
      body: PaymentIntentCreateParams;
    },
    res: Response & {
      json: any;
      send: any;
      status: any;
    }
  ) => {
    const { tilled_account } = req.headers;

    paymentIntentsApi
      .createPaymentIntent({
        tilled_account,
        PaymentIntentCreateParams: req.body,
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        res.json(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
        res.status(404).json(error);
      });
  }
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
