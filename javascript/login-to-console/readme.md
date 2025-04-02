# Tilled Login App

This project is a simple Node.js application that provides a user login interface integrated with Tilled's API. The application serves an HTML login form and handles user authentication and auth link generation through the Tilled API.

---

## Features

- **User Login:**  
  Users can log in using their email and password via the provided HTML form.
- **Auth Link Generation:**  
  After successful login, the app generates an authentication link using Tilled's API. If the auth link is valid and not already redeemed, the user is redirected accordingly.

- **Responsive Design:**  
  A clean and straightforward interface is built with HTML and inline CSS for an optimal user experience.

- **Express Backend:**  
  The server is built with Express, handling routes for serving the HTML file and processing the login requests.

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

3. **Set Up Environment Variables:**
   Create a `.env` file in the root directory and add your Tilled API key:

   ```env
   TILLED_API_KEY=your_tilled_api_key_here
   ```

   Make sure you also update the Tilled account ID in the source code if needed.

4. **Start the Server:**
   ```bash
   node app.js
   ```
   Alternatively, you can use nodemon for development:
   ```bash
   nodemon app.js
   ```

---

## Usage

- **Access the Login Page:**  
  Open your browser and navigate to `http://localhost:3000` to see the login form.

- **Logging In:**

  - Enter your email and password.
  - On form submission, the app sends a POST request to `/login`.
  - If the login is successful, an auth link is created using the Tilled API.
  - The user is then redirected to the URL provided in the auth link unless the link has already been redeemed.

- **Navigation:**  
  The login page includes a link to sign up (pointing to a related repository) and a link to Tilled's documentation for further information.

---

## Endpoints

- **GET `/`**  
  Serves the HTML login form.

- **POST `/login`**
  - Accepts JSON payload with `email` and `password`.
  - Uses the Tilled API to authenticate the user.
  - Generates an auth link which includes an expiration time and a redirect URL.
  - Returns the auth link JSON object or displays appropriate error messages.

---

## Technologies Used

- **Frontend:** HTML, CSS, and JavaScript for a responsive login form.
- **Backend:** Node.js, Express, and Body-Parser.
- **Environment Management:** dotenv for environment variables.
- **API Integration:** Tilled API for user authentication and auth link creation.

---

## Error Handling

- **Logging:**  
  Errors during login or auth link generation are logged to the console for debugging.

- **User Feedback:**  
  Users receive alerts if there are issues during the login process, such as invalid credentials or if the auth link has already been redeemed.
