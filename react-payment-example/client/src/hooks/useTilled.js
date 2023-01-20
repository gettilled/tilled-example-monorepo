import { useEffect } from "react";
import useScript from "./useScript";

// This hook should be called from inside the form field components ach-debit-fields.js and credit-card-fields.js
// App doesn't need to "think" about the form or tilled.js in general
export default function useTilled(account_id, public_key, paymentTypeObj, fieldOptions) {
    // dynamically load tilled.js when component mounts
    const status = useScript("https://js.tilled.com/v2", "tilled-js-script");
    const message = status === "error" ? "Tilled.js was unable to load." : `Tilled.js is ${status}.`

    // initialize state
    // selects the corresponding element using the first id in paymentTypeObj.fields and 
    // uses it to determine whether or not there are any children (like tilled.js iframes)
    let hasInitiated = document.getElementById(Object.values(paymentTypeObj.fields)[0].slice(1))?.childNodes.length > 0;

    async function initTilled() {
        console.log("Initializing Tilled", paymentTypeObj)

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
            const [field, fieldId] = entry;
            const fieldElement = document.getElementById(fieldId.slice(1))

            paymentTypeObj.form.createField(field, fieldOptions ? fieldOptions : {}).inject(fieldElement);
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
        console.log("Tilled initialized", paymentTypeObj)
    }

    function teardown() {
        if (paymentTypeObj.form) {
            paymentTypeObj.form.teardown((success) => {
                paymentTypeObj.form = undefined;
                console.log("The form teardown has run successfully:", success)
            });
        }
    }

    useEffect(() => {
        // We could probably proxy the status, but this is simpler
        if (status === 'ready' && !hasInitiated) initTilled()

        return teardown()
    })

    return message;
}
