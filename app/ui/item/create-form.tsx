"use client";
import { UserPlus, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { ItemModal } from "./item-modal";
import { createItem } from "@/app/lib/item/item-actions";
import { ItemState } from "@/app/lib/types";

export default function CreateItem() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const initialState: ItemState = { message: null, errors: {} };
  const [errorState, setErrorState] = useState<ItemState>(initialState);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleAction = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
     const response =  await createItem(formData);
    if (response.success) {
      setErrorState(initialState);
      setIsModalOpen(false);
      setShowToast(true);
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
        Add Item
      </button>

      {/* Toast Notification */}
      {isMounted && showToast && (
        <div suppressHydrationWarning className="fixed top-6 right-6 bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-md animate-slideIn z-50">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium flex-1">New Item Add Successfully</p>
          <div className="w-1 h-8 bg-green-600 rounded"></div>
        </div>
      )}

      <ItemModal isOpen={isModalOpen} onClose={() => { 
        setErrorState(initialState)
        setIsModalOpen(false)
      }} mode="add" errorState={errorState}  initialData={undefined} onSubmit={handleSubmit} />
    </>
  );
}
