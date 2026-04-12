"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { UserModal } from "./user-modal";
import { updateUser, deleteUser } from "@/app/lib/user/user-actions";
import { User, UserState } from "@/app/lib/types";

export default function UserTable({ users }: { users: User[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const initialState: UserState = { message: null, errors: {} };
  const [errorState, setErrorState] = useState<UserState>(initialState);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAction = (action: "view" | "edit", user?: User) => {
    setModalMode(action);
    setSelectedUser(user || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    if (modalMode === "edit" && selectedUser) {
      const response = await updateUser(selectedUser.id, formData);
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
    await deleteUser(id);
  }

  return (
    <>
      <div className="bg-white mb-8 rounded-lg shadow-sm overflow-hidden border border-gray-300">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-295px)]">
          <table className="min-w-full divide-y divide-gray-200 relative">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {[
                  { field: "email", label: "Email" },
                  { field: "role", label: "Role" },
                ].map(({ field, label }) => (
                  <th
                    key={field}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider group bg-gray-50"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                    </div>
                  </th>
                ))}
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'sales' ? 'bg-green-100 text-green-800' :
                      user.role === 'inventory' ? 'bg-orange-100 text-yellow-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="flex px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button onClick={() => handleAction("view", user)} className="text-blue-600 hover:text-blue-900 mx-2">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleAction("edit", user)} className="text-amber-600 hover:text-amber-900 mx-2">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleRemove(user.id)} className="text-red-600 hover:text-red-900 mx-2">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setErrorState(initialState);
          setIsModalOpen(false);
        }}
        mode={modalMode}
        errorState={errorState}
        initialData={selectedUser || undefined}
        onSubmit={handleSubmit}
      />
    </>
  );
}
