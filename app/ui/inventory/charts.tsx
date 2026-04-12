"use client";

import { Item } from "@/app/lib/types";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface InventoryChartProps {
  items: Item[];
}

export function InventoryBarChart({ items }: InventoryChartProps) {
  // Group items by size and calculate total quantity
  const sizeGroups = items.reduce(
    (acc, item) => {
      if (!acc[item.size]) {
        acc[item.size] = 0;
      }
      acc[item.size] += item.qty;
      return acc;
    },
    {} as Record<string, number>
  );

  const chartData = {
    labels: Object.keys(sizeGroups),
    datasets: [
      {
        label: "Quantity by Size",
        data: Object.values(sizeGroups),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(6, 182, 212, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(234, 179, 8, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(34, 197, 94)",
          "rgb(251, 146, 60)",
          "rgb(168, 85, 247)",
          "rgb(236, 72, 153)",
          "rgb(6, 182, 212)",
          "rgb(14, 165, 233)",
          "rgb(234, 179, 8)",
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
      <h3 className="text-2xl font-bold mb-2 text-gray-900 flex items-center gap-2">📉 Inventory by Shoe Size</h3>
      <p className="text-gray-600 text-sm mb-4">Bar chart showing total quantity of shoes available in each size</p>
      <div style={{ maxHeight: "400px" }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              title: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

interface StockStatusItem extends Item {
  stockStatus: "high" | "medium" | "low";
}

export function InventoryPieChart({ items }: InventoryChartProps) {
  const avgQty = items.length > 0 ? items.reduce((sum, item) => sum + item.qty, 0) / items.length : 0;

  const stockCounts = {
    high: items.filter((item) => item.qty > avgQty * 1.5).length,
    medium: items.filter((item) => item.qty >= avgQty * 0.5 && item.qty <= avgQty * 1.5).length,
    low: items.filter((item) => item.qty < avgQty * 0.5).length,
  };

  const chartData = {
    labels: ["High Stock", "Medium Stock", "Low Stock"],
    datasets: [
      {
        label: "Stock Status Distribution",
        data: [stockCounts.high, stockCounts.medium, stockCounts.low],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(251, 146, 60, 0.8)", "rgba(239, 68, 68, 0.8)"],
        borderColor: ["rgb(34, 197, 94)", "rgb(251, 146, 60)", "rgb(239, 68, 68)"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
      <h3 className="text-2xl font-bold mb-2 text-gray-900 flex items-center gap-2"> Stock Status Distribution</h3>
      <p className="text-gray-600 text-sm mb-4">Pie chart showing distribution of inventory stock levels</p>
      <div style={{ maxHeight: "350px" }}>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "bottom",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

interface InventoryTableProps {
  items: Item[];
  highlightThreshold?: number;
}

export function InventoryDetailTable({ items, highlightThreshold }: InventoryTableProps) {
  const avgQty = items.length > 0 ? items.reduce((sum, item) => sum + item.qty, 0) / items.length : 0;
  const threshold = highlightThreshold || avgQty * 1.5;

  const getRowColor = (qty: number) => {
    if (qty > threshold) {
      return "bg-green-100 hover:bg-green-200";
    } else if (qty >= avgQty * 0.5) {
      return "bg-yellow-100 hover:bg-yellow-200";
    } else {
      return "bg-red-100 hover:bg-red-200";
    }
  };

  const getStockBadge = (qty: number) => {
    if (qty > threshold) {
      return <span className="px-3 py-1 bg-green-300 text-green-900 rounded-full text-sm font-bold">✓ High</span>;
    } else if (qty >= avgQty * 0.5) {
      return <span className="px-3 py-1 bg-yellow-300 text-yellow-900 rounded-full text-sm font-bold">→ Med</span>;
    } else {
      return <span className="px-3 py-1 bg-red-300 text-red-900 rounded-full text-sm font-bold">! Low</span>;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-gray-400">
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Shoe Name</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Size</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Qty</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">High Qty</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-gray-300 transition-colors ${getRowColor(item.qty)}`}
              >
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{item.name}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">{item.size}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-900 font-bold">{item.qty}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  <span className={item.qty > threshold ? "font-bold text-green-700" : "text-gray-500"}>
                    {threshold.toFixed(0)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm">{getStockBadge(item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: "blue" | "green" | "red" | "purple" | "orange";
}

export function StatCard({ label, value, icon, color = "blue" }: StatCardProps) {
  const colorConfig = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-400",
      label: "text-blue-700",
      value: "text-blue-800",
      textLight: "text-blue-600",
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      border: "border-green-400",
      label: "text-green-700",
      value: "text-green-800",
      textLight: "text-green-600",
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      border: "border-red-400",
      label: "text-red-700",
      value: "text-red-800",
      textLight: "text-red-600",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      border: "border-purple-400",
      label: "text-purple-700",
      value: "text-purple-800",
      textLight: "text-purple-600",
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
      border: "border-orange-400",
      label: "text-orange-700",
      value: "text-orange-800",
      textLight: "text-orange-600",
    },
  };

  const config = colorConfig[color];

  return (
    <div className={`${config.bg} ${config.border} border-2 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${config.label}`}>{label}</p>
          <p className={`text-4xl font-bold mt-2 ${config.value}`}>{value}</p>
        </div>
        {icon && <div className="text-5xl opacity-40">{icon}</div>}
      </div>
    </div>
  );
}
