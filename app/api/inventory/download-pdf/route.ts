import { NextRequest, NextResponse } from "next/server";
import { Item } from "@/app/lib/types";
import { generateInventoryPDF } from "@/app/lib/item/generate-pdf";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    console.log("PDF generation started");
    
    const { items, stats } = await request.json();
    console.log("Request parsed, items:", items.length);

    // Use the colorful PDF generation function
    const htmlContent = await generateInventoryPDF(items, stats);

    console.log("HTML content generated, length:", htmlContent.length);

    // Return HTML that will be converted to PDF by the browser
    return new Response(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
