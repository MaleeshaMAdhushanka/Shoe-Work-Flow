import { Item } from "@/app/lib/types";
import { Plus } from "lucide-react";
import Image from "next/image";

interface ItemCardProps {
  item: Item;
  addToCart: (item: Item) => void;
  canAddToCart: (item: Item) => boolean;
}

function ItemCard({ item, addToCart,canAddToCart }: ItemCardProps) {
  return (
    <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="relative h-40 sm:h-48 bg-gray-100">
        <Image src={item.image ? `${process.env.NEXT_PUBLIC_BLOB_URL}${item.image}` : "/default.jpg"} alt={item.name} fill className="w-full h-full object-cover" />
        <button
          onClick={() => {
            addToCart(item);
          }}
          disabled={!canAddToCart(item)}
          className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Size: {item.size}</span>
          <span className="font-medium text-blue-600">Rs. {item.price}</span>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-600">Available: {item.qty}</span>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
