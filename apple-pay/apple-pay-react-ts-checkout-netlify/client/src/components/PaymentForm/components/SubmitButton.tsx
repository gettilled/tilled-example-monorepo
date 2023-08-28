import { Button } from '@mui/material';

export default function SubmitButton(props: { handler: () => void }) {
    const { handler } = props;

    return (
        <Button
            className='w-full border rounded-md mt-6 p-3 h-auto bg-slate-700 text-xl text-white font-bold'
            variant='contained'
            // type='submit'
            size='large'
            onClick={handler}
            sx={{
                fontSize: '1.4em',
                fontWeight: '700',
                textTransform: 'none',
                marginTop: '1.5em',
                padding: '0.5em',
            }}
        >
            Pay
        </Button>
    );
}
