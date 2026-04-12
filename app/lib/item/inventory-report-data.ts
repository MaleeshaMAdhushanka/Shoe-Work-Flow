import { sql } from "@vercel/postgres";
import { Item } from "../types";

export const revalidate = 60; // Cache for 60 seconds

export async function fetchAllInventoryItems() {
  try {
    const result = await sql<Item>`
      SELECT id, name, image, price, size, qty, status
      FROM items
      ORDER BY qty DESC
    `;
    
    return result.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch inventory items.");
  }
}

export async function fetchInventoryStats() {
  try {
    const result = await sql`
      SELECT 
        COUNT(*) as total_items,
        COALESCE(SUM(qty), 0) as total_qty,
        COALESCE(AVG(qty), 0) as avg_qty,
        MIN(qty) as min_qty,
        MAX(qty) as max_qty
      FROM items
    `;
    
    return result.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch inventory statistics.");
  }
}

export async function fetchHighStockItems() {
  try {
    // Get items with quantity above average
    const statsResult = await sql`
      SELECT COALESCE(AVG(qty), 0) as avg_qty
      FROM items
    `;
    
    const avgQty = Math.floor(Number(statsResult.rows[0].avg_qty));
    
    const itemsResult = await sql<Item>`
      SELECT id, name, image, price, size, qty, status
      FROM items
      WHERE qty > ${avgQty}
      ORDER BY qty DESC
    `;
    
    return itemsResult.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch high stock items.");
  }
}

export async function fetchLowStockItems() {
  try {
    // Get items with quantity below average
    const statsResult = await sql`
      SELECT COALESCE(AVG(qty), 0) as avg_qty
      FROM items
    `;
    
    const avgQty = Math.floor(Number(statsResult.rows[0].avg_qty));
    
    const itemsResult = await sql<Item>`
      SELECT id, name, image, price, size, qty, status
      FROM items
      WHERE qty < ${avgQty}
      ORDER BY qty ASC
    `;
    
    return itemsResult.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch low stock items.");
  }
}
