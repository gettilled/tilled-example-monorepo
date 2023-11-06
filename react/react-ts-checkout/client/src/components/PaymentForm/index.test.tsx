// import '../../utils/patch-fetch';
import { render, screen, act } from '../../utils/test-utils';
import { vi } from 'vitest';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { queryClient } from '../../utils/query-client';
import { QueryClientProvider } from 'react-query';
import PaymentForm from './index';
import { wrap } from 'module';

let windowSpy: any;

beforeEach(() => {
	windowSpy = vi.spyOn(window, 'location', 'get');
});

afterEach(() => {
	windowSpy.mockRestore();
});

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
	status: 'requires_payment_method',
	charges: [],
	currency: 'usd',
	account_id: 'acct_iITmFPIzjDBqiXOFwNv6V',
	created_at: '2023-06-22T19:39:13.206Z',
	updated_at: '2023-06-22T19:39:13.206Z',
	client_secret: 'pi_J84lM2dMsi9LfvJqkkBSX_secret_wMBMD4yTiTrYFCHH9wzhACPmu',
	capture_method: 'automatic',
	amount_received: 0,
	amount_receivable: 15117,
	amount_capturable: 15117,
	payment_method_types: ['card', 'ach_debit'],
};

const form = (
	<QueryClientProvider client={queryClient}>
		<ThemeProvider theme={theme}>
			<PaymentForm
				paymentIntent={paymentIntent}
				subscriptions={subscriptions}
			/>
		</ThemeProvider>
	</QueryClientProvider>
);

describe('PaymentForm renders', () => {
	it('should render the PaymentForm component', () => {
		act(() => {
			render(form);
		});
		windowSpy.mockImplementation(() => ({
			Tilled: {
				origin: 'https://example.com',
			},
		}));
		// console.log(window.location.Tilled);
		expect(screen.getByTestId('payment-form-container')).toBeInTheDocument();
		expect(screen.getByText('Save this payment method?')).toBeInTheDocument();
	});
});
// describe('Tilled.js fields are injected', () => {
//     it('should inject the tilled.js fields', async () => {
//         let result: any;
//         act(() => {
//             result = render(form);
//         });

//         const cardNumberIFrame = result.container.querySelector(
//             '#tilled_iframe_cardNumber'
//         ) as HTMLElement;
//         console.log(result.container);
//         const cardExpirationIFrame = result.container.querySelector(
//             '#tilled_iframe_cardExpiry'
//         );
//         const cardCvvIFrame = result.container.querySelector(
//             '#tilled_iframe_cardCvv'
//         );
//         const cardNumPromise = await screen.findByTestId('card-number-element');
//         // console.log(cardNumPromise);
//         expect(screen.getByTestId('card-number-element')).toBeInTheDocument();
//         // expect(
//         //     screen.getByTestId('card-expiration-element')
//         // ).toBeInTheDocument();
//         // expect(screen.getByTestId('card-cvv-element')).toBeInTheDocument();
//         // expect(result.container.querySelectorAll('iframe')).toHaveLength(3);
//         // expect(cardNumberIFrame).toBeInTheDocument();
//     });
// });
