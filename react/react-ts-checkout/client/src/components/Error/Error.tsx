import { faPersonFalling } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Button} from '@mui/material';

interface ErrorProps {
    message?: string;
    tryAgain?: () => void;
}

function Error(props: ErrorProps) {
    const {message, tryAgain} = props;
    return (
        <div className='flex flex-col items-center p-2'>
            Sorry, there has been an error.
            <FontAwesomeIcon className='w-12' icon={faPersonFalling} />
            {message ? message : ''}
            {tryAgain ? <Button onClick={tryAgain}>Try Again</Button> : ''}
        </div>
    );
}

export default Error;
