"use client";

import { resolveStockAlert, deleteStockAlert } from "@/app/lib/item/item-alerts";
import { AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";

interface StockAlert {
  id: string;
  item_id: string;
  item_name: string;
  message: string;
  created_at: string;
  is_resolved: boolean;
}

interface StockAlertsTableProps {
  alerts: StockAlert[];
}

export default function StockAlertsTable({ alerts }: StockAlertsTableProps) {
  const [alertList, setAlertList] = useState(alerts);
  const [isLoading, setIsLoading] = useState(false);

  const handleResolve = async (alertId: string) => {
    setIsLoading(true);
    const result = await resolveStockAlert(alertId);
    if (result.success) {
      setAlertList(alertList.filter((alert) => alert.id !== alertId));
    }
    setIsLoading(false);
  };

  const handleDelete = async (alertId: string) => {
    setIsLoading(true);
    const result = await deleteStockAlert(alertId);
    if (result.success) {
      setAlertList(alertList.filter((alert) => alert.id !== alertId));
    }
    setIsLoading(false);
  };

  if (alertList.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">No stock alerts at this time</p>
        <p className="text-gray-400 text-sm mt-1">All items are well stocked!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-red-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-red-900">Item Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-red-900">Alert Message</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-red-900">Alert Date</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-red-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {alertList.map((alert, index) => (
            <tr key={alert.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{alert.item_name}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{alert.message}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(alert.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleResolve(alert.id)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Mark as resolved (item restocked)"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-medium hidden sm:inline">Restocked</span>
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete this alert"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-xs font-medium hidden sm:inline">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
