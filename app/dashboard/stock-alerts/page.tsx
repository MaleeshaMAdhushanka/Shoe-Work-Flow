import { getStockAlerts } from "@/app/lib/item/item-alerts";
import StockAlertsTable from "@/app/ui/item/stock-alerts-table";
import { AlertTriangle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock Alerts",
  description: "Manage out-of-stock items",
};

export default async function StockAlertsPage() {
  const alerts = await getStockAlerts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Alerts</h1>
          <p className="text-gray-600 mt-2">Manage out-of-stock items and restock notifications</p>
        </div>
        <div className="bg-red-100 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <p className="text-sm text-red-600 font-medium">Active Alerts</p>
              <p className="text-2xl font-bold text-red-700">{alerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <StockAlertsTable alerts={alerts} />
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How Stock Alerts Work</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ An alert is automatically created when an item quantity reaches 0</li>
          <li>✓ Click "Restocked" once you've added new inventory to the item</li>
          <li>✓ Click "Delete" to remove an alert without marking it as restocked</li>
          <li>✓ Only unresolved alerts are shown here</li>
        </ul>
      </div>
    </div>
  );
}
