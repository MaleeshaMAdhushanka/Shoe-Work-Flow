"use client";

import { useState } from "react";
import { Eye, } from "lucide-react";
import { FilterdTransaction } from "@/app/lib/types";
import { TransactionModal } from "./transaction-modal";

export default function TransactionTable({ transactions }: { transactions: FilterdTransaction[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FilterdTransaction | null>(null);

  const handleAction = (action: "view", transaction?: FilterdTransaction) => {
    setSelectedTransaction(transaction || null);
    setIsModalOpen(true);
  };
  return (
    <>
      <div className="bg-white mb-8 rounded-lg shadow-sm overflow-hidden border border-gray-300">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-295px)]">
          <table className="min-w-full divide-y divide-gray-200 relative">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {[
                  { field: "id", label: "Transaction ID" },
                  { field: "customerName", label: "Customer Name" },
                  { field: "totalAmount", label: "Total Amount" },
                  { field: "date", label: "Date" },
                ].map(({ field, label }) => (
                  <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group bg-gray-50">
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                    </div>
                  </th>
                ))}
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.order_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.order_id.split("-")[0]}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.customer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rs.{transaction.total_amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.order_date).toLocaleDateString()}</td>
                  <td className="flex px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button onClick={() => handleAction("view", transaction)} className="text-blue-600 hover:text-blue-900 mx-2">
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={selectedTransaction||undefined} />
    </>
  );
}
