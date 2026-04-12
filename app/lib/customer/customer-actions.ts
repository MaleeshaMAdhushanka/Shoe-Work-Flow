"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile must be a 10-digit number"),
  address: z.string().min(1, "Address is required"),
});

function validateFields(formData: FormData) {
  return formSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    mobile: formData.get("mobile"),
    address: formData.get("address"),
  });
}

export async function createCustomer(formData: FormData) {
  const validatedFields = validateFields(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Customer.",
    };
  }

  try {
    const { name, email, mobile, address } = validatedFields.data;
    await sql`
      INSERT INTO customers (name, email, mobile, address, password)
      VALUES (${name}, ${email}, ${mobile}, ${address}, ${address})
    `;
    revalidatePath("/dashboard/customer");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Customer.",
    };
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  const validatedFields = validateFields(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  try {
    const { name, email, mobile, address } = validatedFields.data;
    await sql`
      UPDATE customers
      SET name = ${name},
          email = ${email},
          mobile = ${mobile},
          address = ${address}
      WHERE id = ${id}
    `;
    revalidatePath("/dashboard/customer");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Update Customer.",
    };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath("/dashboard/customer");
  } catch (error) {
    console.error("Database Error:", error);
  }
}
