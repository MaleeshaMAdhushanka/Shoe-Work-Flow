"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, UserCircle, Settings, Package, Layers, AlertTriangle } from "lucide-react";
import { hasAccess } from "@/app/lib/config/permission";

type NavLinksProps = {
  role?: string;
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Customers", path: "/dashboard/customer" },
  { icon: ShoppingBag, label: "Items", path: "/dashboard/item" },
  { icon: AlertTriangle, label: "Stock Alerts", path: "/dashboard/stock-alerts" },
  { icon: UserCircle, label: "Users", path: "/dashboard/user" },
  { icon: Package, label: "Orders", path: "/dashboard/order" },
  { icon: Layers, label: "Transactions", path: "/dashboard/transaction" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export default function NavLinks({ role }: NavLinksProps) {
  const pathname = usePathname();
  console.log('NavLinks - User role:', role);
  return (
    <nav className=" space-y-2 flex-grow">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = pathname === item.path;
        const hasAccessToItem = role && hasAccess(role, item.path);
        console.log(`Route ${item.path}: hasAccess=${hasAccessToItem}`);
        if (hasAccessToItem) {
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center p-3 rounded-lg transition-colors
              ${isActive ? "bg-sky-100 text-blue-600" : "hover:bg-gray-100 text-gray-600 hover:text-blue-600"}`}
            >
              <IconComponent className="h-5 w-5" />
              <span className="ml-3">{item.label}</span>
            </Link>
          );
        }
      })}
    </nav>
  );
}
