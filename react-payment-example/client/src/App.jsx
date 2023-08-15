import { useState } from "react";
import confirmPayment from "./functions/confirmPayment";
import getSecret from "./functions/getSecret";
import { useForm } from "react-hook-form";

import CreditCardFields from "./components/credit-card-fields";
import AchDebitFields from "./components/ach-debit-fields";
import BillingDetailsFields from "./components/billing-details-fields";
// import SavePaymentCheckbox from './components/save-payment-checkbox';
import "./App.css";

const pk_PUBLISHABLE_KEY = import.meta.env.VITE_TILLED_PUBLIC_KEY;
const account_id = import.meta.env.VITE_TILLED_ACCOUNT_ID;

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

    await confirmPayment(thisType, secret);
  }

  return (
    <div className="App checkout-app max-w-md p-5 bg-white shadow-lg">
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
