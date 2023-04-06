import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import currencyFormatter from '../../services/currency-formatter';

export default function CartSummary(props: {
    cart: Array<{
        imagePath: string;
        name: string;
        price: number;
        quantity: number;
    }>;
}) {
    const cart = props.cart;
    const merchantName = process.env.REACT_APP_TILLED_MERCHANT_NAME || '';
    const salesTax = Number(process.env.REACT_APP_TILLED_MERCHANT_TAX) || 1;
    let total = 0;

    cart.forEach(item => (total = total + item.price * item.quantity));

    total *= salesTax;

    return (
        <div className='p-12'>
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
                    const { imagePath, name, price, quantity } = item;
                    return (
                        <li
                            key={'list-item_' + name.replace(' ', '-')}
                            className='flex justify-between mb-4'
                        >
                            <div className='flex gap-2'>
                                <img
                                    src={imagePath}
                                    alt={name + ' image'}
                                    className='w-12 rounded'
                                />
                                <div>
                                    <div>{name}</div>
                                    <div>
                                        <span>x </span>
                                        {quantity}
                                    </div>
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
