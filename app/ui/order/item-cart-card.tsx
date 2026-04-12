'use client'

import { OrderItem } from "@/app/lib/types";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";

interface ItemCartCardProps {
  cartItem: OrderItem;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

export default function ItemCartCard({ cartItem, updateQuantity, removeFromCart }: ItemCartCardProps) {
  const { item, quantity } = cartItem;

  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
      <Image 
        src={item.image ? `${process.env.NEXT_PUBLIC_BLOB_URL}${item.image}` : "/default.jpg"} 
        alt={item.name} 
        width={64}
        height={64}
        className="object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="font-medium">{item.name}</h4>
        <div className="text-sm text-gray-600">Size: {item.size}</div>
        <div className="mt-2 flex items-center gap-2">
          <button 
            onClick={() => updateQuantity(item.id, quantity - 1)} 
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, quantity + 1)} 
            className="p-1 rounded-full hover:bg-gray-200" 
            disabled={quantity >= item.qty}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">Rs. {item.price * quantity}</div>
        <button 
          onClick={() => removeFromCart(item.id)} 
          className="text-red-500 hover:text-red-600 mt-2"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}