const getPaymentMethods = (options) => {
    fetch('https://sandbox-api.tilled.com/v1/payment-methods', options)
  .then(data => {
      if (!data.ok) {
        throw Error(data.status);
       }
       return data.json();
      }).then(update => console.log(update));
}

export default getPaymentMethods