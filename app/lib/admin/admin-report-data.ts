import { db } from "@vercel/postgres";

export interface UserStats {
  total_users: number;
  active_users: number;
  admin_count: number;
  manager_count: number;
  sales_count: number;
  inventory_count: number;
}

export interface TransactionData {
  order_id: string;
  customer_name: string;
  total_amount: number;
  order_date: string;
}

export interface AdminDashboardStats {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  revenue_by_date: Array<{ date: string; amount: number }>;
  user_counts: UserStats;
  transactions: TransactionData[];
}

// Fetch all users with role breakdown
export async function fetchUserStats(): Promise<UserStats> {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) as active_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
        SUM(CASE WHEN role = 'manager' THEN 1 ELSE 0 END) as manager_count,
        SUM(CASE WHEN role = 'sales' THEN 1 ELSE 0 END) as sales_count,
        SUM(CASE WHEN role = 'inventory' THEN 1 ELSE 0 END) as inventory_count
      FROM users
    `);
    
    const row = result.rows[0];
    return {
      total_users: Number(row.total_users) || 0,
      active_users: Number(row.active_users) || 0,
      admin_count: Number(row.admin_count) || 0,
      manager_count: Number(row.manager_count) || 0,
      sales_count: Number(row.sales_count) || 0,
      inventory_count: Number(row.inventory_count) || 0,
    };
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return {
      total_users: 0,
      active_users: 0,
      admin_count: 0,
      manager_count: 0,
      sales_count: 0,
      inventory_count: 0,
    };
  }
}

// Fetch daily revenue for last 30 days
export async function fetchRevenueByDate() {
  try {
    const result = await db.query(`
      SELECT 
        DATE(o.order_date) as date,
        SUM(o.total_amount) as amount
      FROM orders o
      WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(o.order_date)
      ORDER BY DATE(o.order_date) DESC
    `);
    
    return result.rows.map((row: any) => ({
      date: new Date(row.date).toLocaleDateString('en-PK'),
      amount: Number(row.amount) || 0,
    }));
  } catch (error) {
    console.error("Error fetching revenue by date:", error);
    return [];
  }
}

// Fetch transaction details (orders)
export async function fetchTransactionDetails(): Promise<TransactionData[]> {
  try {
    const result = await db.query(`
      SELECT 
        o.id as order_id,
        c.name as customer_name,
        o.total_amount,
        o.order_date
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.order_date DESC
      LIMIT 20
    `);
    
    return result.rows.map((row: any) => ({
      order_id: row.order_id.substring(0, 8),
      customer_name: row.customer_name,
      total_amount: Number(row.total_amount) || 0,
      order_date: new Date(row.order_date).toLocaleDateString('en-PK'),
    }));
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    return [];
  }
}

// Fetch overall admin dashboard stats
export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  try {
    // Fetch order and revenue stats
    const ordersResult = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(DISTINCT customer_id) as total_customers
      FROM orders
    `);
    
    const [userStats, revenueByDate, transactionData] = await Promise.all([
      fetchUserStats(),
      fetchRevenueByDate(),
      fetchTransactionDetails(),
    ]);
    
    const orderRow = ordersResult.rows[0];
    
    return {
      total_revenue: Number(orderRow.total_revenue) || 0,
      total_orders: Number(orderRow.total_orders) || 0,
      total_customers: Number(orderRow.total_customers) || 0,
      revenue_by_date: revenueByDate,
      user_counts: userStats,
      transactions: transactionData,
    };
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return {
      total_revenue: 0,
      total_orders: 0,
      total_customers: 0,
      revenue_by_date: [],
      user_counts: {
        total_users: 0,
        active_users: 0,
        admin_count: 0,
        manager_count: 0,
        sales_count: 0,
        inventory_count: 0,
      },
      transactions: [],
    };
  }
}
