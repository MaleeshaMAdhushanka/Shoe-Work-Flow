"use client";

import { Item, OrderItem } from "@/app/lib/types";
import { createContext, useCallback, useState } from "react";

interface CartContextType {
  cart: OrderItem[];
  addToCart: (item: Item) => void;
  canAddToCart: (item: Item) => boolean;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  canAddToCart: () => false,
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<OrderItem[]>([]);

  const total = cart.reduce((sum, orderItem) => {
    return sum + (orderItem.item.price || 0) * orderItem.quantity;
  }, 0);

  const canAddToCart = (item: Item) => {
    const cartItem = cart.find((x) => x.item.id === item.id);
    const currentQty = cartItem ? cartItem.quantity : 0;
    return currentQty < item.qty;
  };


  const addToCart = useCallback((item: Item) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.item.id === item.id);
      if (existing) {
        return prev.map((orderItem) => (orderItem.item.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem));
      }
      return [...prev, { item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((orderItem) => orderItem.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(itemId);
        return;
      }
      setCart((prev) => prev.map((orderItem) => (orderItem.item.id === itemId ? { ...orderItem, quantity } : orderItem)));
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        canAddToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}