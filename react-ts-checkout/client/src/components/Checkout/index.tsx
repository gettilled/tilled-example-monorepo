import { useRef } from 'react';
import { useQuery } from 'react-query';
import LoadingWheel from '../LoadingWheel';
import Error from '../Error/Error';
import PaymentForm from '../PaymentForm';
import CartSummary from '../CartSummary';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { fontStyle } from '@mui/system';
import { request } from 'http';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#334155',
        },
        secondary: {
            main: '#01a2e9',
        },
    },
});

type Subscription = {
    billing_cycle_anchor: Date | string;
    currency: string;
    interval_unit: string;
    price: number;
};

export default function Checkout(props: {
    cart: Array<{
        name: string;
        price: number;
        imagePath: string;
        quantity: number;
        subscription?: Subscription;
    }>;
}) {
    const tilledAccount = import.meta.env.VITE_TILLED_MERCHANT_ACCOUNT_ID;
    const salesTax = Number(import.meta.env.VITE_TILLED_MERCHANT_TAX) || 1;
    const cart = props.cart;
    let loading = false;
    let errored = false;
    let errorObj = null;
    let paymentIntent = null;
    let subscriptions: Array<Subscription> = [];

    cart.forEach(item => {
        if (item?.subscription) subscriptions.push(item.subscription);
    });

    const total = cart
        .map(item => (!item?.subscription ? item.price * item.quantity : 0)) // Convert the amounts to an array
        .reduce((acc, num) => acc + num, 0); // Sum the array

    const fetchPaymentIntent = async () => {
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Content-Type', 'application/json');
        if (tilledAccount) requestHeaders.set('tilled_account', tilledAccount);

        const response = await fetch('/api/payment-intents', {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({
                amount: Math.round(total * salesTax),
                currency: 'usd',
                payment_method_types: ['card', 'ach_debit'],
            }),
        });

        if (!response.ok)
            throw new (Error as any)(
                `Unable to fetch payments from backend. Status: ${response.statusText}`
            );

        return response.json();
    };

    // Fetch payment intent from backend
    if (total > 0) {
        const { isLoading, isError, error, data, isFetching, isPreviousData } =
            useQuery(['paymentIntent'], () => fetchPaymentIntent(), {
                keepPreviousData: true,
            });
        loading = isLoading;
        errored = isError;
        errorObj = error;
        paymentIntent = data;
    }

    // Uncomment for subscriptions:
    // const isLoading = false;
    // const isError = false;
    // const error = null;

    return loading ? (
        <LoadingWheel />
    ) : (
        <div className='container bg-white rounded-xl w-max shadow-md p-4 m-auto'>
            {errored ? (
                <Error message={(errorObj as any).message} />
            ) : (
                <div className='md:grid md:grid-cols-2 md:divide-x divide-slate-400/25'>
                    <CartSummary cart={cart} />
                    <ThemeProvider theme={theme}>
                        <PaymentForm
                            paymentIntent={paymentIntent}
                            subscriptions={subscriptions}
                        />
                        {/* Uncomment to test subscriptions */}
                        {/* <PaymentForm recurring={true} /> */}
                    </ThemeProvider>
                </div>
            )}
        </div>
    );
}
