import express, { Request, Response } from "express";
import fs from "fs";
import cors from "cors";
import {
    Configuration,
    PaymentIntentsApi,
    SubscriptionsApi,
    PaymentMethodsApi,
    CheckoutSessionsApi,
    CheckoutSessionCreateParams,
    PaymentIntentCreateParams,
    PaymentMethodAttachParams,
    PaymentMethod,
} from "tilled-node";
import * as dotenv from "dotenv";
dotenv.config();

const basePath = "https://sandbox-api.tilled.com";
const port = process.env.port || 5053;

const app = express();
app.use(express.json());
app.use(cors());

// set up the configuration
const config = new Configuration({ apiKey: process.env.TILLED_SECRET_KEY, basePath, baseOptions: { timeout: 2000 } })

// Set up apis
const paymentIntentsApi = new PaymentIntentsApi(config);
const subscriptionsApi = new SubscriptionsApi(config);
const paymentMethodsApi = new PaymentMethodsApi(config);
const checkoutSessionsApi = new CheckoutSessionsApi(config);


// Using state variable here for simplicity. Would likely store this in db in production
let orders: { [orderNumber: string]: { payment_intent: any, line_items: { name: string, price: string } } } = {};

app.post('/payment-intents', (req: Request, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const orderNumber = Math.floor(Math.random() * 1000000).toString();
    const tilled_account = req.headers.tilled_account as string;
    const line_items = req.body.line_items;
    delete req.body.line_items;
    const body: PaymentIntentCreateParams = req.body;
    body.metadata = { ...body.metadata, order_number: orderNumber };

    paymentIntentsApi
        .createPaymentIntent(
            { tilled_account, PaymentIntentCreateParams: body }
        )
        .then(response => {
            return response.data;
        })
        .then(data => {
            res.json(data);
            console.log(data);
            orders[orderNumber] = { payment_intent: data, line_items };
            console.log(orders)
        })
        .catch(error => {
            console.error(error);
            res.status(404).json(error)
        });
})

app.patch('/payment-intents/:id', (req: Request, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const tilled_account = req.headers.tilled_account as string;
    const { id } = req.params;

    paymentIntentsApi
        .updatePaymentIntent(
            { tilled_account, id, PaymentIntentUpdateParams: req.body }
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


app.get('/payment-methods', (req: Request & {
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

app.get("/.well-known/apple-app-site-association", (req: Request, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    res.json({
        "applinks": {
            "details": [
                {
                    "appID": "W6QDB45QP6.dpatton.ios-checkout",
                }
            ]
        }
    })
})

app.get("/orders/:orderNumber", (req: Request & {
    params: {
        orderNumber: string
    }
}, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const { orderNumber } = req.params;
    const order = orders[orderNumber];
    res.json(order)
})


app.get("/tilled-form/:secret", (req: Request & {
    params: {
        secret: string // client secret of the payment intent to be confirmed
    }
}, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    res.sendFile(__dirname + "/tilled-form/index.html")
})

app.get("/tilled-form-script.js", (req: Request, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    fs.readFile(__dirname + "/tilled-form/script.js", 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        const script = data
            .replace(/pk_XXXX/g, process.env.TILLED_PUBLIC_KEY)
            .replace(/acct_XXXX/g, process.env.TILLED_MERCHANT_ACCOUNT_ID);

        res.type('.js')
        res.send(script)
    });
})

app.post("/tilled-form/submit", (req: Request & {
    // headers: {
    //     tilled_account: string
    // },
    body: { payment_method: any },
}, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const { payment_method } = req.body;
    console.log(payment_method)
    // paymentIntentsApi.confirmPaymentIntent({

    // })
    res.json(payment_method)
});


app.post('/checkout-sessions', (req: Request, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const tilled_account = req.headers.tilled_account as string;
    const products = req.body
    const total = products.reduce((acc: number, curr: { price: number; }) => acc + curr.price, 0)
    const line_items = products.map((product: { name: string; price: number; image: string }) => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.name,
                    // images: [product.image],
                },
                unit_amount: Math.round(product.price * 100),
            },
            quantity: 1,
        }
    })

    const CheckoutSessionCreateParams: CheckoutSessionCreateParams = { line_items, payment_intent_data: { payment_method_types: ['card'] } };
    console.log(req.headers)
    checkoutSessionsApi
        .createCheckoutSession(
            { tilled_account, CheckoutSessionCreateParams }
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