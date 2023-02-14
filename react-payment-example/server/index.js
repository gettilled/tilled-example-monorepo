const express = require('express')
const axios = require('axios')
const app = express()
const path = require('path')
const dotenv = require('dotenv').config()
const port = process.env.port || 5050
const cors = require('cors')
const tilledSecretApiKey = process.env.TILLED_SECRET_KEY
// const tilledAccountId = process.env.TILLED_ACCOUNT_ID

app.use(express.json());
app.use(cors())

app.get('/secret/:id', (req, res) => {
  const tilledAccountId = req.params.id
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + tilledSecretApiKey,
    'Tilled-Account': tilledAccountId,
  };
  axios.post('https://sandbox-api.tilled.com/v1/payment-intents',
    {
      amount: 500,
      currency: 'usd',
      payment_method_types: ['card','ach_debit'],
    },
    {
      headers: headers,
    })
    .then((response) => {
      console.log('Successfully created payment intent:')
      console.log(response.data)
      res.json({ client_secret: response.data.client_secret })
    })
    .catch((error) => {
      let errorMsg = 'Unable to create and return paymentIntent'

      if (error.response) {
      // Request made and server responded
        console.log(error.response.data)
        errorMsg = error.response.data.message
      } else if (error.request) {
      // The request was made but no response was received
        console.log(error.request)
      } else {
      // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }

      res.status(400).send({ message: errorMsg })
    });
});

app.post('/createCustomer', (req, res) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + tilledSecretApiKey,
    'Tilled-Account': req.body.tilled_account
  };
  axios.post('https://sandbox-api.tilled.com/v1/customers',
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name
    },
    {
      headers: headers,
    })
    .then((response) => {
      console.log('Successfully created customer:')
      console.log(response.data)
      res.json({ customer: response.data })
    })
    .catch((error) => {
      let errorMsg = 'Unable to create and return customer'
      
      if (error.response) {
      // Request made and server responded
        console.log(error.response.data)
        errorMsg = error.response.data.message
      } else if (error.request) {
      // The request was made but no response was received
        console.log(error.request)
      } else {
      // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }

      res.status(400).send({ message: errorMsg })
    });
});

app.post('/attachPaymentMethod', (req, res) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + tilledSecretApiKey,
    'Tilled-Account': req.body.tilled_account
  };
  // const paymentMethodId = req.body.payment_method_id
  console.log (req.body.payment_method_id)
  axios.patch('https://sandbox-api.tilled.com/v1/payment-methods/' + req.body.payment_method_id + '/attach',
    {
      customer: req.body.customer_id
    },
    {
      headers: headers,
    })
    .then((response) => {
      console.log('Successfully attached payment method:')
      console.log(response.data)
      res.json({ payment_method: response.data })
    })
    .catch((error) => {
      let errorMsg = 'Unable to attach payment method'

      if (error.response) {
      // Request made and server responded
        console.log(error.response.data)
        errorMsg = error.response.data.message
      } else if (error.request) {
      // The request was made but no response was received
        console.log(error.request)
      } else {
      // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }

      res.status(400).send({ message: errorMsg })
    });
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
//   open(`http://localhost:${port}`)
})
