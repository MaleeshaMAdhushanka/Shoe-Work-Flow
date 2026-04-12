"use client";
import { Item } from "@/app/lib/types";
import ItemCard from "./item-card";
import { CartContext} from "./cart-context";
import { useContext } from "react";

export default function ItemTable({ items }: { items: Item[] }) {
  const { addToCart,canAddToCart } =    useContext(CartContext);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-100px)]">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} addToCart={addToCart} canAddToCart={canAddToCart} />
      ))}
    </div>
  );
}
