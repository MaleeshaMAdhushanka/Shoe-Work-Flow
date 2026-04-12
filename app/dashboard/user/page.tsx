import { Suspense } from "react";
import { fetchUserPages, fetchFilteredUsers } from "@/app/lib/user/user-data";
import UserTable from "@/app/ui/user/table";
import Pagination from "@/app/ui/pagination";
import { Metadata } from "next";
import SearchBar from "@/app/ui/search";
import CreateUser from "@/app/ui/user/create-form";
import ProtectedPage from "@/app/ui/protectedpage";

export const metadata: Metadata = {
  title: "Users",
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

  const users = await fetchFilteredUsers(query, currentPage);
  const totalPages = await fetchUserPages(query);

  return (
    <ProtectedPage path="/dashboard/user">
      <div className="p-4 lg:p-7 bg-gray-50 h-screen-[calc(100vh-4rem)] overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        </div>
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <SearchBar placeholder="Search users... " />
          <CreateUser />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <UserTable users={users} />
        </Suspense>

        <div className="mx-auto w-fit">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </ProtectedPage>
  );
}
