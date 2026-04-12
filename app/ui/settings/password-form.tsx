"use client";
import { CreateUserState } from "@/app/lib/types";
import { updateUserPassword } from "@/app/lib/user/user-actions";
import { Lock } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

export default function ChangePassword({ email }: { email: string | undefined }) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialPasswordState = { message: null, errors: {} };
  const [passwordError, setPasswordError] = useState<CreateUserState>(initialPasswordState);

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    if (email) {
      formData.append("email", email);
    }

    if (formData.get("newPassword") !== formData.get("confirmPassword")) {
      setPasswordError({
        message: "Passwords do not match",
        errors: { confirmPassword: ["Passwords do not match"] },
      });
      return;
    }

    const response = await updateUserPassword(formData);

    if(response.success) {
      setPasswordError(initialPasswordState);
      formRef.current.reset();
    } else {
      setPasswordError({
        message: response.message,
        errors: response.errors,
      });
    }
  };

  return (
    <div className="w-full max-w-xl ">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
        <form ref={formRef} onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="password"
                type="password"
                className="pl-10 w-full  rounded-lg py-2 px-3 border-neutral-300 border-2 outline-none focus:border-blue-500"
                placeholder="Enter current password"
              />
            </div>
            {passwordError?.errors?.password && <p className="mt-1 text-sm text-red-600">{passwordError.errors.password[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 " />
              <input
                name="newPassword"
                type="password"
                className="pl-10 w-full  rounded-lg py-2 px-3 border-neutral-300 border-2 outline-none focus:border-blue-500"
                placeholder="Enter new password"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="confirmPassword"
                type="password"
                className="pl-10 w-full rounded-lg py-2 px-3 border-neutral-300 border-2 outline-none focus:border-blue-500"
                placeholder="Confirm new password"
              />
            </div>
            {passwordError?.errors?.confirmPassword&& <p className="mt-1 text-sm text-red-600">{passwordError.errors.confirmPassword[0]}</p>}
          </div>
          <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
