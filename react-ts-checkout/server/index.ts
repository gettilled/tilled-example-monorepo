import express, { Request, Response } from "express";
import cors from "cors";
import {
    Configuration,
    PaymentIntentsApi,
    SubscriptionsApi,
    PaymentMethodsApi,
    PaymentIntentCreateParams,
    PaymentIntentConfirmParams,
    PaymentMethodAttachParams,
    SubscriptionCreateParams,
} from "tilled-node";
import * as dotenv from "dotenv";
dotenv.config();

const basePath = "https://sandbox-api.tilled.com";
const port = process.env.port || 5052;

const app = express();
app.use(express.json());
app.use(cors());

// set up the configuration
const config = new Configuration({ apiKey: process.env.TILLED_SECRET_KEY, basePath, baseOptions: { timeout: 2000 } })

// Set up apis
const paymentIntentsApi = new PaymentIntentsApi(config);
const subscriptionsApi = new SubscriptionsApi(config);
const paymentMethodsApi = new PaymentMethodsApi(config);

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

    paymentIntentsApi
        .createPaymentIntent(
            { tilled_account, PaymentIntentCreateParams: req.body }
        )
        .then(response => {
            return response.data;
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
    const { id } = req.params;

    paymentIntentsApi
        .confirmPaymentIntent(
            { tilled_account, id, PaymentIntentConfirmParams: req.body }
        )
        .then(response => {
            return response.data;
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
    paymentMethodsApi
        .attachPaymentMethodToCustomer(
            { tilled_account, id, PaymentMethodAttachParams: req.body }
        )
        .then(response => {
            return response.data;
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
    paymentMethodsApi
        .listPaymentMethods(req.query)
        .then(response => {
            return response.data;
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

app.post('/subscriptions', (req: Request & {
    headers: {
        tilled_account: string
    },
    body: SubscriptionCreateParams,
}, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const { tilled_account } = req.headers;
    const createSubscriptionParams = req.body;

    subscriptionsApi
        .createSubscription(
            { tilled_account, SubscriptionCreateParams: req.body }
        )
        .then(response => {
            return response.data;
        })
        .then(data => {
            res.json(data)
            console.log(data)
        })
        .catch(error => {
            console.error(error);
            res.status(404).json(error)
        });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    //   open(`http://localhost:${port}`)
})