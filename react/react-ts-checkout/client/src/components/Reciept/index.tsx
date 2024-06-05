import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import currencyFormatter from "../../utils/currency-formatter";
import { CartType } from "../Checkout";
import { useRef } from "react";

export default function Receipt(props: { total: number; cart: CartType }) {
  let { cart } = props;
  let total = 0;
  const merchantName = import.meta.env.VITE_TILLED_MERCHANT_NAME || "";
  const salesTax = Number(import.meta.env.VITE_TILLED_MERCHANT_TAX) || 1;
  const printButtonRef = useRef<HTMLButtonElement>(null);

  cart.forEach((item) => {
    if (item.subscription) {
      total += item.subscription.price;
    } else {
      total += item.price * item.quantity;
    }
  });
  const printReceipt = () => {
    printButtonRef.current?.classList.add("hidden");
    window.print();
    printButtonRef.current?.classList.remove("hidden");
  }


  return (
    <div
      className="p-12 w-[488px] max-w-screen"
      data-testid="receipt-container"
    >
      <div className="mb-8">
        <a href="#">
          <FontAwesomeIcon icon={faArrowLeft} />
          {" " + merchantName}
        </a>
      </div>
      <div className="mb-8">
        <div className="text-slate-600 mb-2">Reciept for {merchantName}</div>
        <div className="text-3xl font-bold">
          {currencyFormatter(total * salesTax)}
        </div>
      </div>
      <ul data-testid="cart-items-list">
        {cart.map((item) => {
          const { imagePath, name, price, quantity, subscription } = item;
          return (
            <li
              key={"list-item_" + name.replace(" ", "-")}
              className="flex justify-between mb-4"
            >
              <div className="flex gap-2">
                <img
                  src={imagePath}
                  alt={name + " image"}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <div>{name}</div>
                  {subscription ? (
                    <span className="text-xs bg-slate-200 p-0.5 rounded-xl">
                      {subscription.interval_unit}ly
                    </span>
                  ) : (
                    <div className="text-sm">
                      <span>x </span>
                      {quantity}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div>{currencyFormatter(price * quantity)}</div>
                {quantity > 1 ? (
                  <div className="text-sm text-slate-600">
                    {currencyFormatter(price)} each
                  </div>
                ) : (
                  ""
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-8">
        <div className="flex justify-between">
          <div>Subtotal</div>
          <div>{currencyFormatter(total)}</div>
        </div>
        <div className="flex justify-between ">
          <div>Sales Tax</div>
          <div>
            {currencyFormatter(total * salesTax - total)}
          </div>
        </div>
        <div className="flex justify-between">
          <div>Total</div>
          <div className="font-bold text-lg">{currencyFormatter(total * salesTax)}</div>
        </div>
      </div>
      <button
        className="bg-slate-700 text-white p-3 rounded mt-8 w-full font-bold text-xl"
        onClick={() => window.print()}
        ref={printButtonRef}
      >
        Print Receipt
      </button>
    </div>
  );
}
