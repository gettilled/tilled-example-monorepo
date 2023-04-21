import { useState, useRef, SetStateAction } from 'react';
import { useQuery } from 'react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import CreditCardFields from './components/CreditCardFields';
import AchDebitFields from './components/AchDebitFields';
import BillingDetailsFields from './components/BillingDetailsFields';
import PaymentMethodsSelect from './components/PaymentMethodsSelect';
import { TilledFieldOptions } from './utils/TilledFieldOptions';
import './index.css';

import {
    Box,
    FormGroup,
    FormControlLabel,
    Tabs,
    Tab,
    Switch,
    Button,
} from '@mui/material';

import {
    IPaymentMethodResponse,
    IPaymentMethodParams,
} from '../../models/PaymentMethods';
import { IPaymentIntent } from '../../models/PaymentIntents';
import SubmitButton from './components/SubmitButton';

const pk_PUBLISHABLE_KEY = import.meta.env.VITE_TILLED_PUBLIC_KEY as string;
const account_id = import.meta.env.VITE_TILLED_MERCHANT_ACCOUNT_ID as string;
const customer_id = import.meta.env.VITE_TILLED_CUSTOMER_ID;

function PaymentForm(props: {
    paymentIntent?: { secret: string; id: string };
    recurring?: boolean;
}) {
    const { paymentIntent, recurring } = props;
    const [type, setType] = useState('card');

    type FormValues = {
        name: string;
        street: string;
        country: string;
        state: string;
        city: string;
        zip: string;
        account_type?: string;
        savePaymentMethod: boolean;
    };

    const {
        handleSubmit,
        control,
        // formState: { errors }, // Can't use this because form validation triggers a re-render
        setError,
    } = useForm<FormValues | any>();

    const paymentMethodId = useRef('');
    const tilled = useRef({ card: null, ach_debit: null });

    const onSubmit = async (data: FormValues) => {
        if (tilled.current === null) throw new Error('Tilled not loaded');

        const tilledInstance: any =
            tilled.current[type as keyof typeof tilled.current]; // cast tilled.current to any to avoid TS errors
        let newPM: IPaymentMethodResponse | null = null;
        let tilledParams: {
            payment_method?: string;
        };
        const {
            name,
            street,
            country,
            state,
            city,
            zip,
            account_type,
            savePaymentMethod,
        } = data;
        const billing_details = {
            name,
            address: {
                street,
                country,
                state,
                city,
                zip,
            },
        };

        if (paymentMethodId.current) {
            console.log(
                'Processing payment with selected pm:',
                paymentMethodId.current
            );

            tilledParams = {
                payment_method: paymentMethodId.current,
            };
        } else {
            console.log('creating new pm', type, billing_details);
            let paymentMethodParams: IPaymentMethodParams = {
                type,
                billing_details,
            };
            if (type === 'ach_debit' && account_type)
                paymentMethodParams.ach_debit = {
                    account_type,
                    account_holder_name: name.slice(0, 22),
                };
            console.log(paymentMethodParams);
            console.log(tilledInstance);

            paymentMethodParams.ach_debit = newPM =
                await tilledInstance.createPaymentMethod(paymentMethodParams);

            if (newPM) {
                tilledParams = { payment_method: newPM.id };
                console.log('new pm', newPM);
            } else return console.error('no new pm');
        }

        if (savePaymentMethod && newPM) {
            console.log('attaching pm to customer', newPM);
            const response = await fetch(
                `/api/payment-methods/${newPM.id}/attach`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        tilled_account: account_id,
                    },
                    body: JSON.stringify({
                        customer_id,
                    }),
                }
            );
            console.log(response);
        }

        if (!recurring && paymentIntent) {
            try {
                const response: Promise<IPaymentIntent> =
                    await tilledInstance.confirmPayment(
                        paymentIntent.secret,
                        tilledParams
                    );

                console.log(response);
            } catch (error) {
                setError('noResponse', {
                    type: 'tilledjsError',
                    message: 'no response',
                });
                console.error(error);
            }
            console.log('confirmed payment');
        } else if (recurring) {
            console.log('creating subscription');

            const requestHeaders: HeadersInit = new Headers();
            requestHeaders.set('Content-Type', 'application/json');
            requestHeaders.set('tilled_account', account_id);

            const body = JSON.stringify({
                billing_cycle_anchor: new Date(),
                currency: 'usd',
                interval_unit: 'month',
                price: 139999,
                customer_id,
                payment_method_id: tilledParams.payment_method,
            });

            const response = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: requestHeaders,
                body,
            });

            if (!response.ok)
                throw new (Error as any)(
                    `Unable to create subscription. 
                ${response.status}: ${response.statusText}`
                );
            console.log(response);
        }

        // TODO: Handle response => display receipt
    };

    const handleChange = (
        _: React.SyntheticEvent,
        newValue: SetStateAction<string>
    ) => {
        setType(newValue);
    };

    return (
        <Box className='App checkout-app max-w-md p-5 items-center justify-center mx-auto'>
            {customer_id ? (
                <PaymentMethodsSelect
                    paymentMethodId={paymentMethodId}
                    account_id={account_id}
                    type={type}
                    customer_id={customer_id}
                />
            ) : (
                ''
            )}
            <Box component='form' autoComplete='off'>
                <BillingDetailsFields form={{ control }} />
                <Tabs
                    className='mt-2'
                    value={type}
                    onChange={handleChange}
                    centered
                >
                    <Tab key='tab-card' label='Card' value='card' />
                    <Tab
                        key='tab-ach_debit'
                        label='Bank Transfer'
                        value='ach_debit'
                    />
                </Tabs>
                <Box className='mt-2'>
                    {type === 'card' ? (
                        <CreditCardFields
                            account_id={account_id}
                            public_key={pk_PUBLISHABLE_KEY}
                            options={TilledFieldOptions}
                            tilled={tilled}
                        />
                    ) : (
                        <AchDebitFields
                            account_id={account_id}
                            public_key={pk_PUBLISHABLE_KEY}
                            options={TilledFieldOptions}
                            tilled={tilled}
                            control={control}
                        />
                    )}
                </Box>
                {customer_id ? (
                    <Box className='mt-6 text-slate-600'>
                        <Controller
                            defaultValue={false}
                            control={control}
                            name='savePaymentMethod'
                            render={({ field }) => (
                                <FormGroup>
                                    <FormControlLabel
                                        className='flex justify-center'
                                        control={
                                            <Switch
                                                color='primary'
                                                {...field}
                                            />
                                        }
                                        label='Save this payment method?'
                                        labelPlacement='start'
                                    />
                                </FormGroup>
                            )}
                        />
                    </Box>
                ) : (
                    ''
                )}
                <SubmitButton
                    handler={handleSubmit(
                        onSubmit as SubmitHandler<FormValues>
                    )}
                />
            </Box>
        </Box>
    );
}

export default PaymentForm;
