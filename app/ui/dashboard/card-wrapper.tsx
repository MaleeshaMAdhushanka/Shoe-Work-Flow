import { ShoppingBag, Users, DollarSign } from "lucide-react";
import { fetchCardData } from "@/app/lib/dashboard/data";
import Card from "./card";

export default async function CardWrapper() {
  const { totalOrders, totalCustomers, totalRevenue } = await fetchCardData();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card title="Total Orders" value={totalOrders} icon={<ShoppingBag className="h-4 w-4 text-blue-600" />} color="blue" />
      <Card title="Total Customers" value={totalCustomers} icon={<Users className="h-4 w-4 text-green-600" />} color="green" />
      <Card title="Total Revenue" value={`Rs ${totalRevenue}`} icon={<DollarSign className="h-4 w-4 text-violet-600" />} color="violet" />
    </div>
  );
}
