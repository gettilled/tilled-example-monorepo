async function getSecret (tilledAccountId) {
    // Ask server to generate PaymentIntent
    // it will send back clientSecret
    let secretResponse = await fetch('api/secret/' + tilledAccountId)
    let clientSecret = null;
    console.log(secretResponse)
    if (secretResponse.ok) {
        let secretData = await secretResponse.json()
        clientSecret = secretData.client_secret

        console.log('PaymentIntent clientSecret: ' + clientSecret)
    } else {
        console.log('Failed to fetch secret.')
    }
    return clientSecret;
}

export default getSecret