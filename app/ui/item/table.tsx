"use client";//client side component

import { deleteItem, updateItem } from "@/app/lib/item/item-actions";
import { Item, ItemState } from "@/app/lib/types";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ItemModal } from "./item-modal";

export default function ItemTable({ items }: { items: Item[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const initialState: ItemState = { message: null, errors: {} };
  const [errorState, setErrorState] = useState<ItemState>(initialState);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleAction = (action: "view" | "edit", item?: Item) => {
    setModalMode(action);
    setSelectedItem(item || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    if (modalMode === "edit" && selectedItem) {
      const response = await updateItem(selectedItem.id, formData);
      if (response.success) {
        setIsModalOpen(false);
        setErrorState(initialState);
      } else {
        setErrorState({
          message: response.message,
          errors: response.errors,
        });
      }
    }
  };

  async function handleRemove(id: string, image: string) {
    await deleteItem(id, image);
  }
  return (
    <>
      <div className="bg-white mb-8 rounded-lg shadow-sm overflow-hidden border border-gray-300" suppressHydrationWarning>
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-295px)]">
          <table className="min-w-full divide-y divide-gray-200 relative">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {[
                  { field: "name", label: "Name" },
                  { field: "image", label: "Image" },
                  { field: "price", label: "Price" },
                  { field: "size", label: "Size" },
                  { field: "qty", label: "Qty" },
                  { field: "status", label: "Status" },
                ].map(({ field, label }) => (
                  <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  bg-gray-50">
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                    </div>
                  </th>
                ))}
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-2 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-2 whitespace-nowrap">
                  <Image src={item.image ? `${process.env.NEXT_PUBLIC_BLOB_URL}${item.image.trimEnd()}` : "/default.jpg"} alt={item.name} width={64} height={64} className="size-16 object-cover rounded opacity-60" />                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">Rs.{item.price}</td>
                  <td className="px-6 py-2 whitespace-nowrap">{item.size}</td>
                  <td className="px-6 py-2 whitespace-nowrap">{item.qty}</td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "active" ? "bg-green-100 text-green-800" : item.status === "inactive" ? "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button suppressHydrationWarning onClick={() => handleAction("view", item)} className="text-blue-600 hover:text-blue-900 mx-2">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button suppressHydrationWarning onClick={() => handleAction("edit", item)} className="text-amber-600 hover:text-amber-900 mx-2">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button suppressHydrationWarning onClick={() => handleRemove(item.id, item.image)} className="text-red-600 hover:text-red-900 mx-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setErrorState(initialState);
          setIsModalOpen(false);
        }}
        mode={modalMode}
        errorState={errorState}
        initialData={selectedItem || undefined}
        onSubmit={handleSubmit}
      />
    </>
  );
}
