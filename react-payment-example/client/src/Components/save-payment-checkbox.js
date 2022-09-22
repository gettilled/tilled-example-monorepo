import React from 'react';

export default function SavePaymentCheckbox() {
    return (
        <div className='flex justify-around p-3'>
            <p className='w-4/5'>Would you like to save this payment method?</p>
            <label className='flex flex-col'>
                Yes
                <input type='checkbox' id='save-payment-checkbox' name='save-payment-checkbox' value={true} className=' w-4 p-6 m-auto' />
            </label>
        </div>
    )
}