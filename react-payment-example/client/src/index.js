import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// console.log('useEffect has some strange behavior in the development server while strict mode is on. It has been disabled for local dev.')
// console.log(`
// This app is still under construction.

// I'm currently working on implementing tilled.js to create payment methods. 

// Next steps: 
//   1. Write a backend script to create payment intents.
//   2. Confirm those payment intents with tilled.js
//   3. Add customer functionality and reusable payment methods
// `)