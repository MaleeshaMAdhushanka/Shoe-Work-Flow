"use client";

import { Customer, OrderState } from "@/app/lib/types";
import { CustomerSelect } from "./customer-select";
import { CartContext } from "./cart-context";
import ItemCartCard from "./item-cart-card";
import { useContext, useState } from "react";
import { createOrder } from "@/app/lib/order/order-actions";

export default function ItemCart() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const { cart, updateQuantity, removeFromCart, total, clearCart } = useContext(CartContext);
  const initialState: OrderState = {
    message: null,
    errors: { customerId: [], orderItems: [] },
  };
  const [errorState, setErrorState] = useState<OrderState>(initialState);

  const placeOrder = async () => {
    if (!customer || cart.length === 0) return;

    const formData = new FormData();
    formData.append("customerId", customer.id);
    formData.append("orderItems", JSON.stringify(cart.map((cartItem) => ({ itemId: cartItem.item.id, quantity: cartItem.quantity }))));
    const response = await createOrder(formData);
    if (response.success) {
      setErrorState(initialState);
      setCustomer(null);
      clearCart();
    } else {
      setErrorState({
        message: response.message,
        errors: response.errors,
      });
    }
  };

  return (
    <div className={`w-full lg:w-96 bg-white rounded-xl shadow-lg p-4 `}>
      {errorState.message && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorState.message}</div>}

      <CustomerSelect selected={customer} onSelect={setCustomer} />
      {errorState?.errors?.customerId && errorState.errors.customerId.length > 0 && (
        <div className="mt-1 text-sm text-red-600">
          {errorState.errors.customerId.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <div className="space-y-4 mb-6 h-[calc(100vh-275px)] overflow-y-auto">
        {cart.map((cartItem) => {
          return <ItemCartCard key={cartItem.item.id} cartItem={cartItem} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />;
        })}
        {errorState?.errors?.orderItems && errorState.errors.orderItems.length > 0 && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorState.errors.orderItems.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4 border-neutral-400">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Total Amount:</span>
          <span className="text-xl font-semibold text-blue-600">Rs. {total.toFixed(2)}</span>
        </div>
        <button
          onClick={placeOrder}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
          disabled={!customer || cart.length === 0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
