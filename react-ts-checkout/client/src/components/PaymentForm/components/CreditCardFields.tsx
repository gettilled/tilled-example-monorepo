import { useRef } from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import useTilled from '../hooks/useTilled';
import { Box, TextField, FormControl } from '@mui/material';
import TilledMuiField from './TilledjsMuiField';
import { ITilledFieldOptions } from '../utils/TilledFieldOptions';

export default function CreditCardFields(props: {
    account_id: string;
    public_key: string;
    tilled: any;
    options: ITilledFieldOptions;
}) {
    const { account_id, public_key, tilled, options } = props;

    const numberInputRef = useRef(null);
    const cardCaptureRef = useRef(null);
    const expirationInputRef = useRef(null);
    const cvvInputRef = useRef(null);

    const cardCapture = {
        ref: useRef(null),
        handler: (el: HTMLElement, formInstance: any) => {
            const cancelBtn = el.querySelector('#cancelScanButton');
            const closedPositioning: Array<string> = [
                'absolute',
                '-translate-y-1/2',
            ];
            const openPositioning: Array<string> = ['fixed', 'z-50'];
            const handleOpen = () => {
                openPositioning.forEach(className => {
                    el.classList.add(className);
                });
                closedPositioning.forEach(className => {
                    el.classList.remove(className);
                });
            };

            const handleClose = () => {
                openPositioning.forEach(className => {
                    el.classList.remove(className);
                });
                closedPositioning.forEach(className => {
                    el.classList.add(className);
                });
            };

            formInstance.createField('_cardScanElement').inject(el);
            formInstance.fields._cardScanElement.on('cardscanloaded', () => {
                el.removeAttribute('hidden');

                if (cancelBtn)
                    cancelBtn.addEventListener('click', () => {
                        console.log('cancel button clicked');
                        handleClose();
                    });
            });

            el.addEventListener('click', () => {
                handleOpen();
            });

            // Forced to use dom manipulation to get the cancel button inside an iFrame
            formInstance.fields._cardScanElement.on(
                'cardscanerror',
                (error: { message: string }) => {
                    //  Silent  fail  for  now  is  fine.  This  should  not  impede  entering  info.
                    console.log('Card  Scan  error:  ' + error?.message);
                    console.log(error);
                    handleClose();
                }
            );

            Object.values(formInstance.fields).forEach((field: any) => {
                field.on('change', () => {
                    console.log('field changed');
                    handleClose(); // repositions the card scan icon
                });
            });
        },
    };

    const cardObject = {
        type: 'card',
        fields: {
            cardNumber: numberInputRef,
            cardExpiry: expirationInputRef,
            cardCvv: cvvInputRef,
        },
        cardCaptureRef: cardCaptureRef,
        cardCapture,
    };

    const status = useTilled(
        account_id,
        public_key,
        cardObject,
        tilled,
        options
    );
    console.log(status);

    return (
        <Box className='mt-3'>
            <TilledMuiField
                id='card-number-element'
                label='Card Number'
                inputRef={numberInputRef}
                cardCapture={cardCapture}
            />
            <Box className='grid grid-cols-2 gap-3 mt-3'>
                <TilledMuiField
                    id='card-expiration-element'
                    label='Expiration'
                    inputRef={expirationInputRef}
                />
                <TilledMuiField
                    id='card-cvv-element'
                    label='CVV'
                    inputRef={cvvInputRef}
                />
            </Box>
        </Box>
    );
}
