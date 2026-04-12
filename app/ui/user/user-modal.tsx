"use client";

import { FormEvent, useEffect, useRef } from "react";
import { X, Mail, Lock, Users } from "lucide-react";
import { User, UserState } from "@/app/lib/types";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "add";
  errorState: UserState;
  initialData?: User;
  onSubmit: (data: FormData) => void;
}

export function UserModal({ isOpen, onClose, mode, errorState, initialData, onSubmit }: UserModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

  useEffect(() => {
    if (!isOpen && formRef.current) {
      formRef.current.reset();
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    onSubmit(formData);
  };

  const getModalTitle = () => {
    switch (mode) {
      case "view":
        return "User Details";
      case "edit":
        return "Edit User";
      case "add":
        return "Add New User";
    }
  };

  return (
    <dialog ref={dialogRef} className="bg-white rounded-lg shadow-xl w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-800/70">
      <div className="bg-white rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900">{getModalTitle()}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} method="dialog">
          <div className="p-4 space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    defaultValue={initialData?.email}
                    placeholder="Enter user email"
                    className={`pl-10 w-full border rounded-lg py-2 px-3 outline-none ${
                      errorState?.errors?.email ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    readOnly={mode === "view"}
                    required
                  />
                </div>
                {errorState?.errors?.email && <p className="mt-1 text-sm text-red-600">{errorState.errors.email[0]}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter user password"
                    className={`pl-10 w-full border rounded-lg py-2 px-3 outline-none ${
                      errorState?.errors?.password ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    readOnly={mode === "view"}
                    required
                  />
                </div>
                {errorState?.errors?.password && <p className="mt-1 text-sm text-red-600">{errorState.errors.password[0]}</p>}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    name="role"
                    className={`pl-10 w-full border rounded-lg py-2 px-3 appearance-none outline-none  ${
                      errorState?.errors?.role ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } `}
                    defaultValue={initialData?.role}
                    disabled={mode === "view"}
                    required
                  >
                    <option value="" disabled>
                      Select role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="sales">Sales</option>
                    <option value="inventory">Inventory</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                {errorState?.errors?.role && <p className="mt-1 text-sm text-red-600">{errorState.errors.role[0]}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-300">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            {mode !== "view" && (
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                {mode === "edit" ? "Save Changes" : "Add User"}
              </button>
            )}
          </div>
        </form>
      </div>
    </dialog>
  );
}
