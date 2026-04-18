"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BrandSizeQtyData {
  brand: string;
  size: string;
  qty: number;
}

export default function BrandTrendChart() {
  const [chartData, setChartData] = useState<BrandSizeQtyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandTrendData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/brand-trends");
        if (!response.ok) throw new Error("Failed to fetch brand trend data");
        
        const data = await response.json();
        setChartData(data.brandSizeQtyData || []);
      } catch (error) {
        console.error("Failed to fetch brand trend data:", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandTrendData();
  }, []);

  const colors = [
    "rgba(59, 130, 246, 0.7)",
    "rgba(34, 197, 94, 0.7)",
    "rgba(139, 92, 246, 0.7)",
    "rgba(236, 72, 153, 0.7)",
    "rgba(14, 165, 233, 0.7)",
    "rgba(251, 146, 60, 0.7)",
    "rgba(249, 115, 22, 0.7)",
    "rgba(168, 85, 247, 0.7)",
    "rgba(6, 182, 212, 0.7)",
    "rgba(244, 63, 94, 0.7)",
  ];

  const borderColors = [
    "rgb(59, 130, 246)",
    "rgb(34, 197, 94)",
    "rgb(139, 92, 246)",
    "rgb(236, 72, 153)",
    "rgb(14, 165, 233)",
    "rgb(251, 146, 60)",
    "rgb(249, 115, 22)",
    "rgb(168, 85, 247)",
    "rgb(6, 182, 212)",
    "rgb(244, 63, 94)",
  ];

  const options: any = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Trend by Brand, Size, Qty",
        font: { size: 14, weight: "bold" },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        callbacks: {
          title: (context: any) => {
            if (context.length > 0) {
              const item = chartData[context[0].dataIndex];
              return `${item.brand} | Size: ${item.size}`;
            }
            return "";
          },
          label: (context: any) => {
            return `Quantity: ${context.parsed.x} units`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value + " qty";
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="p-6 w-full h-full">
        <h2 className="text-lg font-semibold mb-2">Trend by Brand, Size & Qty</h2>
        <p className="text-sm text-gray-600 mb-4">Detailed inventory analysis with Brand, Size, and Quantity breakdown</p>
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="p-6 w-full h-full">
        <h2 className="text-lg font-semibold mb-4">Trend by Brand, Size & Qty</h2>
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const chartLabels = chartData.map((item) => `${item.brand} (Size: ${item.size})`);
  const chartQuantities = chartData.map((item) => item.qty);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Quantity in Stock (Qty)",
        data: chartQuantities,
        backgroundColor: chartQuantities.map((_, idx) => colors[idx % colors.length]),
        borderColor: chartQuantities.map((_, idx) => borderColors[idx % borderColors.length]),
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="p-6 w-full h-full">
      <div style={{ height: "450px" }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

