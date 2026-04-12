"use client";
import { UserPlus } from "lucide-react";
import { CustomerModal } from "./customer-modal";
import { useState } from "react";
import { createCustomer } from "@/app/lib/customer/customer-actions";
import { CustomerState } from "@/app/lib/types";

export default function CreateCustomer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialState: CustomerState = { message: null, errors: {} };
  const [errorState, setErrorState] = useState<CustomerState>(initialState);

  const handleAction = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    const response = await createCustomer(formData);
    if (response.success) {
      setErrorState(initialState);
      setIsModalOpen(false);
    } else {
      setErrorState({
        message: response.message,
        errors: response.errors,
      });
    }
  };

  return (
    <>
      <button 
        onClick={handleAction}
        suppressHydrationWarning
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors max-w-md"
      >
        <UserPlus className="h-5 w-5 mr-2" />
        Add Customer
      </button>
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setErrorState(initialState);
          setIsModalOpen(false);
        }}
        mode="add"
        errorState={errorState}
        initialData={undefined}
        onSubmit={handleSubmit}
      />
    </>
  );
}
