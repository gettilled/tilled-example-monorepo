import { useRef } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import useTilled from '../hooks/useTilled';
import { Box, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import TilledMuiField from './TilledjsMuiField';
import { ITilledFieldOptions } from '../utils/TilledFieldOptions';

export default function AchDebitFields(props: {
    account_id: string;
    public_key: string;
    tilled: any;
    options: ITilledFieldOptions;
    control: Control<FieldValues, any>;
}) {
    const { account_id, public_key, tilled, options, control } = props;

    const accountInputRef = useRef(null);
    const routingInputRef = useRef(null);

    // const { accountType, setAccountType } = state;

    const achDebitObject = {
        type: 'ach_debit',
        fields: {
            bankRoutingNumber: routingInputRef,
            bankAccountNumber: accountInputRef,
        },
    };

    // const handleChange = e => setAccountType(e.target.value);

    const status = useTilled(
        account_id,
        public_key,
        achDebitObject,
        tilled,
        options
    );
    console.log(status);

    return (
        <Box className='flex flex-col gap-3'>
            <TilledMuiField
                id='bank-account-number-element'
                label='Account Number'
                inputRef={accountInputRef}
            />
            <Box className='grid grid-cols-2 gap-3'>
                <TilledMuiField
                    id='bank-routing-number-element'
                    label='Routing Number'
                    inputRef={routingInputRef}
                />
                <Controller
                    defaultValue={''}
                    control={control}
                    name='account_type'
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel>Account Type</InputLabel>
                            <Select
                                label='Account Type'
                                id='bank-account-type-element'
                                {...field}
                            >
                                <MenuItem value='checking'>Checking</MenuItem>
                                <MenuItem value='savings'>Saving</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
            </Box>
        </Box>
    );
}
