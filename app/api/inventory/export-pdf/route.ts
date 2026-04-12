import { NextRequest, NextResponse } from "next/server";
import { generateInventoryPDF } from "@/app/lib/item/generate-pdf";
import { Item } from "@/app/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { items, stats } = await request.json();

    const htmlContent = await generateInventoryPDF(items, stats);

    // For simplicity, return the HTML that can be opened in a new tab
    // The client will handle converting it to PDF via print or html2canvas
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": 'inline; filename="inventory-report.html"',
      },
    });
  } catch (error) {
    console.error("Error in PDF API:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
