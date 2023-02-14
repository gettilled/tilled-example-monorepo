const account_id = process.env.REACT_APP_TILLED_ACCOUNT_ID;
async function attachPaymentMethod(paymentMethodId, customerId) {
    console.log(paymentMethodId, customerId)
    const response = await fetch(`/payment-methods/${paymentMethodId}/attach`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "tilled_account": account_id
        },
        body: JSON.stringify({
            customer_id: customerId,
        }),
    });
    const data = await response.json();
    console.log('Payment method attached successfully.');
    console.log(data);
    return data;
}
export default attachPaymentMethod;