import { Suspense } from "react";
import Pagination from "@/app/ui/pagination";
import { Metadata } from "next";
import SearchBar from "@/app/ui/search";
import { fetchItemsAndPages } from "@/app/lib/item/item-data";
import ItemTable from "@/app/ui/item/table";
import CreateItem from "@/app/ui/item/create-form";
import ProtectedPage from "@/app/ui/protectedpage";

export const metadata: Metadata = {
  title: "Items",
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
  
  // Optimized: Single function call instead of 2 sequential queries
  const { items, totalPages } = await fetchItemsAndPages(query, currentPage);

  return (
    <ProtectedPage path="/dashboard/item">
      <div className="p-4 lg:p-7 bg-gray-50 h-screen-[calc(100vh-4rem)] overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Item Management</h1>
        </div>
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar placeholder="Search items... " />
          <CreateItem />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ItemTable items={items} />
        </Suspense>

        <div className="mx-auto w-fit">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </ProtectedPage>
  );
}
