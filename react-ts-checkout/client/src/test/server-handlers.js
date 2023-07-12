import { rest } from 'msw'; // msw supports graphql too!
import { setupServer } from 'msw/node';
import {
    listPaymentMethodsResponse,
    paymentMethodResponse,
    paymentIntentResponse,
    subscriptionsResponse,
} from './responses';

const handlers = [
    rest.post('/api/payment-intents', async (req, res, ctx) => {
        const body = await req.json();

        return res(ctx.json(paymentIntentResponse));
    }),
    rest.post('/api/payment-intents/:id/confirm', async (req, res, ctx) => {
        const body = await req.json();
        return res(ctx.json(paymentIntentResponse));
    }),
    rest.post('/api/payment-methods', async (req, res, ctx) => {
        const body = await req.json();

        const data = await paymentMethodsApi.createPaymentMethod({
            tilled_account: req.headers?.tilled_account,
            PaymentMethodCreateParams: body,
        });
        return res(ctx.json(paymentMethodResponse));
    }),
    rest.get('/api/payment-methods', async (req, res, ctx) => {
        return res(ctx.json(listPaymentMethodsResponse));
    }),
    rest.post('/api/payment-methods/:id/attach', async (req, res, ctx) => {
        const body = await req.json();

        return res(ctx.json(paymentMethodResponse));
    }),
    rest.post('/api/subscriptions', async (req, res, ctx) => {
        const body = await req.json();
        return res(ctx.json(subscriptionsResponse));
    }),
];

export { handlers };
