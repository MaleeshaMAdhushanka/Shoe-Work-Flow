"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { CustomerModal } from "./customer-modal";
import { updateCustomer, deleteCustomer } from "@/app/lib/customer/customer-actions";
import { Customer, CustomerState } from "@/app/lib/types";

export default function CustomerTable({ customers }: { customers: Customer[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const initialState: CustomerState = { message: null, errors: {} };
  const [errorState, setErrorState] = useState<CustomerState>(initialState);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleAction = (action: "view" | "edit", customer?: Customer) => {
    setModalMode(action);
    setSelectedCustomer(customer || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    if (modalMode === "edit" && selectedCustomer) {
      const response = await updateCustomer(selectedCustomer.id, formData);
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

  async function handleRemove(id: string) {
    await deleteCustomer(id);
  }

  return (
    <>
      <div className="bg-white mb-8 rounded-lg shadow-sm overflow-hidden border border-gray-300">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-295px)]">
          <table className="min-w-full divide-y divide-gray-200 relative">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {[
                  { field: "name", label: "Name" },
                  { field: "email", label: "Email" },
                  { field: "mobile", label: "Mobile" },
                  { field: "address", label: "Address" },
                ].map(({ field, label }) => (
                  <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  group bg-gray-50">
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                    </div>
                  </th>
                ))}
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{customer.address}</td>
                  <td className="flex px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button onClick={() => handleAction("view", customer)} className="text-blue-600 hover:text-blue-900 mx-2">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleAction("edit", customer)} className="text-amber-600 hover:text-amber-900 mx-2">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleRemove(customer.id)} className="text-red-600 hover:text-red-900 mx-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setErrorState(initialState);
          setIsModalOpen(false);
        }}
        mode={modalMode}
        errorState={errorState}
        initialData={selectedCustomer || undefined}
        onSubmit={handleSubmit}
      />
    </>
  );
}
