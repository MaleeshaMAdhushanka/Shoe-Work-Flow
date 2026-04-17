"use client";

import { useState } from "react";
import { Download, Loader } from "lucide-react";

interface SalesReportData {
  orders: Array<{
    order_id: string;
    order_date: string;
    customer_name: string;
    total_amount: number;
    item_count: number;
  }>;
  customers: Array<{
    customer_name: string;
    total_orders: number;
    total_spent: number;
  }>;
  stats: {
    total_orders: number;
    total_revenue: number;
    avg_order_value: number;
    active_customers: number;
  };
  topCustomers: Array<{
    customer_name: string;
    order_count: number;
    total_spent: number;
  }>;
}

interface PDFDownloadButtonProps {
  data: SalesReportData;
}

export function SalesPDFDownloadButton({ data }: PDFDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      // Fetch HTML from server
      const response = await fetch("/api/sales/download-pdf", {
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

      // Use html2pdf to convert HTML to PDF
      const element = document.createElement("div");
      element.innerHTML = htmlContent;

      // Dynamic import of html2pdf
      const html2pdf = (await import("html2pdf.js")).default;

      const options = {
        margin: 10,
        filename: `sales-report-${new Date().toLocaleDateString()}.pdf`,
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
