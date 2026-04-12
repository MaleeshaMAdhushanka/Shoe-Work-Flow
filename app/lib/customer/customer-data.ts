import { sql } from "@vercel/postgres";
import { Customer } from "../types";

const ITEMS_PER_PAGE = 10;
export const revalidate = 30; // Cache for 30 seconds

export async function fetchCustomersAndPages(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Run both queries in parallel using Promise.all for better performance
    const [customersResult, countResult] = await Promise.all([
      sql<Customer>`
        SELECT id, name, email, mobile, address
        FROM customers
        WHERE
          name ILIKE ${`%${query}%`} OR
          email ILIKE ${`%${query}%`} OR
          mobile ILIKE ${`%${query}%`} OR
          address ILIKE ${`%${query}%`}
        ORDER BY name ASC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*) FROM customers
        WHERE
          name ILIKE ${`%${query}%`} OR
          email ILIKE ${`%${query}%`} OR
          mobile ILIKE ${`%${query}%`} OR
          address ILIKE ${`%${query}%`}
      `
    ]);

    const totalPages = Math.ceil(Number(countResult.rows[0].count) / ITEMS_PER_PAGE);
    return {
      customers: customersResult.rows,
      totalPages
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customers.");
  }
}

// Legacy functions for backward compatibility
export async function fetchFilteredCustomers(query: string, currentPage: number) {
  const { customers } = await fetchCustomersAndPages(query, currentPage);
  return customers;
}

export async function fetchCustomerPages(query: string) {
  const { totalPages } = await fetchCustomersAndPages(query, 1);
  return totalPages;
}
