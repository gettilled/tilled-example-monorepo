import React from 'react';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './utils/query-client';
import Checkout from './components/Checkout';
import Shoes from './assets/shoes.jpg';
import Socks from './assets/socks.jpg';
import Gym from './assets/gym.jpg';
import Lafleur from './assets/lafleur.webp';

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

function App() {
    return (
        <div className='bg-slate-100 m-auto'>
            <QueryClientProvider client={queryClient}>
                <Checkout cart={cart} />
            </QueryClientProvider>
        </div>
    );
}

export default App;
