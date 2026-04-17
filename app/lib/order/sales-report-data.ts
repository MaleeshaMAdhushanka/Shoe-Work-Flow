import { db } from "@vercel/postgres";

export interface OrderWithCustomer {
  order_id: string;
  order_date: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  item_count: number;
}

export interface CustomerOrderStats {
  customer_name: string;
  email: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
}

export interface SalesStats {
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  active_customers: number;
}

// Fetch all active orders (last 30 days or all)
export async function fetchActiveOrders() {
  try {
    const result = await db.query(`
      SELECT 
        o.id as order_id,
        o.order_date,
        c.name as customer_name,
        c.email as customer_email,
        o.total_amount,
        COUNT(oi.item_id) as item_count
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, o.order_date, c.name, c.email, o.total_amount
      ORDER BY o.order_date DESC
    `);
    return result.rows as OrderWithCustomer[];
  } catch (error) {
    console.error("Error fetching active orders:", error);
    return [];
  }
}

// Fetch customer order statistics
export async function fetchCustomerOrderStats() {
  try {
    const result = await db.query(`
      SELECT 
        c.name as customer_name,
        c.email,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent,
        MAX(o.order_date) as last_order_date
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id, c.name, c.email
      HAVING COUNT(o.id) > 0
      ORDER BY SUM(o.total_amount) DESC NULLS LAST
    `);
    return result.rows as CustomerOrderStats[];
  } catch (error) {
    console.error("Error fetching customer order stats:", error);
    return [];
  }
}

// Fetch overall sales statistics
export async function fetchSalesStats() {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_revenue,
        COALESCE(AVG(o.total_amount), 0) as avg_order_value,
        COUNT(DISTINCT o.customer_id) as active_customers
      FROM orders o
    `);
    
    const row = result.rows[0];
    return {
      total_orders: Number(row.total_orders),
      total_revenue: Number(row.total_revenue),
      avg_order_value: Number(row.avg_order_value),
      active_customers: Number(row.active_customers),
    } as SalesStats;
  } catch (error) {
    console.error("Error fetching sales stats:", error);
    return {
      total_orders: 0,
      total_revenue: 0,
      avg_order_value: 0,
      active_customers: 0,
    };
  }
}

// Fetch top customers by order count
export async function fetchTopCustomersByOrders(limit = 10) {
  try {
    const result = await db.query(`
      SELECT 
        c.name as customer_name,
        c.email,
        COUNT(o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id, c.name, c.email
      HAVING COUNT(o.id) > 0
      ORDER BY COUNT(o.id) DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching top customers:", error);
    return [];
  }
}

// Fetch orders by date range (for trending)
export async function fetchOrdersByDateRange(days = 30) {
  try {
    const result = await db.query(`
      SELECT 
        DATE(o.order_date) as order_date,
        COUNT(o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as daily_revenue
      FROM orders o
      WHERE o.order_date >= CURRENT_DATE - INTERVAL '1 day' * $1
      GROUP BY DATE(o.order_date)
      ORDER BY DATE(o.order_date) DESC
    `, [days]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching orders by date:", error);
    return [];
  }
}
