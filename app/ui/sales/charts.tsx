"use client";

import { FC } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
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

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  icon: string;
}

interface TopCustomer {
  customer_name: string;
  order_count: number;
  total_spent: number;
}

interface OrderTrend {
  order_date: string;
  order_count: number;
  daily_revenue: number;
}

interface OrderSummary {
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  active_customers: number;
}

export const StatCard: FC<StatCardProps> = ({ label, value, color, icon }) => {
  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    green: "#10b981",
    purple: "#a855f7",
    orange: "#f97316",
    red: "#ef4444",
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export const TopCustomersChart: FC<{ data: TopCustomer[] }> = ({ data }) => {
  const chartData = {
    labels: data.slice(0, 8).map((c) => c.customer_name.substring(0, 15)),
    datasets: [
      {
        label: "Orders",
        data: data.slice(0, 8).map((c) => c.order_count),
        backgroundColor: "#3b82f6",
        borderColor: "#1e40af",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Orders</h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        }}
      />
    </div>
  );
};

export const RevenueDistributionChart: FC<{ data: TopCustomer[] }> = ({ data }) => {
  const topData = data.slice(0, 6);
  const other = data.slice(6).reduce((sum, c) => sum + c.total_spent, 0);

  const chartData = {
    labels: [
      ...topData.map((c) => c.customer_name.substring(0, 12)),
      ...(other > 0 ? ["Others"] : []),
    ],
    datasets: [
      {
        data: [
          ...topData.map((c) => c.total_spent),
          ...(other > 0 ? [other] : []),
        ],
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#06b6d4",
          "#ec4899",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Customer</h3>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "bottom" as const,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export const OrderTrendChart: FC<{ data: OrderTrend[] }> = ({ data }) => {
  const sortedData = [...data].sort((a, b) =>
    new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
  );

  const chartData = {
    labels: sortedData.map((d) =>
      new Date(d.order_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Orders",
        data: sortedData.map((d) => d.order_count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y",
      },
      {
        label: "Revenue (₨)",
        data: sortedData.map((d) => Math.round(Number(d.daily_revenue) / 1000)),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Orders & Revenue Trend (Last 30 Days)
      </h3>
      <Line
        data={chartData}
        options={{
          responsive: true,
          interaction: {
            mode: "index" as const,
            intersect: false,
          },
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            y: {
              type: "linear" as const,
              display: true,
              position: "left" as const,
              title: {
                display: true,
                text: "Order Count",
              },
            },
            y1: {
              type: "linear" as const,
              display: true,
              position: "right" as const,
              title: {
                display: true,
                text: "Revenue (₨ in thousands)",
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        }}
      />
    </div>
  );
};

export const OrdersTable: FC<{
  orders: Array<{
    order_id: string;
    order_date: string;
    customer_name: string;
    total_amount: number;
    item_count: number;
  }>;
}> = ({ orders }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Order ID</th>
            <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Customer</th>
            <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Date</th>
            <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Items</th>
            <th className="text-right py-2 px-4 text-sm font-semibold text-gray-600">Amount (₨)</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 10).map((order) => (
            <tr key={order.order_id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm text-gray-900 font-mono">
                {order.order_id.substring(0, 8)}...
              </td>
              <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                {order.customer_name}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {new Date(order.order_date).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                  {order.item_count}
                </span>
              </td>
              <td className="py-3 px-4 text-right text-sm font-bold text-green-700">
                ₨{Number(order.total_amount).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const HighValueOrdersAlert: FC<{
  orders: Array<{
    order_id: string;
    customer_name: string;
    total_amount: number;
  }>;
  threshold: number;
}> = ({ orders, threshold }) => {
  const highValueOrders = orders.filter((o) => Number(o.total_amount) > threshold);

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
      <h2 className="text-lg font-semibold text-blue-900 mb-3">💰 High Value Orders</h2>
      {highValueOrders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highValueOrders.slice(0, 6).map((order) => (
            <div
              key={order.order_id}
              className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900">{order.customer_name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Order: {order.order_id.substring(0, 8)}...
              </p>
              <p className="text-lg font-bold text-blue-700 mt-2">
                ₨{Number(order.total_amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-blue-800">No high-value orders in this period</p>
      )}
    </div>
  );
};
