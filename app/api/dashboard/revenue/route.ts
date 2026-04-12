import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await sql`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', order_date), 'Mon') AS month,
        SUM(total_amount) AS revenue
      FROM 
        orders
      WHERE 
        order_date >= DATE_TRUNC('year', CURRENT_DATE)
      GROUP BY 
        DATE_TRUNC('month', order_date)
      ORDER BY 
        DATE_TRUNC('month', order_date)
    `;

    const months = data.rows.map((row) => row.month);
    const revenue = data.rows.map((row) => Number(row.revenue));

    return NextResponse.json({ months, revenue });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}