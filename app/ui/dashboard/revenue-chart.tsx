"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RevenueChart() {
  const [chartData, setChartData] = useState({ months: [], revenue: [] });

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch("/api/dashboard/revenue");
        const data = await response.json();
        setChartData({
          months: data.months,
          revenue: data.revenue,
        });
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Revenue",
      },
    },
  };

  const data = {
    labels: chartData.months,
    datasets: [
      {
        label: "Revenue (Rs)",
        data: chartData.revenue,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Revenue Over Time</h2>
      <div className="h-72">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
