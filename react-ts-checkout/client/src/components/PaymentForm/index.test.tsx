import '../../utils/patch-fetch';
import { render, screen } from '../../utils/test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { queryClient } from '../../utils/query-client';
import { QueryClientProvider } from 'react-query';
import PaymentForm from './index';

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

const subscriptions = [
    {
        billing_cycle_anchor: new Date(),
        currency: 'usd',
        interval_unit: 'month',
        price: 3999,
    },
    {
        billing_cycle_anchor: new Date(),
        currency: 'usd',
        interval_unit: 'month',
        price: 1999,
    },
];

const paymentIntent = {
    id: 'pi_J84lM2dMsi9LfvJqkkBSX',
    amount: 15117,
    level3: null,
    status: 'requires_payment_method',
    charges: [],
    currency: 'usd',
    customer: null,
    metadata: null,
    account_id: 'acct_iITmFPIzjDBqiXOFwNv6V',
    created_at: '2023-06-22T19:39:13.206Z',
    updated_at: '2023-06-22T19:39:13.206Z',
    canceled_at: null,
    client_secret: 'pi_J84lM2dMsi9LfvJqkkBSX_secret_wMBMD4yTiTrYFCHH9wzhACPmu',
    capture_method: 'automatic',
    payment_method: null,
    amount_received: 0,
    occurrence_type: null,
    subscription_id: null,
    amount_capturable: 15117,
    last_payment_error: null,
    cancellation_reason: null,
    platform_fee_amount: null,
    payment_method_types: ['card', 'ach_debit'],
    statement_descriptor_suffix: null,
};

describe('PaymentForm renders', () => {
    it('should render the PaymentForm component', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <PaymentForm
                        paymentIntent={paymentIntent}
                        subscriptions={subscriptions}
                    />
                </ThemeProvider>
            </QueryClientProvider>
        );
        expect(
            screen.getByTestId('payment-form-container')
        ).toBeInTheDocument();
    });
});
