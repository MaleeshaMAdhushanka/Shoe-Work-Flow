import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { stats, userCounts, revenueByDate, transactions } = data;

    const date = new Date().toLocaleDateString();

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Admin Dashboard Report</title>
      <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #7c3aed; padding-bottom: 20px; }
        h1 { color: #6d28d9; font-size: 28px; margin-bottom: 5px; }
        .date { color: #666; font-size: 14px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 25px 0; }
        .stat-card { 
          padding: 20px; 
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .stat-label { font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 28px; font-weight: bold; margin-top: 8px; }
        h2 { color: #6d28d9; font-size: 18px; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { 
          background-color: #6d28d9; 
          color: white; 
          padding: 12px; 
          text-align: left;
          font-weight: bold;
          font-size: 13px;
        }
        td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
        tr:nth-child(even) { background-color: #f5f3ff; }
        tr:hover { background-color: #ede9fe; }
        .section { margin-bottom: 30px; }
        .user-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
          gap: 12px; 
          margin: 15px 0;
        }
        .user-card {
          background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #7c3aed;
          text-align: center;
        }
        .user-label { font-size: 11px; color: #6d28d9; text-transform: uppercase; font-weight: bold; }
        .user-value { font-size: 24px; font-weight: bold; color: #3f0f5c; margin-top: 8px; }
        .transaction-card {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #ec4899;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #d1d5db;
          color: #666;
          font-size: 12px;
          text-align: center;
        }
        .highlight-purple { background-color: #ede9fe; color: #5b21b6; padding: 2px 6px; border-radius: 3px; font-weight: bold; }
        .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>👑 Admin Dashboard Report</h1>
        <p class="date">Generated on ${date}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Revenue</div>
          <div class="stat-value">₨${Number(stats.total_revenue).toLocaleString("en-PK", {
            maximumFractionDigits: 0,
          })}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Orders</div>
          <div class="stat-value">${stats.total_orders}</div>
        </div>
      </div>

      <div class="section">
        <h2>👥 System Users Breakdown</h2>
        <div class="user-grid">
          <div class="user-card">
            <div class="user-label">Total Users</div>
            <div class="user-value">${userCounts.total_users}</div>
          </div>
          <div class="user-card">
            <div class="user-label">Active Users</div>
            <div class="user-value">${userCounts.active_users}</div>
          </div>
          <div class="user-card">
            <div class="user-label">Admins</div>
            <div class="user-value">${userCounts.admin_count}</div>
          </div>
          <div class="user-card">
            <div class="user-label">Managers</div>
            <div class="user-value">${userCounts.manager_count}</div>
          </div>
          <div class="user-card">
            <div class="user-label">Sales</div>
            <div class="user-value">${userCounts.sales_count}</div>
          </div>
          <div class="user-card">
            <div class="user-label">Inventory</div>
            <div class="user-value">${userCounts.inventory_count}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2> Revenue Trend (Last 30 Days)</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th style="text-align: right;">Revenue (₨)</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Add revenue trend data
    revenueByDate.slice(0, 30).forEach((item: any) => {
      html += `
            <tr>
              <td>${item.date}</td>
              <td style="text-align: right; font-weight: bold;">₨${Number(item.amount).toLocaleString("en-PK", {
                maximumFractionDigits: 0,
              })}</td>
            </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>💳 Recent Transactions (Orders)</h2>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer Name</th>
              <th>Date</th>
              <th style="text-align: right;">Amount (₨)</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Add transaction data
    transactions.slice(0, 15).forEach((transaction: any) => {
      html += `
            <tr>
              <td><code style="background: #f3f4f6; padding: 2px 4px; border-radius: 2px;">${transaction.order_id}...</code></td>
              <td>${transaction.customer_name}</td>
              <td>${transaction.order_date}</td>
              <td style="text-align: right; font-weight: bold;">₨${Number(transaction.total_amount).toLocaleString("en-PK", {
                maximumFractionDigits: 0,
              })}</td>
            </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p><strong>System Administration Report</strong></p>
        <p>Comprehensive overview of system performance, user management, and financial metrics.</p>
        <p>Report generated on ${new Date().toLocaleString()}</p>
        <p style="margin-top: 15px; font-size: 11px; color: #999;">Confidential - For Admin Use Only</p>
      </div>
    </body>
    </html>
    `;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating admin PDF:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
