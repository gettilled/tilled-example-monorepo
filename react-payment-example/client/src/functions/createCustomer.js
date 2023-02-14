const account_id = process.env.REACT_APP_TILLED_ACCOUNT_ID;
async function createCustomer () {
  let customer_id = null;
    const response = await fetch("/createCustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tilled_account: account_id,
        first_name: document.getElementById('billing-details-first-name-element').value,
        last_name: document.getElementById('billing-details-last-name-element').value
      }),
    });
    const data = await response.json();
    console.log('Customer created successfully.');
    console.log(data.customer.id);
    customer_id = data.customer.id;
    return customer_id;
  }

export default createCustomer;