import express, { Request, Response } from "express";
import cors from "cors";
import {
    PaymentIntentsApi,
    PaymentIntentsApiApiKeys,
} from "../tilled-api-client/api/paymentIntentsApi";
import {
    PayoutsApi,
    PayoutsApiApiKeys
} from "../tilled-api-client/api/payoutsApi"
import {
    BalanceTransactionsApi,
    BalanceTransactionsApiApiKeys
} from "../tilled-api-client/api/balanceTransactionsApi"
import {
    SubscriptionsApi,
    SubscriptionsApiApiKeys,
} from "../tilled-api-client/api/subscriptionsApi";
import { Subscription } from "../tilled-api-client/model/subscription";
import {
    PaymentMethodsApi,
    PaymentMethodsApiApiKeys
} from "../tilled-api-client/api/paymentMethodsApi";
import { PaymentMethod } from "../tilled-api-client/model/paymentMethod";
import * as dotenv from "dotenv";
import { PaymentIntentCreateParams } from "../tilled-api-client/model/paymentIntentCreateParams";
import { PaymentIntentConfirmParams } from "../tilled-api-client/model/paymentIntentConfirmParams";
import { PaymentMethodAttachParams } from "../tilled-api-client/model/paymentMethodAttachParams";
dotenv.config();
// const tilled_account = process.env.TILLED_ACCOUNT;
const tilledSecretApiKey = process.env.TILLED_SECRET_KEY;
const baseUrl = "https://sandbox-api.tilled.com";
const port = process.env.port || 5051;

const app = express();
app.use(express.json());
app.use(cors());


// Set up apis
const paymentIntentsApi = new PaymentIntentsApi();

paymentIntentsApi.setApiKey(
    PaymentIntentsApiApiKeys.TilledApiKey,
    tilledSecretApiKey
);
paymentIntentsApi.basePath = baseUrl;

const paymentMethodsApi = new PaymentMethodsApi();
paymentMethodsApi.setApiKey(
    PaymentMethodsApiApiKeys.TilledApiKey,
    tilledSecretApiKey
);
paymentMethodsApi.basePath = baseUrl;

app.post('/payment-intents', (req: Request & {
    headers: {
        tilled_account: string
    },
    body: PaymentIntentCreateParams,
}, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const { tilled_account } = req.headers;
    const paymentIntentCreateParams = req.body
    paymentIntentsApi
        .createPaymentIntent(
            tilled_account,
            paymentIntentCreateParams
        )
        .then(response => {
            return response.body;
        })
        .then(data => {
            res.json(data);
            console.log(data);
        })
        .catch(error => {
            console.error(error);
            res.status(404).json(error)
        });
})

app.post('/payment-intents/:id/confirm', (req: Request & {
    headers: {
        tilled_account: string
    },
    params: {
        id: string,
    },
    body: PaymentIntentConfirmParams,
}, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const { tilled_account } = req.headers;
    const id = req.params.id;
    const paymentIntentConfirmParams = req.body
    console.log('-------------req.body-------------', paymentIntentConfirmParams)
    paymentIntentsApi
        .confirmPaymentIntent(
            tilled_account,
            id,
            req.body as PaymentIntentConfirmParams
        )
        .then(response => {
            return response.body;
        })
        .then(data => {
            res.json(data);
            console.log(data);
        })
        .catch(error => {
            console.error(error);
            res.status(404).json(error)
        });
})

app.post('/payment-methods/:id/attach', (req: Request & {
    headers: {
        tilled_account: string
    },
    params: {
        id: string,
    },
    body: PaymentMethodAttachParams,
}, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const { tilled_account } = req.headers;
    const id = req.params.id;
    const paymentMethodAttachParams = req.body
    paymentMethodsApi
        .attachPaymentMethodToCustomer(
            tilled_account,
            id,
            paymentMethodAttachParams
        )
        .then(response => {
            return response.body;
        })
        .then(data => {
            res.json(data);
            console.log(data);
        })
        .catch(error => {
            console.error(error);
            res.status(404).json(error)
        });
})

app.get('/listPaymentMethods', (req: Request & {
    query: {
        tilled_account: string,
        type: 'card' | 'ach_debit' | 'eft_debit',
        customer_id: string,
        metadata?: { [key: string]: string },
        offset?: number,
        limit?: number
    }
}, res: Response & {
    json: any;
    send: any;
    status: any;
}) => {
    let { tilled_account, type, customer_id, metadata, offset, limit, } = req.query;

    paymentMethodsApi
        .listPaymentMethods(
            tilled_account,
            type,
            customer_id,
            metadata || undefined,
            offset || 0,
            limit || 100,
        )
        .then(response => {
            return response.body;
        })
        .then(data => {
            res.json(data)
            console.log(data)
        })
        .catch(error => {
            console.error(error);
            res.status(404).json(error)
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    //   open(`http://localhost:${port}`)
})