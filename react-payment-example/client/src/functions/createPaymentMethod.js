async function createPaymentMethod (paymentTypeObj) {
    let payment_method_id = null;
    const {tilled, form} = paymentTypeObj;
    const paymentMethod = { 
        form,
        type: paymentTypeObj.type,
        billing_details: {
            // name: document.getElementById('billing-details-name-element').value.trim(),
            name: document.getElementById('billing-details-first-name-element').value.trim() + ' ' + document.getElementById('billing-details-last-name-element').value.trim(),
            address: {
                country: document.getElementById('billing-details-country-element').value,
                zip: document.getElementById('billing-details-zip-element').value.trim(),
                state: document.getElementById('billing-details-state-element').value,
                city: document.getElementById('billing-details-city-element').value.trim(),
                street: document.getElementById('billing-details-street-element').value.trim()
            }
        }
    }

    // include bank account type for ach debit payments
    if (paymentTypeObj.type === "ach_debit") paymentMethod.ach_debit = {account_type: document.getElementById('bank-account-type-element').value}

    await tilled.createPaymentMethod(paymentMethod).then(
        (paymentMethod) => {
        console.log('Successful payment method.')
        console.log(paymentMethod)
        window.alert('Payment method created successfully \n' + paymentMethod.id)
        payment_method_id = paymentMethod.id;
        console.log(payment_method_id);
        return payment_method_id;
        },
        (error) => {
        console.log('Failed to create payment method.')
        console.log(error)
        // show the error to the customer
        window.alert(error)
        },
    )
}

export default createPaymentMethod;