import { Suspense } from "react";
import { Metadata } from "next";
import ProtectedPage from "@/app/ui/protectedpage";
import {
  fetchAllInventoryItems,
  fetchInventoryStats,
  fetchHighStockItems,
  fetchLowStockItems,
} from "@/app/lib/item/inventory-report-data";
import { InventoryBarChart, InventoryPieChart, InventoryDetailTable, StatCard } from "@/app/ui/inventory/charts";
import { PDFDownloadButton } from "@/app/ui/inventory/pdf-download";

export const metadata: Metadata = {
  title: "Inventory Report",
};

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

async function InventoryReportContent_() {
  const [items, stats, highStockItems, lowStockItems] = await Promise.all([
    fetchAllInventoryItems(),
    fetchInventoryStats(),
    fetchHighStockItems(),
    fetchLowStockItems(),
  ]);

  const statsData = {
    total_items: Number(stats.total_items),
    total_qty: Number(stats.total_qty),
    avg_qty: Number(stats.avg_qty),
  };

  // Calculate stock status distribution
  const avgQty = items.length > 0 ? items.reduce((sum, item) => sum + item.qty, 0) / items.length : 0;
  const highStockCount = items.filter((item) => item.qty > avgQty * 1.5).length;
  const mediumStockCount = items.filter((item) => item.qty >= avgQty * 0.5 && item.qty <= avgQty * 1.5).length;
  const lowStockCount = items.filter((item) => item.qty < avgQty * 0.5).length;
  const totalItems = items.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📊 Inventory Report</h1>
            <p className="text-gray-600 mt-1">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <PDFDownloadButton items={items} stats={statsData} />
        </div>
      </div>

      {/* Summary Statistics Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          📊 Summary Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Items"
            value={statsData.total_items}
            color="blue"
          />
          <StatCard
            label="Total Quantity"
            value={statsData.total_qty}
            color="green"
          />
          <StatCard
            label="Average Qty/Item"
            value={statsData.avg_qty.toFixed(0)}
            color="purple"
          />
          <StatCard
            label="High Qty Threshold"
            value={(statsData.avg_qty * 1.5).toFixed(0)}
            color="orange"
          />
        </div>
      </div>

      {/* Bar Chart Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <InventoryBarChart items={items} />
      </Suspense>

      {/* Stock Status Distribution Cards */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          📊 Stock Status Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* High Stock Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <h3 className="text-lg font-bold text-green-900">High Stock</h3>
            </div>
            <p className="text-4xl font-bold text-green-700 mb-2">{highStockCount}</p>
            <p className="text-sm text-green-700">
              {totalItems > 0 ? ((highStockCount / totalItems) * 100).toFixed(0) : 0}% of items
            </p>
          </div>

          {/* Medium Stock Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <h3 className="text-lg font-bold text-yellow-900">Medium Stock</h3>
            </div>
            <p className="text-4xl font-bold text-yellow-700 mb-2">{mediumStockCount}</p>
            <p className="text-sm text-yellow-700">
              {totalItems > 0 ? ((mediumStockCount / totalItems) * 100).toFixed(0) : 0}% of items
            </p>
          </div>

          {/* Low Stock Card */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-400 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <h3 className="text-lg font-bold text-red-900">Low Stock</h3>
            </div>
            <p className="text-4xl font-bold text-red-700 mb-2">{lowStockCount}</p>
            <p className="text-sm text-red-700">
              {totalItems > 0 ? ((lowStockCount / totalItems) * 100).toFixed(0) : 0}% of items
            </p>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <Suspense fallback={<LoadingSpinner />}>
        <InventoryPieChart items={items} />
      </Suspense>

      {/* Detailed Inventory Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          📋 Inventory Details
        </h2>
        <Suspense fallback={<LoadingSpinner />}>
          <InventoryDetailTable items={items} highlightThreshold={statsData.avg_qty * 1.5} />
        </Suspense>
      </div>

      {/* High Stock Items Section */}
      {highStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-900 mb-4">✓ Items with High Quantity (Above {(statsData.avg_qty * 1.5).toFixed(0)})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highStockItems.map((item) => (
              <div key={item.id} className="bg-white border-2 border-green-300 p-4 rounded-lg hover:shadow-lg transition">
                <h3 className="font-bold text-green-900 text-lg">{item.name}</h3>
                <p className="text-sm text-green-700">Size: {item.size} | Qty: <span className="font-bold text-lg">{item.qty}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Items Section */}
      {lowStockItems.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-400 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-900 mb-4">! Items with Low Quantity (Below {(statsData.avg_qty * 0.5).toFixed(0)})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lowStockItems.map((item) => (
              <div key={item.id} className="bg-white border-2 border-red-300 p-4 rounded-lg hover:shadow-lg transition">
                <h3 className="font-bold text-red-900 text-lg">{item.name}</h3>
                <p className="text-sm text-red-700">Size: {item.size} | Qty: <span className="font-bold text-lg">{item.qty}</span></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6 text-center">
        <p className="text-gray-600 text-sm">This is an automated inventory report. Please review and verify all data.</p>
        <p className="text-gray-500 text-xs mt-2">Report generated on {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedPage path="/dashboard">
      <div className="p-4 lg:p-7 bg-gray-50 min-h-screen overflow-y-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <InventoryReportContent_  />
        </Suspense>
      </div>
    </ProtectedPage>
  );
}
