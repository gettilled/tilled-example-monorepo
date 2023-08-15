import express, { Request, Response } from "express";
import cors from "cors";
import {
    Configuration,
    PaymentIntentsApi,
    SubscriptionsApi,
    PaymentMethodsApi,
    CheckoutSessionsApi,
    CheckoutSessionCreateParams,
    PaymentIntentCreateParams,
    PaymentIntentConfirmParams,
    PaymentMethodAttachParams,
    SubscriptionCreateParams,
    PaymentMethod,
    CardDetails,
    ListPaymentMethods200Response,
    PaymentIntentUpdateParams,
} from "tilled-node";
import { tilledFormScript } from "./tilled-form/tilled-form";
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


app.post('/payment-intents/:id/confirm', (req: Request, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const tilled_account = req.headers.tilled_account as string;
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

app.post('/payment-methods/:id/attach', async (req: Request, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const tilled_account = req.headers.tilled_account as string;
    const { id } = req.params;
    const body: PaymentMethodAttachParams = req.body;
    const duplicateCardMsg = 'The card associated with this PaymentMethod is already associated with this customer on another PaymentMethod.';

    try {
        const response = await paymentMethodsApi.attachPaymentMethodToCustomer({ tilled_account, id, PaymentMethodAttachParams: body });
        res.status(200).json(response.data);
        console.log(response.data);
    } catch (error) {
        console.error(error);

        if (error.response.data.message === duplicateCardMsg) {
            const { customer_id } = body;

            try {
                const pm = await paymentMethodsApi.getPaymentMethod({ tilled_account, id });
                const { type, card } = pm.data;

                const pmListResponse = await paymentMethodsApi.listPaymentMethods({ tilled_account, customer_id, type });
                const pmList = pmListResponse.data.items;

                let returnedPM: PaymentMethod | undefined;

                for (const pm of pmList) {
                    if ((card && card.last4 === card.last4) || (card && card.brand === card.brand) || (card && card.exp_year === card.exp_year) || (card && card.exp_month === card.exp_month) || (card && card.funding === card.funding)) {
                        returnedPM = pm;
                        break;
                    }
                }

                if (returnedPM) {
                    res.status(201).json(returnedPM);
                } else {
                    res.status(404).json(error);
                }
            } catch (error) {
                console.error(error);
                res.status(500).send(error.message);
            }
        } else {
            res.status(500).send(error.message);
        }
    }
});


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

app.post('/subscriptions', (req: Request, res: Response & {
    json: any;
    send: any;
    status: any
}) => {
    const tilled_account = req.headers.tilled_account as string;

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
    res.type('.js')
    res.send(tilledFormScript(process.env.TILLED_PUBLIC_KEY, process.env.TILLED_MERCHANT_ACCOUNT_ID))
    // res.send(`
    //     const tilledForm = document.getElementById("tilled-js-form");
    //     const client_secret = window.location.href.slice(-57);
    //     const public_key = '${process.env.TILLED_PUBLIC_KEY}';
    //     let account_id = '${process.env.TILLED_MERCHANT_ACCOUNT_ID}';

    //     const fields = {
    //         cardNumber: 'tilled-js-card-number-container',
    //         cardExpiry: 'tilled-js-expiry-date-container',
    //         cardCvv: 'tilled-js-cvv-container',
    //     };
    //     const fieldOptions = {
    //         styles: {
    //             base: {
    //                 fontFamily:
    //                     '-apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    //                 color: '#304166',
    //                 fontWeight: '400',
    //                 fontSize: '16px',
    //             },
    //             invalid: {
    //                 ':hover': {
    //                     textDecoration: 'underline dotted red',
    //                 },
    //                 color: '#777777',
    //             },
    //             valid: {
    //                 color: '#32CD32',
    //             },
    //         },
    //     };
    //     (async function () {
    //         let tilled;
    //         try {
    //             tilled = new window.Tilled(public_key, account_id, {
    //                 sandbox: true,
    //             });
    //         } catch (error) {
    //             // tilledForm.innerHTML = error.message;
    //             console.error(error)
    //             return;
    //         }
    //         const form = await tilled.form({
    //             payment_method_type: 'card',
    //         });
    //         Object.entries(fields).forEach((entry) => {
    //             const [field, fieldId] = entry;
    //             const fieldElement = document.getElementById(fieldId);

    //             if (fieldElement.childElementCount === 0)
    //                 form
    //                     .createField(field, fieldOptions ? fieldOptions : {})
    //                     .inject(fieldElement);
    //         });
    //         form.build();
    //         tilledForm.addEventListener("submit", async function(event) {
    //             event.preventDefault();
    //             const formData = new FormData(event.target);
    //             const plainFormData = Object.fromEntries(formData.entries());
    //             const billing_details = {
    //                 name: plainFormData.name,
    //                 address: {
    //                     country: plainFormData.country,
    //                     zip: plainFormData.zip,
    //                 }
    //             };
    //             const payment_intent = await tilled.confirmPayment(client_secret, {
    //                 payment_method: {
    //                     type: 'card',
    //                     billing_details,
    //                 }
    //             });
    //             console.log(payment_intent)
    //             tilledForm.innerHTML = 
    //                 payment_intent.status === 'succeeded' 
    //                     ? 'Payment succeeded' 
    //                     : 'Payment failed';
    //         });
    //     })();
    // `)
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

    console.log(products)
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