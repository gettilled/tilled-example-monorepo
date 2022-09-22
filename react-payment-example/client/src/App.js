import { useState, useEffect } from 'react';
// import { useState } from 'react';

// Hooks
// import useScript from './hooks/useScript';
import getTilled from './hooks/getTilled';
import injectFields from './hooks/injectFields';
import buildForm from './hooks/buildForm';
import getSecret from './hooks/getSecret';
import { useForm } from 'react-hook-form';

// Components
import CreditCardFields from './Components/credit-card-fields'
import AchDebitFields from './Components/ach-debit-fields'
import BillingDetailsFields from './Components/billing-details-fields'
import SavePaymentCheckbox from './Components/save-payment-checkbox';
import './App.css';

const pk_PUBLISHABLE_KEY = 'pk_AuYSsbLcWRrVx4AHAKU4FVLIgZlRLxf6LLtG04bspyo8YZnPhQsN9Ibm733Im3kUwGSpBy72QgfWhO1QJmtwPsWQdWmIssQWEVTs';
const account_id = 'acct_iITmFPIzjDBqiXOFwNv6V';

// Will eventually update these dynamically... Probably won't implement a whole login funcitonality. Might just fake it and prompt for the customer_id
// let customer_id , account_id;


const navItems = [
  {
    id: 1,
    title: 'Credit Card',
    type: 'card',
    iconClass: 'nav-icon fa fa-credit-card',
    content:  <CreditCardFields />,
    fields: {
      cardNumber: "#card-number-element",
      cardExpiry: "#card-expiration-element",
      cardCvv: "#card-cvv-element",
    },
  },
  {
    id: 2,
    title: 'Bank Transfer',
    type: 'ach_debit',
    iconClass: 'nav-icon fa fa-university',
    content:  <AchDebitFields />,
    fields: {
      bankRoutingNumber: "#bank-routing-number-element",
      bankAccountNumber: "#bank-account-number-element",
    },
  }
];
const creditCard = navItems[0];
const bankTransfer = navItems[1];

function App() {
  // let paymentIntentId, paymentMethodId;
  const [active, setActive] = useState(1);

  const diableSubmitBtn = (event) => {
    event.currentTarget.classList.add('opacity-50');
    event.currentTarget.setAttribute('disabled', "")
  }
  // const displayAlert = () => { 
  //   setTimeout(()=>{
  //     window.alert(`Successful Payment! The paymentIntent id is ${paymentIntentId} and the paymentMethod id is ${paymentMethodId}`)
  //   }, 200)
  // }

  const { handleSubmit, formState: { errors } } = useForm();
  // const onSubmit = data => console.log(data);
  const onSubmit = data => {
    const secret = getSecret(account_id)
  }
  
  // console.log(errors);

  useEffect(() => {
    (async () => {
    const tilled = await getTilled(account_id, pk_PUBLISHABLE_KEY)
    buildForm(tilled, creditCard)
  })();
  }, [])

  return (
    <div className="App checkout-app max-w-md p-5 bg-white shadow-lg">
      <header className="App checkout-header">
        <h1 className='text-3xl text-center mb-4'>React Payment Example</h1>
      </header>
      <form className='credit-card_form' onSubmit={handleSubmit(onSubmit)}>
        <ul className='nav flex justify-around m-3 rounded border'>
          {navItems.map(({ id, iconClass, title }) => <NavPill
            key={title}
            iconClass={iconClass}
            title={title}
            onItemClicked={async () => {
              const tilled = await getTilled(account_id, pk_PUBLISHABLE_KEY)
              const thisType = active === 2 ? creditCard : bankTransfer;
              setActive(id)
              buildForm(tilled, thisType)
            }}
            isActive={active === id}
          />
        )}
        </ul>
        <BillingDetailsFields />
        <div className="content">
          {navItems.map(({ id, content }) => {
            return active === id ? content : ''
          })}
        </div>
        {/* <SavePaymentCheckbox /> */}
        <input className='submit-btn w-full border rounded-md mt-6 p-3 h-auto bg-blue-700 text-xl text-white font-bold' type="submit" onClick={diableSubmitBtn} value='Pay'/>
      </form>
    </div>
  );
}

const NavPill = ({
  iconClass = '',
  title = '',
  onItemClicked = () => console.error("You didn't pass an action to the component"),
  isActive = false
}) => {
  return (
    <li className={isActive ? 'navItem' : 'navItem navItem--inactive'} onClick={onItemClicked} >
        <i className={iconClass} />&nbsp;{title}
    </li> 
)}

export default App;