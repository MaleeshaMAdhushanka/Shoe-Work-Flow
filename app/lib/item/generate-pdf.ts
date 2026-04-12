"use server";

import { Item } from "@/app/lib/types";

export async function generateInventoryPDF(
  items: Item[],
  stats: {
    total_items: number;
    total_qty: number;
    avg_qty: number;
  }
) {
  try {
    const avgQty = Number(stats.avg_qty) || 0;
    const highQtyThreshold = avgQty * 1.5;

    // Generate HTML content
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

    const reportDate = new Date().toLocaleDateString();
    const reportDateTime = new Date().toLocaleString();

    // Build chart HTML
    let chartHTML = "";
    sizeEntries.forEach(([size, qty]) => {
      const height = (qty / maxQty) * 160;
      const percentage = ((qty / stats.total_qty) * 100).toFixed(1);
      chartHTML += `
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;">
          <div style="width: 100%; height: ${height}px; background-color: #2563eb; border-radius: 6px 6px 0 0; margin-bottom: 8px; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);">
            <div style="position: absolute; top: ${Math.max(height - 24, 8)}px; font-size: 11px; font-weight: bold; color: ${height > maxQty * 0.4 ? "#ffffff" : "#1f2937"};">
              ${qty}
            </div>
          </div>
          <p style="font-size: 13px; font-weight: 700; color: #1f2937; margin: 0; margin-bottom: 4px;">Size ${size}</p>
          <p style="font-size: 11px; color: #6b7280; margin: 0;">${percentage}%</p>
        </div>
      `;
    });

    // Build inventory table
    let tableHTML = "";
    items.forEach((item) => {
      const isHighQty = item.qty > highQtyThreshold;
      const isLowQty = item.qty < avgQty * 0.5;
      const bgColor = isHighQty ? "#dcfce7" : isLowQty ? "#fee2e2" : "#ffffff";
      const statusBg = isHighQty ? "#bbf7d0" : isLowQty ? "#fecaca" : "#fef3c7";
      const statusColor = isHighQty ? "#065f46" : isLowQty ? "#7f1d1d" : "#92400e";
      const statusText = isHighQty ? "✓ High" : isLowQty ? "! Low" : "→ Med";

      tableHTML += `
        <tr style="background-color: ${bgColor}; border: 1px solid #d1d5db;">
          <td style="border: 1px solid #d1d5db; padding: 10px; font-weight: 500;">${item.name}</td>
          <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">${item.size}</td>
          <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center; font-weight: bold;">${item.qty}</td>
          <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">
            <span style="color: ${isHighQty ? "#15803d" : "#9ca3af"}; font-weight: bold;">${highQtyThreshold.toFixed(0)}</span>
          </td>
          <td style="border: 1px solid #d1d5db; padding: 10px; text-align: center;">
            <span style="padding: 4px 8px; background-color: ${statusBg}; color: ${statusColor}; border-radius: 4px; font-size: 11px; font-weight: 600;">
              ${statusText}
            </span>
          </td>
        </tr>
      `;
    });

    // Build high qty items
    let highQtyHTML = "";
    const highQtyItems = items.filter((item) => item.qty > highQtyThreshold);
    highQtyItems.forEach((item) => {
      highQtyHTML += `
        <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #86efac;">
          <p style="font-size: 13px; font-weight: 600; color: #15803d; margin: 0 0 4px 0;">${item.name}</p>
          <p style="font-size: 12px; color: #4b7c59; margin: 0;">
            Size: <strong>${item.size}</strong> | Qty: <strong style="color: #15803d; font-size: 14px;">${item.qty}</strong>
          </p>
        </div>
      `;
    });

    // Calculate stock counts
    const stockCounts = {
      high: items.filter((item) => item.qty > avgQty * 1.5).length,
      medium: items.filter((item) => item.qty >= avgQty * 0.5 && item.qty <= avgQty * 1.5).length,
      low: items.filter((item) => item.qty < avgQty * 0.5).length,
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Inventory Report</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 24px; color: #1f2937; background: #f3f4f6; }
          .page-break { page-break-after: always; }
          .stat-card { border-radius: 12px; padding: 20px; font-weight: 600; border: 3px solid; display: flex; flex-direction: column; }
          .stat-label { font-size: 13px; font-weight: 500; margin: 0 0 8px 0; }
          .stat-value { font-size: 32px; font-weight: 800; margin: 0; }
          .blue { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-color: #3b82f6; color: #1e40af; }
          .green { background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-color: #22c55e; color: #15803d; }
          .purple { background: linear-gradient(135deg, #f3e8ff 0%, #ddd6fe 100%); border-color: #a855f7; color: #7e22ce; }
          .orange { background: linear-gradient(135deg, #fed7aa 0%, #fcd34d 100%); border-color: #f59e0b; color: #92400e; }
          .red { background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-color: #ef4444; color: #dc2626; }
          .yellow { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-color: #eab308; color: #92400e; }
        </style>
      </head>
      <body>
        <!-- Header with Colored Background -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 32px; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);">
          <h1 style="font-size: 36px; font-weight: 900; margin: 0 0 8px 0;"> Inventory Report</h1>
          <p style="font-size: 14px; margin: 0; opacity: 0.95;">Generated on ${reportDate}</p>
        </div>

        <!-- Statistics with Colored Cards -->
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 22px; font-weight: 800; color: #1f2937; margin: 0 0 16px 0;">📋 Summary Statistics</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 14px;">
            <div class="stat-card blue">
              <p class="stat-label">Total Items</p>
              <p class="stat-value">${stats.total_items}</p>
            </div>
            <div class="stat-card green">
              <p class="stat-label">Total Quantity</p>
              <p class="stat-value">${stats.total_qty}</p>
            </div>
            <div class="stat-card purple">
              <p class="stat-label">Average Qty/Item</p>
              <p class="stat-value">${avgQty.toFixed(0)}</p>
            </div>
            <div class="stat-card orange">
              <p class="stat-label">High Qty Threshold</p>
              <p class="stat-value">${highQtyThreshold.toFixed(0)}</p>
            </div>
          </div>
        </div>

        <!-- Chart with Vibrant Colors -->
        <div style="margin-bottom: 32px; page-break-inside: avoid; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="font-size: 20px; font-weight: 800; color: #1f2937; margin: 0 0 6px 0;">📉 Inventory by Shoe Size</h2>
          <p style="font-size: 12px; color: #6b7280; margin: 0 0 16px 0;">Bar chart showing total quantity of shoes available in each size</p>
          <div style="display: flex; gap: 12px; align-items: flex-end; padding: 24px 16px; border-bottom: 3px solid #e5e7eb; background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-radius: 8px; min-height: 240px;">
            ${chartHTML}
          </div>
        </div>

        <!-- Stock Status Distribution Cards -->
        <div style="margin-bottom: 32px; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="font-size: 20px; font-weight: 800; color: #1f2937; margin: 0 0 16px 0;">📊 Stock Status Distribution</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;">
            <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 20px; border-radius: 12px; border: 3px solid #22c55e; text-align: center;">
              <p style="font-size: 14px; font-weight: 700; color: #15803d; margin: 0;">🟢 High Stock</p>
              <p style="font-size: 40px; font-weight: 900; color: #15803d; margin: 8px 0 0 0;">${stockCounts.high}</p>
              <p style="font-size: 13px; color: #4b7c59; margin: 4px 0 0 0;"><strong>${((stockCounts.high / items.length) * 100).toFixed(0)}% of items</strong></p>
            </div>
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; border: 3px solid #eab308; text-align: center;">
              <p style="font-size: 14px; font-weight: 700; color: #92400e; margin: 0;">🟡 Medium Stock</p>
              <p style="font-size: 40px; font-weight: 900; color: #92400e; margin: 8px 0 0 0;">${stockCounts.medium}</p>
              <p style="font-size: 13px; color: #a16207; margin: 4px 0 0 0;"><strong>${((stockCounts.medium / items.length) * 100).toFixed(0)}% of items</strong></p>
            </div>
            <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); padding: 20px; border-radius: 12px; border: 3px solid #ef4444; text-align: center;">
              <p style="font-size: 14px; font-weight: 700; color: #dc2626; margin: 0;">🔴 Low Stock</p>
              <p style="font-size: 40px; font-weight: 900; color: #dc2626; margin: 8px 0 0 0;">${stockCounts.low}</p>
              <p style="font-size: 13px; color: #991b1b; margin: 4px 0 0 0;"><strong>${((stockCounts.low / items.length) * 100).toFixed(0)}% of items</strong></p>
            </div>
          </div>
        </div>

        <!-- Inventory Table with Colorful Design -->
        <div style="margin-bottom: 32px; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); page-break-inside: avoid;">
          <h2 style="font-size: 20px; font-weight: 800; color: #1f2937; margin: 0 0 16px 0;">📋 Inventory Details</h2>
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #d1d5db; font-size: 13px; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: linear-gradient(135deg, #374151 0%, #1f2937 100%); border: 2px solid #1f2937; color: white;">
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; font-weight: 700;">Shoe Name</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center; font-weight: 700;">Size</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center; font-weight: 700;">Qty</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center; font-weight: 700;">High Qty</th>
                <th style="border: 1px solid #d1d5db; padding: 12px; text-align: center; font-weight: 700;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableHTML}
            </tbody>
          </table>
        </div>

        <!-- High Qty Items with Colorful Design -->
        ${highQtyItems.length > 0 ? `
        <div style="margin-bottom: 32px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 3px solid #22c55e; padding: 24px; border-radius: 12px;">
          <h2 style="font-size: 18px; font-weight: 800; color: #15803d; margin: 0 0 14px 0;">✓ Items with High Quantity (Above ${highQtyThreshold.toFixed(0)})</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            ${highQtyHTML}
          </div>
        </div>
        ` : ''}

        <!-- Low Qty Items if Any -->
        ${items.filter((item) => item.qty < avgQty * 0.5).length > 0 ? `
        <div style="margin-bottom: 32px; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border: 3px solid #ef4444; padding: 24px; border-radius: 12px;">
          <h2 style="font-size: 18px; font-weight: 800; color: #dc2626; margin: 0 0 14px 0;">! Items with Low Quantity (Below ${(avgQty * 0.5).toFixed(0)})</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            ${items.filter((item) => item.qty < avgQty * 0.5).map((item) => `
              <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; border: 2px solid #fecaca;">
                <p style="font-size: 13px; font-weight: 600; color: #991b1b; margin: 0 0 4px 0;"><strong>${item.name}</strong></p>
                <p style="font-size: 12px; color: #7f1d1d; margin: 0;">
                  Size: <strong>${item.size}</strong> | Qty: <strong style="font-size: 14px; color: #dc2626;">${item.qty}</strong>
                </p>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Footer with Styling -->
        <div style="margin-top: 40px; padding: 20px; border-top: 3px solid #d1d5db; text-align: center; background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-radius: 8px;">
          <p style="margin: 0; font-size: 13px; color: #374151; font-weight: 500;">This is an automated inventory report. Please review and verify all data.</p>
          <p style="margin: 8px 0 0 0; font-size: 11px; color: #6b7280;">Report generated on <strong>${reportDateTime}</strong></p>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  } catch (error) {
    console.error("Error generating PDF HTML:", error);
    throw new Error("Failed to generate PDF");
  }
}
