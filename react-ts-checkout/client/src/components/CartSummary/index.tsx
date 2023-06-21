import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import currencyFormatter from '../../../services/currency-formatter';
import { Subscription } from '../../models/Subscriptions';
// import React from 'react';

export default function CartSummary(props: {
    cart: Array<{
        imagePath: string;
        name: string;
        price: number;
        quantity: number;
        subscription?: Subscription;
    }>;
}) {
    const cart = props.cart;
    const merchantName = import.meta.env.VITE_TILLED_MERCHANT_NAME || '';
    const salesTax = Number(import.meta.env.VITE_TILLED_MERCHANT_TAX) || 1;
    let total = 0;

    cart.forEach(item => {
        if (item.subscription) {
            total += item.subscription.price;
        } else {
            total += item.price * item.quantity * salesTax;
        }
    });

    return (
        <div className='p-12' data-testid='cart-summary-container'>
            <div className='mb-8'>
                <a href='#'>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    {' ' + merchantName}
                </a>
            </div>
            <div className='mb-8'>
                <div className='text-slate-600 mb-2'>Pay {merchantName}</div>
                <div className='text-3xl font-bold'>
                    {currencyFormatter(total)}
                </div>
            </div>
            <ul>
                {cart.map(item => {
                    const { imagePath, name, price, quantity, subscription } =
                        item;
                    return (
                        <li
                            key={'list-item_' + name.replace(' ', '-')}
                            className='flex justify-between mb-4'
                        >
                            <div className='flex gap-2'>
                                <img
                                    src={imagePath}
                                    alt={name + ' image'}
                                    className='w-12 h-12 rounded'
                                />
                                <div>
                                    <div>{name}</div>
                                    {subscription ? (
                                        <span className='text-xs bg-slate-200 p-0.5 rounded-xl'>
                                            {subscription.interval_unit}ly
                                        </span>
                                    ) : (
                                        <div className='text-sm'>
                                            <span>x </span>
                                            {quantity}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='text-right'>
                                <div>{currencyFormatter(price * quantity)}</div>
                                {quantity > 1 ? (
                                    <div className='text-sm text-slate-600'>
                                        {currencyFormatter(price)} each
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
