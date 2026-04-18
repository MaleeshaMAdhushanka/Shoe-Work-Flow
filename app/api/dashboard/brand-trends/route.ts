import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Fetch brand, size, and quantity data
    const result = await sql`
      SELECT 
        name as brand,
        size,
        qty
      FROM items
      WHERE status = 'active'
      ORDER BY name ASC, size ASC
      LIMIT 100
    `;

    const brandSizeQtyData = result.rows.map((row: any) => ({
      brand: row.brand,
      size: row.size,
      qty: Number(row.qty),
    }));

    return NextResponse.json({
      brandSizeQtyData,
      total: brandSizeQtyData.length,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching brand trend data:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand trend data", success: false },
      { status: 500 }
    );
  }
}
