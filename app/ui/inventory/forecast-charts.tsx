"use client";

import { ForecastItem } from "@/app/lib/item/forecast-data";
import { Line, Bar } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const colors = [
  "rgb(59, 130, 246)",
  "rgb(34, 197, 94)",
  "rgb(251, 146, 60)",
  "rgb(168, 85, 247)",
  "rgb(236, 72, 153)",
];

interface ForecastChartsProps {
  forecastItems: ForecastItem[];
}

export function Next12MonthsForecast({ forecastItems }: ForecastChartsProps) {
  // Get top 5 items for the line chart
  const topItems = forecastItems.slice(0, 5);

  const datasets = topItems.map((item, index) => ({
    label: `${item.brand} (Size ${item.size})`,
    data: item.predictedMonthly,
    borderColor: colors[index % colors.length],
    backgroundColor: colors[index % colors.length].replace("rgb", "rgba").replace(")", ", 0.1)"),
    borderWidth: 2,
    fill: false,
    tension: 0.4,
    pointRadius: 4,
    pointHoverRadius: 6,
  }));

  const chartData = {
    labels: months,
    datasets,
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🧑‍💼</span>
        <h3 className="text-2xl font-bold text-gray-900">
          Next 12 Months Sales Forecast
        </h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Predicted sales trends for your top items based on historical data
      </p>
      <div style={{ height: "350px" }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  usePointStyle: true,
                  padding: 15,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  font: { size: 12 },
                },
              },
              x: {
                ticks: {
                  font: { size: 12 },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export function NextYearSalesProjection({
  forecastItems,
}: ForecastChartsProps) {
  // Get top 5 items for the bar chart
  const topItems = forecastItems.slice(0, 5);

  const chartData = {
    labels: topItems.map((item) => `${item.brand} (Size ${item.size})`),
    datasets: [
      {
        label: "Predicted Sales (Next Year)",
        data: topItems.map((item) => item.totalNextYear),
        backgroundColor: colors.slice(0, topItems.length),
        borderColor: colors.slice(0, topItems.length),
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">📊</span>
        <h3 className="text-2xl font-bold text-gray-900">
          Next Year Sales Projection
        </h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Total predicted units to be sold in the next 12 months
      </p>
      <div style={{ height: "350px" }}>
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
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  font: { size: 12 },
                },
              },
              x: {
                ticks: {
                  font: { size: 12 },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  bgColor: string;
  icon: string;
}

export function MetricsCard({
  title,
  value,
  subtitle,
  bgColor,
  icon,
}: MetricsCardProps) {
  return (
    <div
      className={`${bgColor} p-6 rounded-lg shadow-md border-l-4 border-r-4 border-gray-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="font-semibold text-gray-700">{title}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
