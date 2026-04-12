"use server";
import { sql } from "@vercel/postgres";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const OrderItemSchema = z.object({
  itemId: z.string(),
  quantity: z.number().positive(),
});

const OrderSchema = z.object({
  customerId: z.string(),
  orderItems: z.array(OrderItemSchema),
});

export async function createOrder(formData: FormData) {
  const validatedFields = OrderSchema.safeParse({
    customerId: formData.get("customerId"),
    orderItems: JSON.parse(formData.get("orderItems") as string),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Order.",
    };
  }

  const { customerId, orderItems } = validatedFields.data;

  try {
    try {
      await sql`BEGIN`;
      let totalAmount = 0;
      for (const item of orderItems) {
        const result = await sql`SELECT price FROM items WHERE id = ${item.itemId}`;
        totalAmount += result.rows[0].price * item.quantity;
      }

      const order = await sql`
        INSERT INTO orders (customer_id, total_amount)
        VALUES (${customerId}, ${totalAmount})
        RETURNING id
      `;

      const orderId = order.rows[0].id;

      for (const item of orderItems) {
        await sql`
          INSERT INTO order_items (order_id, item_id, quantity,price)
          VALUES (${orderId}, ${item.itemId}, ${item.quantity},(SELECT price FROM items WHERE id = ${item.itemId}))
        `;

        await sql`
          UPDATE items
          SET qty = qty - ${item.quantity}
          WHERE id = ${item.itemId}
        `;
      }
      await sql`COMMIT`;
    } catch (error) {
      await sql`ROLLBACK`;
      throw error;
    }
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Order.",
    };
  }
}
