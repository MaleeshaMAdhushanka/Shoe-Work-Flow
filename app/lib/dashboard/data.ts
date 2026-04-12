import { sql } from "@vercel/postgres";

export async function fetchCardData() {
  try {
    const totalOrdersPromise = sql`SELECT COUNT(*) FROM orders`;
    const totalCustomersPromise = sql`SELECT COUNT(*) FROM customers`;
    const totalRevenuePromise = sql`
      SELECT SUM(total_amount) AS total
      FROM orders
    `;

    const data = await Promise.all([totalOrdersPromise, totalCustomersPromise, totalRevenuePromise]);

    const totalOrders = Number(data[0].rows[0].count ?? "0");
    const totalCustomers = Number(data[1].rows[0].count ?? "0");
    const totalRevenue = Number(data[2].rows[0].total ?? "0");

    return {
      totalOrders,
      totalCustomers,
      totalRevenue: totalRevenue.toFixed(2), 
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

export async function fetchBestSellers() {
  try {
    const data = await sql`
      SELECT 
        i.id,
        i.name,
        i.price,
        i.image,
        SUM(oi.quantity) AS sold_count
      FROM 
        items i
      JOIN 
        order_items oi ON i.id = oi.item_id
      JOIN 
        orders o ON oi.order_id = o.id
      GROUP BY 
        i.id, i.name, i.price, i.image
      ORDER BY 
        sold_count DESC
      LIMIT 4
    `;

    return data.rows.map((row) => ({
      id: row.id,
      name: row.name,
      price: row.price, 
      image: row.image,
      soldCount: Number(row.sold_count),
    }));
  } catch (error) {
    console.error("Database Error:", error);
  }
}
