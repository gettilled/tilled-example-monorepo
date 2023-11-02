import { faPersonFalling } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface ErrorProps {
    message?: string;
}

function Error(props: ErrorProps) {
    const message = props.message;
    return (
        <div className='flex flex-col items-center p-2'>
            Sorry, there has been an error.
            <FontAwesomeIcon className='w-12' icon={faPersonFalling} />
            {message ? message : ''}
        </div>
    );
}

export default Error;
