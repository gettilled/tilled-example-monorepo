import { Button, ButtonTypeMap, ExtendButtonBase } from '@mui/material';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import { RefObject } from 'react';

export default function SubmitButton(props: { handler: () => void; disabled: boolean}) {
    const { handler, disabled = false } = props;

    return (
        <Button
            className='w-full border rounded-md mt-6 p-3 h-auto bg-slate-700 text-xl text-white font-bold'
            variant='contained'
            data-testid='submit-button'
            size='large'
            onClick={handler}
            sx={{
                fontSize: '1.4em',
                fontWeight: '700',
                textTransform: 'none',
                marginTop: '1.5em',
                padding: '0.5em',
            }}
            disabled={disabled}
        >
            Pay
        </Button>
    );
}
