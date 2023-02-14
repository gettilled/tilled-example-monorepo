const account_id = process.env.REACT_APP_TILLED_ACCOUNT_ID;
async function attachPaymentMethod(paymentMethodId, customerId) {
    const response = await fetch("/attachPaymentMethod", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tilled_account: account_id,
            payment_method_id: paymentMethodId,
            customer_id: customerId,
        }),
    });
    const data = await response.json();
    console.log('Payment method attached successfully.');
    console.log(data);
    return data;
}
export default attachPaymentMethod;