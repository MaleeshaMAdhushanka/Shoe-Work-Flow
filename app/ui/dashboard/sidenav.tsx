import Link from "next/link";
import NavLinks from "./navlinks";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";

export default async function SideNav() {
  const session = await auth();
  const user = session?.user;

  async function handleLogout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 z-30 h-screen w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex items-center p-4 border-b border-gray-200">
        <Link href="/">
          <Image className="mx-auto" src="/logo.png" alt="logo" width={158} height={32} />
        </Link>
      </div>

      <div className="flex grow flex-col justify-between p-4">
        <NavLinks role={user?.role} />
        <form action={handleLogout}>
          <button 
            suppressHydrationWarning
            className="w-full flex items-center p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5 text-red-600" />
            <span className="ml-3 font-medium text-red-60">Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
