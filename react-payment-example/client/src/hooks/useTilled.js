import { useEffect } from "react";
import useScript from "./useScript";

// This hook should be called from inside the form field components ach-debit-fields.js and credit-card-fields.js
// App doesn't need to "think" about the form or tilled.js in general
export default function useTilled(account_id, public_key, paymentTypeObj, fieldOptions) {
    // dynamically load tilled.js when component mounts
    const status = useScript("https://js.tilled.com/v2", "tilled-js-script");
    const message = status === "error" ? "Tilled.js was unable to load." : `Tilled.js is ${status}.`


    async function initTilled() {
        // Create a new tilled instance
        paymentTypeObj.tilled = new window.Tilled(
            public_key, 
            account_id, 
            { 
            sandbox: true,
            log_level: 0 
            }
        )
        
        // await the form
        paymentTypeObj.form = await paymentTypeObj.tilled.form({
            payment_method_type: paymentTypeObj.type,
        })
        
        // loop through fields and inject them
        Object.entries(paymentTypeObj.fields).forEach((entry) => {
        const [field, fieldElement] = entry;

        // set placeholder for cardExpiry
        fieldOptions.placeholder = field === 'cardExpiry' ? 'MM/YY' : undefined;
        paymentTypeObj.form.createField(field, fieldOptions).inject(fieldElement);
        });

        // update card brand
        if (paymentTypeObj.type === 'card' && document.getElementById('card-brand-icon')) {
            paymentTypeObj.form.fields.cardNumber.on('change', (evt) => {
                const cardBrand = evt.brand;
                const icon = document.getElementById('card-brand-icon');
            
                switch (cardBrand) {
                case 'amex': 
                    icon.classList = 'fa fa-cc-amex'; break;
                case 'mastercard':
                    icon.classList = 'fa fa-cc-mastercard'; break;
                case 'visa':
                    icon.classList = 'fa fa-cc-visa'; break;
                case 'discover':
                    icon.classList = 'fa fa-cc-discover'; break;
                case 'diners':
                    icon.classList = 'fa fa-cc-diners-club'; break;
                default:
                    icon.classList = '';
                }
            });
        }

        // Build the form
        paymentTypeObj.form.build()
    }

    useEffect(() => {
        const script = document.getElementById('tilled-js-script')
            
        // We could probably proxy the status, but this is simpler
        script && script.getAttribute("data-status") === 'ready' ? initTilled() : script.addEventListener('load', initTilled)

        return function teardown() {
        if (paymentTypeObj.form) paymentTypeObj.form.teardown((success) => {console.log("The componenet has been successfully unmounted", success)});
        }
    }, [account_id, public_key, initTilled ])

    return message;
}