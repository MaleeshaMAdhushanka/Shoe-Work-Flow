import { fetchFilteredItems, fetchItemPages } from "@/app/lib/item/item-data";
import { CartProvider } from "@/app/ui/order/cart-context";
import ItemCart from "@/app/ui/order/item-cart";
import ItemTable from "@/app/ui/order/table";
import Pagination from "@/app/ui/pagination";
import ProtectedPage from "@/app/ui/protectedpage";
import SearchBar from "@/app/ui/search";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const items = await fetchFilteredItems(query, currentPage);
  const totalPages = await fetchItemPages(query);

  return (
    <ProtectedPage path="/dashboard/order">
      <div className="py-4  bg-gray-50 h-screen-[calc(100vh-2rem)] overflow-y-auto">
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Order Management</h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <CartProvider>
            <div className="flex-1">
              <div className="mb-6 relative flex items-center justify-between">
                <SearchBar placeholder="Search items..." />

                <Pagination totalPages={totalPages} />
              </div>
              <Suspense fallback={<div>Loading...</div>}>
                <ItemTable items={items} />
              </Suspense>
            </div>
            <ItemCart />
          </CartProvider>
        </div>
      </div>
    </ProtectedPage>
  );
}
