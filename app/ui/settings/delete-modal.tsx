import { useRef, useEffect } from "react";
import { Lock, X } from "lucide-react";
import { DeleteUserState } from "@/app/lib/types";

interface DeleteConfirmModalProps {
  email: string;
  showDeleteDialog: boolean;
  deleteError: DeleteUserState;
  handleCloseDialog: () => void;
  handleDeleteAccount: (payload:FormData) => void;
}

function DeleteConfirmModal({ email, showDeleteDialog, deleteError, handleCloseDialog, handleDeleteAccount }: DeleteConfirmModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!showDeleteDialog) {
      return;
    }
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      return () => {
        dialog.close();
      };
    }
  }, [showDeleteDialog]);

  return (
    <>
      <dialog ref={dialogRef} className="rounded-lg shadow-xl w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-800/70">
        <form action={handleDeleteAccount}>
          <div className="bg-white rounded-lg">
            <div className="flex items-center justify-between p-4 border-b border-neutral-300">
              <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
              <button onClick={handleCloseDialog} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <p className="text-gray-600 mb-4">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
              {deleteError.errors?.password && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg ">{deleteError.errors?.password[0]}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter your password to confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    className="pl-10 w-full rounded-lg py-2 px-3 border-neutral-300 border-2 outline-none focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  <input type="hidden" name="email" value={email} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-300">
              <button onClick={handleCloseDialog} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg">
                Delete Account
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default DeleteConfirmModal;
