import { useEffect, useRef } from 'react';
import { ITilledFieldOptions } from '../utils/TilledFieldOptions';
import useScript from './useScript';

declare global { interface Window { Tilled: any } }
interface ChangeEvent {
    valid: boolean,
    empty: boolean,
    fieldType: string,
    error: any,
    brand: string
};

// This hook should be called from inside the form field components
// ach-debit-fields.tsx and credit-card-fields.tsx

export default function useTilled(
    account_id: string,
    public_key: string,
    paymentTypeObj: {
        type: string,
        fields: {
            cardNumber?: React.MutableRefObject<any>,
            cardExpiry?: React.MutableRefObject<any>,
            cardCvv?: React.MutableRefObject<any>,
            bankRoutingNumber?: React.MutableRefObject<any>,
            bankAccountNumber?: React.MutableRefObject<any>
        },
        cardCapture?: { ref: React.MutableRefObject<null>; handler: (el: HTMLElement, formInstance: any) => void };
        cardBrandIcon?: React.MutableRefObject<any>
    },
    tilled: React.MutableRefObject<any>,
    options: ITilledFieldOptions
): string {
    const { fieldOptions, onFocus, onBlur, onError } = options;
    const { type, fields, cardCapture } = paymentTypeObj;

    const form = useRef(null);

    // dynamically load tilled.js when component mounts
    const status = useScript('https://js.tilled.com/v2', 'tilled-js-script');
    const message =
        status === 'error'
            ? 'Tilled.js was unable to load.'
            : `Tilled.js is ${status}.`;

    async function initTilled() {
        // Purge any old iFrames
        Object.values(fields).forEach((ref) => {
            const fieldElement = ref.current as HTMLElement;
            while (fieldElement.firstChild) {
                if (fieldElement.lastChild) fieldElement.removeChild(fieldElement.lastChild)
            }
        });

        // Create a new tilled instance
        // You will need to extend the widow interface with Tilled: any
        if (tilled.current[type] === null) {
            tilled.current[type] = new window.Tilled(public_key, account_id, {
                sandbox: true,
                log_level: 0,
            });
        }

        const tilledInstance = tilled.current[type];

        form.current = await tilledInstance.form({
            payment_method_type: type,
        });

        const formInstance = form.current as any;

        // teardown to remove old fields
        formInstance.teardown()

        // loop through fields and inject them
        Object.entries(fields).forEach((entry) => {
            const [field, fieldRef] = entry;
            const fieldElement = fieldRef.current as HTMLElement;

            // Create new fields and inject them
            formInstance
                .createField(field, fieldOptions ? fieldOptions : {})
                .inject(fieldElement);
        });

        if (cardCapture) {
            const { ref, handler } = cardCapture;
            if (ref.current) {
                const cardCaptureElement = ref.current as HTMLElement;
                handler(cardCaptureElement, formInstance);

            } else {
                throw new Error('cardCapture ref is not defined');
            }
        }

        Object.values(formInstance.fields).forEach((field: any) => {
            if (onFocus) {
                field.on('focus', () => onFocus(field));
                field.on('change', (change: ChangeEvent) => {
                    if (change.empty === false) onFocus(field)
                })
            }
            if (onBlur) field.on('blur', () => onBlur(field));
            if (onError) field.on('change', (change: ChangeEvent) => {
                if (!change.valid) onError(field);
            });
        });

        // Build the form
        formInstance.build();
    }

    useEffect(() => {
        // We could probably proxy the status, but this is simpler
        if (status === 'ready') initTilled();
    });

    return message;
}
