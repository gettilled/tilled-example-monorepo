import { useEffect, useRef } from 'react';
import useScript from './useScript.ts';

// This hook should be called from inside the form field components ach-debit-fields.js and credit-card-fields.js
// App doesn't need to "think" about the form or tilled.js in general
// export default function useTilled(account_id, public_key, paymentTypeObj, refs, options) {
export default function useTilled(
    account_id,
    public_key,
    paymentTypeObj,
    tilled,
    form,
    options
) {
    const { fieldOptions, onFocus, onBlur } = options;
    // let { form, tilled } = refs;
    const { type, fields } = paymentTypeObj;
    // dynamically load tilled.js when component mounts
    const status = useScript('https://js.tilled.com/v2', 'tilled-js-script');
    const message =
        status === 'error'
            ? 'Tilled.js was unable to load.'
            : `Tilled.js is ${status}.`;

    async function initTilled() {
        if (form.current) {
            teardown();
        }
        // if(form) {
        //     form.build();
        //     return;
        // }
        console.log('Initializing Tilled', paymentTypeObj);
        // console.log(fields)

        // Create a new tilled instance
        tilled.current = new window.Tilled(public_key, account_id, {
            sandbox: true,
            log_level: 0,
        });

        // setTilled(tilled)
        // tilled.current = tilled

        if (form.current === null) console.log("form doesn't exist");
        if (form.current !== null) console.log('Form already exists');
        console.log(form);
        // await the form
        form.current = await tilled.current.form({
            payment_method_type: type,
        });

        // loop through fields and inject them
        Object.entries(fields).forEach((entry, i) => {
            const [field, fieldRef] = entry;
            const fieldElement = fieldRef.current;
            // if(form) console.log(form.current)
            // console.log(fieldElement.hasChildNodes())
            // console.log("round " + (i + 1))
            // console.log("injected: ", form.current.fields)
            // console.log("injecting: " + field)
            // console.log(form.current.fields, i)
            if (
                fieldElement?.childElementCount === 0 &&
                Object.keys(form.current.fields).length <= i
            )
                form.current
                    .createField(field, fieldOptions ? fieldOptions : {})
                    .inject(fieldElement);
            // if (fieldElement?.childElementCount === 0 && !form?.fields[field].ready) form.createField(field, fieldOptions ? fieldOptions : {}).inject(fieldElement);
        });

        // update card brand
        if (type === 'card' && document.getElementById('card-brand-icon')) {
            form.current.fields.cardNumber.on('change', evt => {
                const cardBrand = evt.brand;
                const icon = document.getElementById('card-brand-icon');

                switch (cardBrand) {
                    case 'amex':
                        icon.classList = 'fa fa-cc-amex';
                        break;
                    case 'mastercard':
                        icon.classList = 'fa fa-cc-mastercard';
                        break;
                    case 'visa':
                        icon.classList = 'fa fa-cc-visa';
                        break;
                    case 'discover':
                        icon.classList = 'fa fa-cc-discover';
                        break;
                    case 'diners':
                        icon.classList = 'fa fa-cc-diners-club';
                        break;
                    default:
                        icon.classList = '';
                }
            });
        }
        Object.values(form.current.fields).forEach(field => {
            if (onFocus) field.on('focus', () => onFocus(field));
            if (onBlur) field.on('blur', () => onBlur(field));
        });

        // Build the form
        form.current.build();
        // setForm(form)
        // form.current = form
        console.log('Tilled initialized', paymentTypeObj);
    }

    function teardown() {
        // const thisForm = form.current;
        // console.log(form, thisForm)
        console.log(form);
        if (form.current) {
            form.current.teardown(success => {
                // form = undefined;
                console.log('The form teardown has run successfully:', success);
            });
            // setForm(null)
            // setTilled(null)
            // form.current = null
            // tilled = null
        }
        console.log(form);
        console.log(`${type} component has unmounted`);
    }

    useEffect(() => {
        console.log(`${type} component mounted`);
        // teardown()
        // We could probably proxy the status, but this is simpler
        if (status === 'ready') initTilled();

        return teardown();
    });

    return message;
}
