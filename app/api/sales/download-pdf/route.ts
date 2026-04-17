import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { orders, customers, stats, topCustomers } = data;

    const date = new Date().toLocaleDateString();
    const highValueThreshold = (stats.total_revenue / stats.total_orders) * 1.5;

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Sales Report</title>
      <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #059669; padding-bottom: 20px; }
        h1 { color: #047857; font-size: 28px; margin-bottom: 5px; }
        .date { color: #666; font-size: 14px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 25px 0; }
        .stat-card { 
          padding: 20px; 
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .stat-label { font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 28px; font-weight: bold; margin-top: 8px; }
        h2 { color: #047857; font-size: 18px; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #059669; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { 
          background-color: #047857; 
          color: white; 
          padding: 12px; 
          text-align: left;
          font-weight: bold;
          font-size: 13px;
        }
        td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
        tr:nth-child(even) { background-color: #f0fdf4; }
        tr:hover { background-color: #dcfce7; }
        .high-value { background-color: #fef3c7; }
        .section { margin-bottom: 30px; }
        .top-customers { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 12px; 
          margin: 15px 0;
        }
        .customer-card {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #0284c7;
        }
        .customer-name { font-weight: bold; color: #0c4a6e; }
        .customer-stat { font-size: 12px; color: #475569; margin-top: 4px; }
        .alert-box {
          background: linear-gradient(135deg, #fef08a 0%, #fde047 100%);
          border-left: 4px solid #ca8a04;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .alert-title { font-weight: bold; color: #713f12; font-size: 16px; margin-bottom: 15px; }
        .alert-item {
          background: white;
          padding: 12px;
          margin-bottom: 10px;
          border-radius: 4px;
          border-left: 3px solid #ca8a04;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #d1d5db;
          color: #666;
          font-size: 12px;
          text-align: center;
        }
        .highlight-green { background-color: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 3px; font-weight: bold; }
        .highlight-amber { background-color: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 3px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Sales Manager Report</h1>
        <p class="date">Generated on ${date}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Orders</div>
          <div class="stat-value">${stats.total_orders}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Avg Order Value</div>
          <div class="stat-value">₨${Number(stats.avg_order_value).toLocaleString("en-PK", {
            maximumFractionDigits: 0,
          })}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Active Customers</div>
          <div class="stat-value">${stats.active_customers}</div>
        </div>
      </div>

      <div class="section">
        <h2>🎯 Top Customers by Orders</h2>
        <div class="top-customers">
    `;

    // Add top customers
    topCustomers.slice(0, 6).forEach((customer: any) => {
      html += `
          <div class="customer-card">
            <div class="customer-name">${customer.customer_name}</div>
            <div class="customer-stat">📦 Orders: ${customer.order_count}</div>
            <div class="customer-stat">💰 Spent: ₨${Number(customer.total_spent).toLocaleString("en-PK", {
              maximumFractionDigits: 0,
            })}</div>
          </div>
      `;
    });

    html += `
        </div>
      </div>

      <div class="section">
        <h2>📈 Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th style="text-align: right;">Amount (₨)</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Add orders
    orders.slice(0, 15).forEach((order: any) => {
      const isHighValue = Number(order.total_amount) > highValueThreshold;
      const rowClass = isHighValue ? "high-value" : "";
      html += `
            <tr class="${rowClass}">
              <td><code style="background: #f3f4f6; padding: 2px 4px; border-radius: 2px;">${order.order_id.substring(
        0,
        8
      )}...</code></td>
              <td>${order.customer_name}</td>
              <td>${new Date(order.order_date).toLocaleDateString()}</td>
              <td><span class="highlight-green">${order.item_count}</span></td>
              <td style="text-align: right; font-weight: bold;">₨${Number(
        order.total_amount
      ).toLocaleString("en-PK", { maximumFractionDigits: 0 })}</td>
            </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>

      <div class="alert-box">
        <div class="alert-title">💎 High Value Orders (${orders.filter(
          (o: any) => Number(o.total_amount) > highValueThreshold
        ).length} found)</div>
    `;

    const highValueOrders = orders.filter((o: any) => Number(o.total_amount) > highValueThreshold);
    if (highValueOrders.length > 0) {
      highValueOrders.slice(0, 5).forEach((order: any) => {
        html += `
          <div class="alert-item">
            <strong>${order.customer_name}</strong><br>
            Order: ${order.order_id.substring(0, 12)}... | Items: ${order.item_count} | Amount: <span class="highlight-amber">₨${Number(
          order.total_amount
        ).toLocaleString("en-PK", { maximumFractionDigits: 0 })}</span>
          </div>
        `;
      });
    } else {
      html += `<p style="color: #92400e;">No high-value orders in this period.</p>`;
    }

    html += `
      </div>

      <div class="section">
        <h2>👥 Customer Performance Summary1</h2>
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th style="text-align: center;">Total Orders</th>
              <th style="text-align: right;">Total Spent (₨)</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Add customer summary (top customers)
    customers.slice(0, 15).forEach((customer: any) => {
      html += `
            <tr>
              <td>${customer.customer_name}</td>
              <td style="text-align: center;"><span class="highlight-green">${customer.total_orders}</span></td>
              <td style="text-align: right; font-weight: bold;">₨${Number(
        customer.total_spent
      ).toLocaleString("en-PK", { maximumFractionDigits: 0 })}</td>
            </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p><strong>Sales Manager Dashboard Report</strong></p>
        <p>This report includes all active orders, customer statistics, and revenue analysis.</p>
        <p>Report generated on ${new Date().toLocaleString()}</p>
        <p style="margin-top: 15px; font-size: 11px; color: #999;">Confidential - For Internal Use Only</p>
      </div>
    </body>
    </html>
    `;

    // Return HTML that will be converted to PDF by the browser
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating sales PDF:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
