async function getSecret (tilledAccountId) {
    // Generally gone in advance...
    // Ask server to generate PaymentIntent
    // it will send back clientSecret
    let secretResponse = await fetch('/secret/' + tilledAccountId)
    let secretData = await secretResponse.json()
    let clientSecret = secretData.client_secret

    console.log('PaymentIntent clientSecret: ' + clientSecret)
    return clientSecret;
}

export default getSecret