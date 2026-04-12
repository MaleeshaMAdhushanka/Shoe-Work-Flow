import { sql } from "@vercel/postgres";
import { User } from "../types";

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredUsers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const users = await sql<User>`
      SELECT id, email, role
      FROM users
      WHERE
        email ILIKE ${`%${query}%`} OR
        role ILIKE ${`%${query}%`}
      ORDER BY email ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return users.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users.");
  }
}

export async function fetchUserPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM users
      WHERE
        email ILIKE ${`%${query}%`} OR
        role ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of users.");
  }
}


export async function fetchUserById(id: string) {
  try {
    const user = await sql<User>`
      SELECT id, email, role
      FROM users
      WHERE id=${id}
    `;

    return user.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}