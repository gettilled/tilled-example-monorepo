const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const apiUrl = 'https://sandbox-api.tilled.com';
const tilledAccount = 'acct_XXXX'; // Replace with your Tilled account ID
const apiKey = process.env.TILLED_API_KEY; // Create an environment variable for your Tilled API key. See https://docs.tilled.com/api-reference#description/authentication


// Routes
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Authenticate user: https://docs.tilled.com/api-reference#tag/authentication/POST/v1/auth
    const authResponse = await fetch(apiUrl + '/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Tilled-Account': tilledAccount,
          'Tilled-Api-Key': apiKey,
        },
        body: JSON.stringify({
            email,
            password,
        })
      })

    if (authResponse.status === 200) {
        const authData = await authResponse.json();
        res.status(200).send({
            message: 'Login successful',
            token: authData.token, // Assuming the API returns a token
        });
    } else {
        res.status(401).send({
            message: 'Login failed',
        });
    }
});

app.post('/create-account', async (req, res) => {
    const { name, email, password } = req.body;
    
    // create the connected account: https://docs.tilled.com/api-reference#tag/accounts/POST/v1/accounts/connected
    const account = await (await fetch(apiUrl + '/v1/accounts/connected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Tilled-Account': tilledAccount,
          'Tilled-Api-Key': apiKey,
        },
        body: JSON.stringify({
            name,
            email,
        })
      })).json();

      console.log(account);
      if(!account) {
        res.status(500).send({
            message: 'Failed to create account',
        });
        return;
      }
      

    // Create a user invitation for that account: https://docs.tilled.com/api-reference#tag/users/POST/v1/user-invitations
    const userInvitation = await (await fetch(apiUrl + '/v1/user-invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Tilled-Account': tilledAccount,
          'Tilled-Api-Key': apiKey,
        },
        body: JSON.stringify({
            email,
            email_template: "none",
            role: "admin",
        })
      })).json();
      console.log(userInvitation);
      if(!userInvitation) {
        res.status(500).send({
            message: 'Failed to create user invitation',
        });
        return;
      }


    res.status(201).send({
        message: 'Account created successfully',
        invitation_url: userInvitation.invitation_url,
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


module.exports = app;