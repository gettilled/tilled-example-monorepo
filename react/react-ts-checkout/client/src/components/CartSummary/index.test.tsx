import { render, screen } from '../../utils/test-utils';
import currencyFormatter from '../../utils/currency-formatter';
import CartSummary from './index';

import Shoes from '../../assets/shoes.jpg';
import Socks from '../../assets/socks.jpg';
import Gym from '../../assets/gym.jpg';
import Lafleur from '../../assets/lafleur.webp';

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
	{
		name: 'Gym Membership',
		price: 3999,
		imagePath: Gym,
		quantity: 1,
		subscription: {
			billing_cycle_anchor: new Date(),
			currency: 'usd',
			interval_unit: 'month',
			price: 3999,
		},
	},
	{
		name: 'Lafleur Package',
		price: 1999,
		imagePath: Lafleur,
		quantity: 1,
		subscription: {
			billing_cycle_anchor: new Date(),
			currency: 'usd',
			interval_unit: 'month',
			price: 1999,
		},
	},
];

describe('CartSummary renders', () => {
	it('should render the CartSummary component', () => {
		render(<CartSummary cart={cart} />);
		expect(screen.getByTestId('cart-summary-container')).toBeInTheDocument();
	});
});

describe('displays correct number of items', () => {
	it('should display the correct number of items', () => {
		render(<CartSummary cart={cart} />);
		expect(screen.getByTestId('cart-items-list').children).toHaveLength(4);
	});
});

describe('displays correct total', () => {
	it('should display the correct total', () => {
		render(<CartSummary cart={cart} />);
		const salesTax = Number(import.meta.env.VITE_TILLED_MERCHANT_TAX) || 1;
		const total = currencyFormatter(13997 * salesTax + 5998); // Tax not applied to subscriptions

		expect(screen.getByText(total)).toBeInTheDocument();
	});
});
