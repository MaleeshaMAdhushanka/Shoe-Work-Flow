"use client";

import { Item } from "@/app/lib/types";
import { useState } from "react";
import { Download, Loader } from "lucide-react";
import { generateInventoryPDF } from "@/app/lib/item/generate-pdf";

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
          Download PDF Report
        </>
      )}
    </button>
  );
}

// Separate component for the content that will be captured
interface InventoryReportContentProps {
  items: Item[];
  stats: {
    total_items: number;
    total_qty: number;
    avg_qty: number;
  };
}

export function InventoryReportContent({ items, stats }: InventoryReportContentProps) {
  const avgQty = Number(stats.avg_qty) || 0;
  const highQtyThreshold = avgQty * 1.5;
  
  // Use a fixed date to avoid hydration mismatch
  const reportDate = new Date().toLocaleDateString();
  const reportDateTime = new Date().toLocaleString();

  // Group items by size for chart
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

  const sizeEntries = Object.entries(sizeGroups);
  const maxQty = Math.max(...sizeEntries.map(([, qty]) => qty), 1);

  // Calculate stock distribution
  const stockCounts = {
    high: items.filter((item) => item.qty > avgQty * 1.5).length,
    medium: items.filter((item) => item.qty >= avgQty * 0.5 && item.qty <= avgQty * 1.5).length,
    low: items.filter((item) => item.qty < avgQty * 0.5).length,
  };

  return (
    <div
      id="inventory-report-content"
      style={{
        backgroundColor: "#ffffff",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        color: "#1f2937",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "32px", borderBottom: "2px solid #d1d5db", paddingBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
          Inventory Report
        </h1>
        <p style={{ color: "#4b5563" }}>Generated on {reportDate}</p>
      </div>

      {/* Statistics Section */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "16px" }}>
          📊 Summary Statistics
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ backgroundColor: "#eff6ff", padding: "16px", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#1e40af", fontWeight: "500" }}>Total Items</p>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#1e3a8a", marginTop: "8px" }}>
              {stats.total_items}
            </p>
          </div>
          <div style={{ backgroundColor: "#f0fdf4", padding: "16px", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#166534", fontWeight: "500" }}>Total Quantity</p>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#15803d", marginTop: "8px" }}>
              {stats.total_qty}
            </p>
          </div>
          <div style={{ backgroundColor: "#faf5ff", padding: "16px", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#7e22ce", fontWeight: "500" }}>Average Qty</p>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#6b21a8", marginTop: "8px" }}>
              {avgQty.toFixed(0)}
            </p>
          </div>
          <div style={{ backgroundColor: "#fffbeb", padding: "16px", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#a16207", fontWeight: "500" }}>High Qty Threshold</p>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#b45309", marginTop: "8px" }}>
              {highQtyThreshold.toFixed(0)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ marginBottom: "32px", pageBreakInside: "avoid" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "4px" }}>
          📈 Inventory by Shoe Size
        </h2>
        <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "16px" }}>
          Bar chart showing total quantity of shoes available in each size
        </p>
        <div style={{ 
          display: "flex", 
          gap: "16px", 
          alignItems: "flex-end", 
          paddingBottom: "24px", 
          paddingTop: "16px",
          paddingLeft: "16px",
          paddingRight: "16px",
          borderBottom: "2px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          minHeight: "220px"
        }}>
          {sizeEntries.length > 0 ? (
            sizeEntries.map(([size, qty]) => {
              const height = (qty / maxQty) * 160;
              const percentage = ((qty / stats.total_qty) * 100).toFixed(1);
              return (
                <div key={size} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                  {/* Bar */}
                  <div
                    style={{
                      width: "100%",
                      height: `${height}px`,
                      backgroundColor: "#2563eb",
                      borderRadius: "6px 6px 0 0",
                      marginBottom: "8px",
                      boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                      position: "relative",
                      transition: "all 0.3s ease",
                    }}
                  />
                  {/* Quantity Label on Bar */}
                  <div style={{
                    position: "absolute",
                    top: `${Math.max(height - 24, 8)}px`,
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: height > maxQty * 0.4 ? "#ffffff" : "#1f2937",
                    textShadow: height > maxQty * 0.4 ? "none" : "0 1px 2px rgba(0,0,0,0.1)"
                  }}>
                    {qty}
                  </div>
                  {/* Size Label */}
                  <p style={{ 
                    fontSize: "13px", 
                    fontWeight: "700", 
                    color: "#1f2937",
                    margin: "0",
                    marginBottom: "4px"
                  }}>
                    Size {size}
                  </p>
                  {/* Percentage */}
                  <p style={{ 
                    fontSize: "11px", 
                    color: "#6b7280", 
                    margin: "0"
                  }}>
                    {percentage}%
                  </p>
                </div>
              );
            })
          ) : (
            <p style={{ color: "#6b7280", textAlign: "center", width: "100%" }}>No inventory data available</p>
          )}
        </div>
        
        {/* Chart Legend */}
        <div style={{ marginTop: "12px", display: "flex", gap: "24px", fontSize: "12px", color: "#6b7280" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", backgroundColor: "#2563eb", borderRadius: "2px" }} />
            <span>Quantity in units</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>📊 Percentage of total inventory</span>
          </div>
        </div>
      </div>

      {/* Stock Status Distribution */}
      <div style={{ marginBottom: "32px", pageBreakInside: "avoid" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "16px" }}>
          📊 Stock Status Distribution
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div style={{ backgroundColor: "#dcfce7", padding: "16px", borderRadius: "8px", border: "2px solid #86efac" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#15803d" }}>🟢 High Stock</p>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#15803d", marginTop: "8px" }}>
              {stockCounts.high}
            </p>
            <p style={{ fontSize: "12px", color: "#65a30d", marginTop: "4px" }}>
              {((stockCounts.high / items.length) * 100).toFixed(0)}% of items
            </p>
          </div>
          <div style={{ backgroundColor: "#fef3c7", padding: "16px", borderRadius: "8px", border: "2px solid #fcd34d" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#92400e" }}>🟡 Medium Stock</p>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#92400e", marginTop: "8px" }}>
              {stockCounts.medium}
            </p>
            <p style={{ fontSize: "12px", color: "#b45309", marginTop: "4px" }}>
              {((stockCounts.medium / items.length) * 100).toFixed(0)}% of items
            </p>
          </div>
          <div style={{ backgroundColor: "#fee2e2", padding: "16px", borderRadius: "8px", border: "2px solid #fecaca" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#dc2626" }}>🔴 Low Stock</p>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#dc2626", marginTop: "8px" }}>
              {stockCounts.low}
            </p>
            <p style={{ fontSize: "12px", color: "#991b1b", marginTop: "4px" }}>
              {((stockCounts.low / items.length) * 100).toFixed(0)}% of items
            </p>
          </div>
        </div>
      </div>

      {/* Inventory Details Table */}
      <div style={{ marginBottom: "32px", pageBreakInside: "avoid" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "16px" }}>
          📋 Inventory Details
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #d1d5db",
            fontSize: "13px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6", border: "2px solid #d1d5db" }}>
              <th style={{ border: "1px solid #d1d5db", padding: "10px", textAlign: "left", fontWeight: "600" }}>
                Shoe Name
              </th>
              <th style={{ border: "1px solid #d1d5db", padding: "10px", textAlign: "center", fontWeight: "600" }}>
                Size
              </th>
              <th style={{ border: "1px solid #d1d5db", padding: "10px", textAlign: "center", fontWeight: "600" }}>
                Qty
              </th>
              <th style={{ border: "1px solid #d1d5db", padding: "10px", textAlign: "center", fontWeight: "600" }}>
                High Qty
              </th>
              <th style={{ border: "1px solid #d1d5db", padding: "10px", textAlign: "center", fontWeight: "600" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isHighQty = item.qty > highQtyThreshold;
              const isLowQty = item.qty < avgQty * 0.5;
              const bgColor = isHighQty ? "#dcfce7" : isLowQty ? "#fee2e2" : "#ffffff";

              return (
                <tr key={item.id} style={{ backgroundColor: bgColor, border: "1px solid #d1d5db" }}>
                  <td style={{ border: "1px solid #d1d5db", padding: "10px", fontWeight: "500" }}>{item.name}</td>
                  <td style={{ border: "1px solid #d1d5db", padding: "10px", textAlign: "center" }}>{item.size}</td>
                  <td style={{ border: "1px solid #d1d5db", padding: "10px", textAlign: "center", fontWeight: "bold" }}>
                    {item.qty}
                  </td>
                  <td style={{ border: "1px solid #d1d5db", padding: "10px", textAlign: "center" }}>
                    <span style={{ color: isHighQty ? "#15803d" : "#9ca3af", fontWeight: "bold" }}>
                      {highQtyThreshold.toFixed(0)}
                    </span>
                  </td>
                  <td style={{ border: "1px solid #d1d5db", padding: "10px", textAlign: "center" }}>
                    {isHighQty ? (
                      <span
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#bbf7d0",
                          color: "#065f46",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        ✓ High
                      </span>
                    ) : isLowQty ? (
                      <span
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#fecaca",
                          color: "#7f1d1d",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        ! Low
                      </span>
                    ) : (
                      <span
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#fef3c7",
                          color: "#92400e",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        → Med
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* High Qty Highlighted Items */}
      <div style={{ marginBottom: "32px", pageBreakInside: "avoid" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#15803d", marginBottom: "12px" }}>
          ✓ Items with High Quantity (Above {highQtyThreshold.toFixed(0)})
        </h2>
        <div style={{ backgroundColor: "#f0fdf4", border: "2px solid #86efac", padding: "16px", borderRadius: "8px" }}>
          {items.filter((item) => item.qty > highQtyThreshold).length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {items
                .filter((item) => item.qty > highQtyThreshold)
                .map((item) => (
                  <div key={item.id} style={{ backgroundColor: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid #86efac" }}>
                    <p style={{ fontSize: "13px", fontWeight: "600", color: "#15803d", margin: "0 0 4px 0" }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "#4b7c59", margin: "0" }}>
                      Size: <strong>{item.size}</strong> | Qty: <strong style={{ color: "#15803d", fontSize: "14px" }}>{item.qty}</strong>
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p style={{ color: "#4b7c59" }}>No items with high quantity</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "1px solid #d1d5db",
          textAlign: "center",
          fontSize: "12px",
          color: "#6b7280",
        }}
      >
        <p>This is an automated inventory report. Please review and verify all data.</p>
        <p style={{ marginTop: "8px", fontSize: "11px", color: "#9ca3af" }}>
          Report generated on {reportDateTime}
        </p>
      </div>
    </div>
  );
}
