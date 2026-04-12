"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

// Create a stock alert when item qty becomes 0
export async function createStockAlert(itemId: string, itemName: string) {
  try {
    // Check if an unresolved alert already exists for this item
    const existingAlert = await sql`
      SELECT id FROM stock_alerts 
      WHERE item_id = ${itemId} AND is_resolved = false
    `;

    // Only create if no active alert exists
    if (existingAlert.rows.length === 0) {
      await sql`
        INSERT INTO stock_alerts (item_id, item_name, message, is_resolved, created_at)
        VALUES (
          ${itemId}, 
          ${itemName},
          ${`Item "${itemName}" is out of stock! Please restock this item or update inventory.`},
          false,
          CURRENT_TIMESTAMP
        )
      `;
    }
  } catch (error) {
    console.error("Failed to create stock alert:", error);
  }
}

// Fetch all unresolved stock alerts
export async function getStockAlerts() {
  try {
    const result = await sql`
      SELECT id, item_id, item_name, message, created_at, is_resolved
      FROM stock_alerts
      WHERE is_resolved = false
      ORDER BY created_at DESC
    `;
    return result.rows as any[];
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

// Mark alert as resolved
export async function resolveStockAlert(alertId: string) {
  try {
    await sql`
      UPDATE stock_alerts
      SET is_resolved = true
      WHERE id = ${alertId}
    `;
    revalidatePath("/dashboard/stock-alerts");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to resolve alert" };
  }
}

// Delete a stock alert
export async function deleteStockAlert(alertId: string) {
  try {
    await sql`
      DELETE FROM stock_alerts
      WHERE id = ${alertId}
    `;
    revalidatePath("/dashboard/stock-alerts");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to delete alert" };
  }
}
