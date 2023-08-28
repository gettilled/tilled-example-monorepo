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

    const cardObject = {
        type: 'card',
        fields: {
            cardNumber: numberInputRef,
            cardExpiry: expirationInputRef,
            cardCvv: cvvInputRef,
        },
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
