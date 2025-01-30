import { useState, useRef } from "react";
import confirmPayment from "./functions/confirmPayment";
import getSecret from "./functions/getSecret";
import { useForm } from "react-hook-form";
import CreditCardFields from "./components/credit-card-fields";
import AchDebitFields from "./components/ach-debit-fields";
import BillingDetailsFields from "./components/billing-details-fields";
import "./App.css";

function App() {
  const pk_PUBLISHABLE_KEY = import.meta.env.VITE_TILLED_PUBLIC_KEY;
  const account_id = import.meta.env.VITE_TILLED_ACCOUNT_ID;
  const formatCurrency = (amount, currency) =>
	new Intl.NumberFormat("en-US", {
	  style: "currency",
	  currency,
	}).format(amount * 0.01); // amount is in minor units

  const paymentMethodTypesRef = useRef({
    card: {
      type: "card",
      fields: {
        cardNumber: "#card-number-element",
        cardExpiry: "#card-expiration-element",
        cardCvv: "#card-cvv-element",
      },
    },
    ach_debit: {
      type: "ach_debit",
      fields: {
        bankRoutingNumber: "#bank-routing-number-element",
        bankAccountNumber: "#bank-account-number-element",
      },
    },
  });

  const navItems = [
    {
      id: 1,
      title: "Credit Card",
      iconClass: "nav-icon fa fa-credit-card",
      content: (
        <CreditCardFields
          key="credit-card"
          account_id={account_id}
          public_key={pk_PUBLISHABLE_KEY}
          paymentTypeObj={paymentMethodTypesRef}
        />
      ),
    },
    {
      id: 2,
      title: "Bank Transfer",
      iconClass: "nav-icon fa fa-university",
      content: (
        <AchDebitFields
          key="ach-debit"
          account_id={account_id}
          public_key={pk_PUBLISHABLE_KEY}
          paymentTypeObj={paymentMethodTypesRef}
        />
      ),
    },
  ];

  const [active, setActive] = useState(1);
  const [receipt, setReceipt] = useState(null);
  const { handleSubmit } = useForm();
  async function onSubmit(event) {
    event.currentTarget.classList.add("opacity-50");
    event.currentTarget.setAttribute("disabled", "");
    const secret = await getSecret(account_id);
    const thisType =
      active === 1
        ? paymentMethodTypesRef.current.card
        : paymentMethodTypesRef.current.ach_debit;

    const paymentIntent = await confirmPayment(thisType, secret);
    console.log(paymentIntent);
    const { amount, currency, id, statement_descriptor_suffix } = paymentIntent;
    setReceipt({ amount, currency, statement_descriptor_suffix, id });
  }

  return (
    <div className="App checkout-app max-w-md p-5 bg-white shadow-lg">
      {!receipt ? (
        <>
          <header className="App checkout-header">
            <h1 className="text-3xl text-center mb-4">React Payment Example</h1>
          </header>
          <form className="credit-card_form" onSubmit={handleSubmit(onSubmit)}>
            <ul className="nav flex justify-around m-3 rounded border">
              {navItems.map(({ id, iconClass, title }) => (
                <NavPill
                  key={title}
                  iconClass={iconClass}
                  title={title}
                  onItemClicked={() => setActive(id)}
                  isActive={active === id}
                />
              ))}
            </ul>
            <BillingDetailsFields />
            <div className="content">
              {navItems.map(({ id, content }) => {
                return active === id ? content : "";
              })}
            </div>
            {/* <SavePaymentCheckbox /> */}
            <input
              className="submit-btn w-full border rounded-md mt-6 p-3 h-auto bg-blue-700 text-xl text-white font-bold"
              type="submit"
              onClick={onSubmit}
              value="Pay"
            />
          </form>
        </>
      ) : (
        <div className="receipt">
          <h2 className="text-3xl text-center mb-4">Payment received {receipt?.statement_descriptor_suffix ? "for " + receipt.statement_descriptor_suffix : ""}</h2>
          <p>Total: {formatCurrency(receipt.amount, receipt.currency)}</p>
          <p>Payment ID: {receipt.id}</p>
		  <button className="w-full border rounded-md mt-6 p-3 h-auto bg-blue-700 text-xl text-white font-bold" onClick={() => window.print()}>Print</button>
			
			
        </div>
      )}
    </div>
  );
}

const NavPill = ({
  iconClass = "",
  title = "",
  onItemClicked = () =>
    console.error("You didn't pass an action to the component"),
  isActive = false,
}) => {
  return (
    <li
      className={isActive ? "navItem" : "navItem navItem--inactive"}
      onClick={onItemClicked}
    >
      <i className={iconClass} />
      &nbsp;{title}
    </li>
  );
};

export default App;
