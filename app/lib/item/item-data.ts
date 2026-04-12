import { sql } from "@vercel/postgres";
import { Item } from "../types";

const ITEMS_PER_PAGE = 10;
export const revalidate = 30; // Cache for 30 seconds

export async function fetchItemsAndPages(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Run both queries in parallel using Promise.all for better performance
    const [itemsResult, countResult] = await Promise.all([
      sql<Item>`
        SELECT id, name, image, price, size, qty, status
        FROM items
        WHERE
          name ILIKE ${`%${query}%`} OR
          status ILIKE ${`%${query}%`}
        ORDER BY name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*) FROM items
        WHERE
          name ILIKE ${`%${query}%`} OR
          status ILIKE ${`%${query}%`}
      `
    ]);

    const totalPages = Math.ceil(Number(countResult.rows[0].count) / ITEMS_PER_PAGE);
    return {
      items: itemsResult.rows,
      totalPages
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch items.");
  }
}


export async function fetchItemById(id: string) {
  try {
    const items = await sql<Item>`
      SELECT id, name, image, price, size, qty, status
      FROM items
      WHERE id = ${id}
    `;

    return items.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch item.");
  }
}

// Legacy functions for backward compatibility
export async function fetchFilteredItems(query: string, currentPage: number) {
  const { items } = await fetchItemsAndPages(query, currentPage);
  return items;
}

export async function fetchItemPages(query: string) {
  const { totalPages } = await fetchItemsAndPages(query, 1);
  return totalPages;
}
