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
    const expirationInputRef = useRef(null);
    const cvvInputRef = useRef(null);

    // This feature is still in beta.
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

            // Notice that the _cardScanElement is a private field
            formInstance.createField('_cardScanElement').inject(el);
            formInstance.fields._cardScanElement.on('cardscanloaded', () => {
                el.removeAttribute('hidden');
            });

            el.addEventListener('click', () => {
                handleOpen();
            });

            formInstance.fields._cardScanElement.on(
                'cardscanerror',
                (error: { message: string }) => {
                    //  Silent  fail  for  now  is  fine.  This  should  not  impede  entering  info.
                    console.log('Card  Scan  error:  ' + error?.message);

                    // You could hide the card scan icon here if you wanted
                    // el.setAttribute('hidden', 'true');

                    //  Close  the  card  scan  icon  if  it  is  open
                    handleClose();
                }
            );

            // Reposition the card scan icon when any field is changed
            // Used in place of a success handler
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
