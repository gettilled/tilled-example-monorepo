import { useRef } from 'react';
import { useQuery } from 'react-query';
import currencyFormatter from '../../services/currency-formatter';
import dateFormatter from '../../services/date-formatter';
import convertStatus from '../../services/convertStatus';
import LoadingWheel from '../LoadingWheel';
import Error from '../Error/Error';
import PaymentForm from '../PaymentForm';
import CartSummary from '../CartSummary';
import Shoes from './assets/shoes.jpg';
import Socks from './assets/socks.jpg';
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

export default function Checkout() {
    const tilledAccount = process.env.REACT_APP_TILLED_MERCHANT_ACCOUNT_ID;
    const salesTax = Number(process.env.REACT_APP_TILLED_MERCHANT_TAX) || 1;

    const cart = [
        {
            name: 'Running Shoes',
            price: 9999,
            imagePath: Shoes,
            quantity: 1,
        },
        {
            name: 'Socks',
            price: 1999,
            imagePath: Socks,
            quantity: 2,
        },
    ];

    const total = cart
        .map(item => item.price * item.quantity) // Convert the amounts to an array
        .reduce((acc, num) => acc + num, 0); // Sum the array

    const fetchPaymentIntent = async () => {
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Content-Type', 'application/json');
        if (tilledAccount) requestHeaders.set('tilled_account', tilledAccount);

        const response = await fetch('/payment-intents', {
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

    const { isLoading, isError, error, data, isFetching, isPreviousData } =
        useQuery(['paymentIntent'], () => fetchPaymentIntent(), {
            keepPreviousData: true,
        });

    return isLoading ? (
        <LoadingWheel />
    ) : (
        <div className='container bg-white rounded-xl w-max shadow-md p-4 m-auto'>
            {isError ? (
                <Error message={(error as any).message} />
            ) : (
                <div className='grid grid-cols-2 divide-x divide-slate-400/25'>
                    <CartSummary cart={cart} />
                    <ThemeProvider theme={theme}>
                        <PaymentForm
                            paymentIntent={{
                                secret: data.client_secret,
                                id: data.id,
                            }}
                        />
                        {/* <PaymentForm
                        payment={{
                            secret: 'pi_Xt0sv3RAsYyjblJjdSg31_secret_rwd1Be2az3gNj5uu9EPBWMZa6',
                            id: 'pi_Xt0sv3RAsYyjblJjdSg31',
                        }}
                        tilled={tilled}
                        tilledForm={tilledForm}
                    /> */}
                    </ThemeProvider>
                </div>
            )}
        </div>
    );
}
