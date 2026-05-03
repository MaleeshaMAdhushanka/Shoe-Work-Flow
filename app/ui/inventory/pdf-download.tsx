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
      console.log("Received HTML content, length:", htmlContent.length);

      // Import libraries
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Create a temporary iframe to render the content
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.top = "-10000px";
      iframe.style.left = "-10000px";
      iframe.style.width = "210mm";
      iframe.style.height = "100vh";
      iframe.style.border = "none";
      iframe.style.padding = "0";
      iframe.style.margin = "0";
      document.body.appendChild(iframe);

      // Write content to iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error("Failed to access iframe document");

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Wait for iframe to fully load
      await new Promise((resolve) => {
        const checkReady = () => {
          if (iframeDoc.readyState === "complete") {
            resolve(true);
          } else {
            setTimeout(checkReady, 100);
          }
        };
        setTimeout(checkReady, 500);
      });

      // Get the body element from iframe
      const iframeBody = iframeDoc.body;
      if (!iframeBody) throw new Error("Failed to get iframe body");

      console.log("Iframe body height:", iframeBody.scrollHeight);

      // Convert iframe content to canvas
      const canvas = await html2canvas(iframeBody, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        width: iframeBody.scrollWidth,
        height: iframeBody.scrollHeight,
        windowWidth: 210 * 96 / 25.4, // Convert mm to pixels
        windowHeight: iframeBody.scrollHeight,
      });

      console.log("Canvas created - width:", canvas.width, "height:", canvas.height);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // mm

      // Calculate dimensions
      const contentWidth = pageWidth - 2 * margin;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const scaledHeight = (contentWidth * canvasHeight) / canvasWidth;
      
      // Split into pages
      let position = 0;
      let pageNumber = 1;

      while (position < canvasHeight) {
        const canvasSegment = document.createElement("canvas");
        const segmentHeight = Math.min(pageHeight * (canvasWidth / contentWidth), canvasHeight - position);
        
        canvasSegment.width = canvasWidth;
        canvasSegment.height = segmentHeight;

        const ctx = canvasSegment.getContext("2d");
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, position,
            canvasWidth, segmentHeight,
            0, 0,
            canvasWidth, segmentHeight
          );

          const imgData = canvasSegment.toDataURL("image/jpeg", 0.95);
          pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, 
            (contentWidth * segmentHeight) / canvasWidth);

          position += segmentHeight;

          if (position < canvasHeight) {
            pdf.addPage();
          }
        }
      }

      // Save PDF
      const fileName = `inventory-report-${new Date().toLocaleDateString()}.pdf`;
      pdf.save(fileName);
      console.log("PDF saved successfully:", fileName);

      // Cleanup
      document.body.removeChild(iframe);
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
