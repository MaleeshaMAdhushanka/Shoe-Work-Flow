"use client";
import { UserX } from "lucide-react";
import { useActionState, useState } from "react";
import DeleteConfirmModal from "./delete-modal";
import { deleteUserWithPassword } from "@/app/lib/user/user-actions";
import { DeleteUserState } from "@/app/lib/types";

export default function DeleteAccount({ email }: { email: string | undefined }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const initialState: DeleteUserState = { message: null, errors: {} };
  const [deleteError, formAction] = useActionState(deleteUserWithPassword, initialState);

  const handleCloseDialog = () => {
    setShowDeleteDialog(false);
  };
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h2>
        <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button onClick={() => setShowDeleteDialog(true)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center">
          <UserX className="h-5 w-5 mr-2" />
          Delete Account
        </button>
      </div>
      <DeleteConfirmModal email={email || ""} showDeleteDialog={showDeleteDialog} deleteError={deleteError || initialState} handleCloseDialog={handleCloseDialog} handleDeleteAccount={formAction} />
    </>
  );
}
