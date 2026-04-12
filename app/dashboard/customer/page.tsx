import { Suspense } from "react";
import { fetchCustomersAndPages } from "@/app/lib/customer/customer-data";
import CustomerTable from "@/app/ui/customers/table";
import Pagination from "@/app/ui/pagination";
import { Metadata } from "next";
import SearchBar from "@/app/ui/search";
import CreateCustomer from "@/app/ui/customers/create-form";
import ProtectedPage from "@/app/ui/protectedpage";


export const metadata: Metadata = {
  title: "Customers",
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
  const { customers, totalPages } = await fetchCustomersAndPages(query, currentPage);

  return (
    <ProtectedPage path="/dashboard/customer">
      <div className="p-4 lg:p-7 bg-gray-50 h-screen-[calc(100vh-4rem)] overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Customer Management</h1>
        </div>
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar placeholder="Search customers... " />
          <CreateCustomer />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <CustomerTable customers={customers} />
        </Suspense>
        <div className="mx-auto w-fit">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </ProtectedPage>
  );
}