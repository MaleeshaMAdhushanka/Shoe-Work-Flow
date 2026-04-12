"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react";
import NavLinks from "./navlinks";
import { signOut } from "next-auth/react";

type MobileNavProps = {
  userRole?: string;
};

export default function MobileNav({ userRole }: MobileNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  async function handleLogout() {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="lg:hidden">
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={120} height={24} />
        </Link>
        <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-20 flex flex-col pt-16 bg-white">
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <NavLinks role={userRole} />
            <div className="mt-auto pt-4">
              <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                <LogOut className="h-5 w-5 text-red-600" />
                <span className="ml-3 font-medium text-red-600">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
