"use client";

import { useState } from "react";
import { Download, Loader } from "lucide-react";

interface AdminReportData {
  stats: {
    total_revenue: number;
    total_orders: number;
    total_customers: number;
  };
  userCounts: {
    total_users: number;
    active_users: number;
    admin_count: number;
    manager_count: number;
    sales_count: number;
    inventory_count: number;
  };
  revenueByDate: Array<{
    date: string;
    amount: number;
  }>;
  transactions: Array<{
    order_id: string;
    customer_name: string;
    total_amount: number;
    order_date: string;
  }>;
}

interface AdminPDFDownloadButtonProps {
  data: AdminReportData;
}

export function AdminPDFDownloadButton({ data }: AdminPDFDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/download-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: Failed to generate PDF`;
        throw new Error(errorMessage);
      }

      const htmlContent = await response.text();

      const element = document.createElement("div");
      element.innerHTML = htmlContent;

      const html2pdf = (await import("html2pdf.js")).default;

      const options = {
        margin: 10,
        filename: `admin-report-${new Date().toLocaleDateString()}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" as const, unit: "mm" as const, format: "a4" as const },
      };

      html2pdf().set(options).from(element).save();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Error downloading PDF:", error);
      alert(`Failed to download PDF: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
    >
      {isLoading ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download Report
        </>
      )}
    </button>
  );
}
