"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { FilterdTransaction, FilterdTransactionItem } from "@/app/lib/types";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FilterdTransaction;
}

export function TransactionModal({ isOpen, onClose ,initialData }: TransactionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      return () => {
        dialog.close();
      };
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className="bg-white rounded-lg shadow-xl w-full max-w-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-800/70">
      <div className="bg-white rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900">Order Details </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h4 className="font-medium text-gray-700">Customer Information</h4>
            <p>Name: {initialData?.customer_name}</p>
          </div>
          <div className="mb-4">
            <h4 className="font-medium text-gray-700">Order Items</h4>
            <div className="mt-2 border rounded-lg overflow-hidden border-neutral-300">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {initialData?.items.map((orderItem: FilterdTransactionItem) => {
                    return (
                      <tr key={orderItem.item_name}>
                        <td className="px-4 py-2">{orderItem?.item_name}</td>
                        <td className="px-4 py-2">{orderItem.quantity}</td>
                        <td className="px-4 py-2">
                          Rs.
                          {orderItem.total_price}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-between border-t pt-4 border-neutral-300">
            <span className="font-medium">Total Amount:</span>
            <span>Rs.{initialData?.total_amount}</span>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-gray-300">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
