import ProtectedPage from "@/app/ui/protectedpage";
import DeleteAccount from "@/app/ui/settings/delete-form";
import ChangePassword from "@/app/ui/settings/password-form";
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();
  const user = session?.user;
  return (
    <ProtectedPage path="/dashboard/settings">
    <div className="p-4 lg:p-7 bg-gray-50 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      <div className="flex justify-center gap-5">
        <div className="max-w-xl w-full space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-2">
              <p className="text-gray-600">Email: {user?.email}</p>
              <p className="text-gray-600">Role: {user?.role}</p>
            </div>
          </div>
          <DeleteAccount email={user?.email || undefined} />
        </div>
        <ChangePassword email={user?.email || undefined} />
      </div>
    </div>
    </ProtectedPage>
  );
}