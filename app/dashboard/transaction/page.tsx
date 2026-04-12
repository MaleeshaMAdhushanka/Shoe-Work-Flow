import { fetchTransactionsAndPages } from "@/app/lib/transaction/transaction-data";
import Pagination from "@/app/ui/pagination";
import ProtectedPage from "@/app/ui/protectedpage";
import SearchBar from "@/app/ui/search";
import TransactionTable from "@/app/ui/transaction/table";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Transactions",
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
  const { transactions, totalPages } = await fetchTransactionsAndPages(query, currentPage);

  return (
    <ProtectedPage path="/dashboard/transaction">
      <div className="p-4 lg:p-7 bg-gray-50 h-screen-[calc(100vh-4rem)] overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Transaction Management</h1>
        </div>
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar placeholder="Search transactions... " />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <TransactionTable transactions={transactions} />
        </Suspense>

        <div className="mx-auto w-fit">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </ProtectedPage>
  );
}
