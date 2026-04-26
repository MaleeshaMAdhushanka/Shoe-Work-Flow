"use client";

import { Item } from "@/app/lib/types";
import { useState } from "react";
import { Download, Loader } from "lucide-react";

interface PDFDownloadButtonProps {
  items: Item[];
  stats: {
    total_items: number;
    total_qty: number;
    avg_qty: number;
  };
}

export function PDFDownloadButton({ items, stats }: PDFDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      // Fetch HTML from server
      const response = await fetch("/api/inventory/download-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          stats,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to generate PDF`);
      }

      const htmlContent = await response.text();

      // Use html2pdf to convert HTML to PDF
      const element = document.createElement("div");
      element.innerHTML = htmlContent;
      
      // Dynamic import of html2pdf
      const html2pdf = (await import("html2pdf.js")).default;
      
      const options = {
        margin: 10,
        filename: `inventory-report-${new Date().toLocaleDateString()}.pdf`,
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
          Download  Report
        </>
      )}
    </button>
  );
}
