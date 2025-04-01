# Create Account & Login App

This repository contains a simple Express application paired with an HTML form. The app provides functionality for both logging in and creating a new account, integrating with a Tilled API for user authentication and account management.

---

## Features

- **Account Creation:** Create a connected account and send a user invitation using the Tilled API.
- **Responsive Frontend:** A clean HTML form styled with CSS for entering user details.
- **Express Backend:** Routes set up for handling login and account creation, along with basic error handling.

---

## Installation

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Tilled API key:

   ```env
   TILLED_API_KEY=your_api_key_here
   ```

4. **Start the Server:**
   ```bash
   node app.js
   ```
   Alternatively, if you use nodemon:
   ```bash
   nodemon app.js
   ```

---

## Usage

- **Access the Form:**  
  Open your browser and navigate to `http://localhost:3000`.

- **Create Account:**  
  Fill in the full name, email, and password fields, then click the **Create Account** button.  
  The app sends a POST request to the `/create-account` endpoint to:
  - Create a connected account.
  - Generate a user invitation and redirect the user to the invitation URL if successful.

---

## Endpoints

- **GET `/`**  
  Serves the HTML file containing the form.

- **POST `/create-account`**  
  Creates a connected account and sends a user invitation using the Tilled API. On success, redirects the user to the invitation URL provided in the response.

---

## Error Handling

- Errors are logged to the console.
- Users are notified with an alert message when an error occurs during login or account creation.

---

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **API Integration:** Tilled API (sandbox environment)
