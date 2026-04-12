import { ReactNode } from "react";
import SideNav from "../ui/dashboard/sidenav";
import MobileNav from "../ui/dashboard/mobile-nav";
import { auth } from "@/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const userRole = session?.user?.role;

  return (
    <div className="min-h-screen bg-gray-50">
      <SideNav />
      <MobileNav userRole={userRole} />
      <main className="flex-grow pt-16 lg:pt-0 px-4 md:px-6 lg:ml-64">{children}</main>
    </div>
  );
}
