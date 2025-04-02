const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const apiUrl = "https://sandbox-api.tilled.com";
const tilledAccount = "acct_XXXX"; // Replace with your Tilled account ID
const apiKey = process.env.TILLED_API_KEY; // Create an environment variable for your Tilled API key. See https://docs.tilled.com/api-reference#description/authentication

// Routes
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "/", "index.html"));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  // Ideally, you would would be able to associate the provided credentials with a Tilled user
  // However, in this example, we will use the Login endpoint to reterieve the user: https://docs.tilled.com/api-reference#tag/users/POST/v1/auth/login
  const loginResponse = await (
    await fetch(apiUrl + "/v1/auth/login", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
  ).json();

  if (loginResponse?.error) {
    console.error("Failed to login:" + loginData?.message);
    return;
  }

  const { user } = loginResponse;

  // create the auth link: https://docs.tilled.com/api-reference#tag/auth-links/POST/v1/auth-links
  const authLink = await (
    await fetch(apiUrl + "/v1/auth-links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Tilled-Account": user.account_id,
        "Tilled-Api-Key": apiKey,
      },
      body: JSON.stringify({
        expiration: "1d",
        redirect_url: "/payments", // this defaults to /dashboard
        user_id: user.id,
      }),
    })
  ).json();

  if (authLink?.error) {
    console.error("Failed to create auth link:" + authLink?.message);
    return;
  }

  res.status(200).send(authLink);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
