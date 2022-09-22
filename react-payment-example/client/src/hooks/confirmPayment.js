// async function confirmPayment (tilled, form) {
//     await tilled.confirmPayment(clientSecret, {
//         payment_method: { 
//             form,
//             type: form.type,
//             billing_details: {
//             name: document.getElementById('billing-details-name-element').value.trim(),
//             address: {
//                 country: document.getElementById('').value,
//                 zip: document.getElementById('').value.trim(),
//                 state: document.getElementById('').value,
//                 city: document.getElementById('').value.trim(),
//                 street: document.getElementById('billing-details-street-element').value.trim()
//             }
//             }
//         },
//         }).then(
//             (payment) => {
//             console.log('Successful payment.')
//             console.log(payment)
//             window.alert('Successful payment')
//             // payment is successful, payment will contain information about the transaction that was created
//             },
//             (error) => {
//             console.log('Failed to confirm payment.')
//             console.log(error)
//             // show the error to the customer
//             window.alert(error)
//             },
//         )
// }

// // export default confirmPayment; 