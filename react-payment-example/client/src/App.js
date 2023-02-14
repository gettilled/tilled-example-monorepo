import { useState } from "react";
import confirmPayment from "./functions/confirmPayment";
import createPaymentMethod from "./functions/createPaymentMethod";
import getSecret from "./functions/getSecret";
// import createCustomer from "./functions/createCustomer";
import attachPaymentMethod from "./functions/attachPaymentMethod";
import { useForm } from "react-hook-form";

import CreditCardFields from "./components/credit-card-fields";
import AchDebitFields from "./components/ach-debit-fields";
import BillingDetailsFields from "./components/billing-details-fields";
// import SavePaymentCheckbox from './components/save-payment-checkbox';
import "./App.css";

const pk_PUBLISHABLE_KEY = process.env.REACT_APP_TILLED_PUBLIC_KEY;
const account_id = process.env.REACT_APP_TILLED_ACCOUNT_ID;

const paymentMethodTypes = {
  creditCard: {
    type: "card",
    fields: {
      cardNumber: "#card-number-element",
      cardExpiry: "#card-expiration-element",
      cardCvv: "#card-cvv-element",
    },
  },
  bankTransfer: {
    type: "ach_debit",
    fields: {
      bankRoutingNumber: "#bank-routing-number-element",
      bankAccountNumber: "#bank-account-number-element",
    },
  },
};

const navItems = [
  {
    id: 1,
    title: "Credit Card",
    iconClass: "nav-icon fa fa-credit-card",
    content: (
      <CreditCardFields
        account_id={account_id}
        public_key={pk_PUBLISHABLE_KEY}
        paymentTypeObj={paymentMethodTypes.creditCard}
      />
    ),
  },
  {
    id: 2,
    title: "Bank Transfer",
    iconClass: "nav-icon fa fa-university",
    content: (
      <AchDebitFields
        account_id={account_id}
        public_key={pk_PUBLISHABLE_KEY}
        paymentTypeObj={paymentMethodTypes.bankTransfer}
      />
    ),
  },
];

function App() {
  const [active, setActive] = useState(1);
  const [savePM, setSavePM] = useState(false);

  // const { handleSubmit, formState: { errors } } = useForm();
  const { handleSubmit } = useForm();
  // const onSubmit = data => console.log(data);
  async function onSubmit(event) {
    event.currentTarget.classList.add("opacity-50");
    event.currentTarget.setAttribute("disabled", "");
    const secret = await getSecret(account_id);
    const thisType =
      active === 1
        ? paymentMethodTypes.creditCard
        : paymentMethodTypes.bankTransfer;
    if (!savePM) {
      await confirmPayment(thisType, secret);
    } else if (savePM) {
      const paymentMethodId = await createPaymentMethod(thisType);
      await attachPaymentMethod(paymentMethodId);
    }
  }

  return (
    <div className="App checkout-app max-w-md p-5 bg-white shadow-lg items-center justify-center mx-auto">
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
        <div className="flex flex-col items-center justify-center">
          <div
            className="w-full mt-1"
            style={{
              width: "94%",
            }}
          >
            <div
              className={`flex items-center justify-between border border-neutral-200 rounded-md p-1 shadow-slate-180 shadow-sm ${
                savePM
                  ? "shadow-lg border-blue-700 border-double border-opacity-80"
                  : ""
              }`}
              style={{
                height: "2.2rem",
              }}
              onClick={() => setSavePM(!savePM)}
            >
              <label className="p-1" htmlFor="save-pm-checkbox">
                Create Payment Method?
              </label>
              <input
                className="form-checkbox h-4 w-4"
                style={{
                  position: "relative",
                  left: "-12px",
                }}
                type="checkbox"
                name="save-pm-checkbox"
                id="card-save-pm-checkbox-element"
                checked={savePM}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
        <input
          className="submit-btn w-full border rounded-md mt-6 p-3 h-auto bg-blue-700 text-xl text-white font-bold"
          type="submit"
          onClick={onSubmit}
          // value={savePM ? "Save" : "Pay"}
          value={savePM ? "Save" : "Pay"}
        />
      </form>
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
