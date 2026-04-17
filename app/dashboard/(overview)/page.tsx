import { Suspense } from "react";
import CardWrapper from "@/app/ui/dashboard/card-wrapper";
import { BestSellersSkeleton, CardsSkeleton, RevenueChartSkeleton } from "@/app/ui/dashboard/skeletons";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import BestSellers from "@/app/ui/dashboard/best-sellers";
import { auth } from "@/auth";
import { fetchAllInventoryItems, fetchInventoryStats } from "@/app/lib/item/inventory-report-data";
import { fetchActiveOrders, fetchCustomerOrderStats, fetchSalesStats, fetchTopCustomersByOrders } from "@/app/lib/order/sales-report-data";
import { fetchAdminDashboardStats } from "@/app/lib/admin/admin-report-data";
import { PDFDownloadButton } from "@/app/ui/inventory/pdf-download";
import { SalesPDFDownloadButton } from "@/app/ui/sales/pdf-download";
import { AdminPDFDownloadButton } from "@/app/ui/admin/pdf-download";
import { hasAccess } from "@/app/lib/config/permission";

export default async function Page() {
  const session = await auth();
  const userRole = session?.user?.role || "";
  
  // Check if user is admin
  const isAdmin = userRole.toLowerCase() === "admin";
  
  // Show inventory report for inventory managers and admins
  const canViewInventoryReport = userRole.toLowerCase() === "inventory" || userRole.toLowerCase() === "admin" || userRole.toLowerCase() === "manager";
  // Show sales report for sales managers and admins
  const canViewSalesReport = userRole.toLowerCase() === "sales" || userRole.toLowerCase() === "admin" || userRole.toLowerCase() === "manager";

  let inventoryItems: any[] = [];
  let inventoryStats: any = null;
  let salesData: any = null;
  let adminData: any = null;

  if (isAdmin) {
    try {
      const dashboardStats = await fetchAdminDashboardStats();
      adminData = {
        stats: {
          total_revenue: dashboardStats.total_revenue,
          total_orders: dashboardStats.total_orders,
          total_customers: dashboardStats.total_customers,
        },
        userCounts: dashboardStats.user_counts,
        revenueByDate: dashboardStats.revenue_by_date,
        transactions: dashboardStats.transactions,
      };
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  }

  if (canViewInventoryReport) {
    try {
      const [items, stats] = await Promise.all([
        fetchAllInventoryItems(),
        fetchInventoryStats(),
      ]);
      inventoryItems = items;
      inventoryStats = {
        total_items: Number(stats.total_items),
        total_qty: Number(stats.total_qty),
        avg_qty: Number(stats.avg_qty),
      };
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  }

  if (canViewSalesReport) {
    try {
      const [orders, customers, stats, topCustomers] = await Promise.all([
        fetchActiveOrders(),
        fetchCustomerOrderStats(),
        fetchSalesStats(),
        fetchTopCustomersByOrders(10),
      ]);
      salesData = {
        orders,
        customers,
        stats: {
          total_orders: stats.total_orders,
          total_revenue: stats.total_revenue,
          avg_order_value: stats.avg_order_value,
          active_customers: stats.active_customers,
        },
        topCustomers,
      };
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  }

  return (
    <div className="p-4 lg:p-7 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Admin Report Section for Admin Users */}
      {isAdmin && adminData && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Admin Dashboard Report</h2>
            <AdminPDFDownloadButton data={adminData} />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Download comprehensive admin report including system users breakdown, transaction analytics, revenue trends, and overall system health metrics.
          </p>
        </div>
      )}

      {/* Inventory Report Section for Inventory Manager */}
      {canViewInventoryReport && inventoryStats && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900"> Inventory Report</h2>
            <PDFDownloadButton items={inventoryItems} stats={inventoryStats} />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            View detailed inventory analysis with charts showing stock levels, quantities by size, and highlighted high-quantity items.
          </p>
        </div>
      )}

      {/* Sales Report Section for Sales Manager */}
      {canViewSalesReport && salesData && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Sales Manager Report</h2>
            <SalesPDFDownloadButton data={salesData} />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Download sales analytics including customer orders, revenue analysis, and performance metrics.
          </p>
        </div>
      )}

      <div className="grid gap-6 mb-6">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm">
          <Suspense fallback={<RevenueChartSkeleton />}>
            <RevenueChart />
          </Suspense>
        </div>
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <Suspense fallback={<BestSellersSkeleton />}>
            <BestSellers />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
