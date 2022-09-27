async function confirmPayment (paymentTypeObj, secret) {
    const {tilled, form} = paymentTypeObj;
    const clientSecret = await secret
    console.log(clientSecret)
    await tilled.confirmPayment(clientSecret, {
        payment_method: { 
            form,
            type: form.type,
            billing_details: {
            name: document.getElementById('billing-details-name-element').value.trim(),
            address: {
                country: document.getElementById('billing-details-country-element').value,
                zip: document.getElementById('billing-details-zip-element').value.trim(),
                state: document.getElementById('billing-details-state-element').value,
                city: document.getElementById('billing-details-city-element').value.trim(),
                street: document.getElementById('billing-details-street-element').value.trim()
            }
            }
        },
        }).then(
            (payment) => {
            console.log('Successful payment.')
            console.log(payment)
            window.alert('Successful payment')
            // payment is successful, payment will contain information about the transaction that was created
            },
            (error) => {
            console.log('Failed to confirm payment.')
            console.log(error)
            // show the error to the customer
            window.alert(error)
            },
        )
}

export default confirmPayment; 