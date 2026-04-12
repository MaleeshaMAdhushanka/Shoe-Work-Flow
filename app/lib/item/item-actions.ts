"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { del, put } from "@vercel/blob";
import { z } from "zod";// validation library
import { createStockAlert } from "./item-alerts";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  size: z.string().min(1, "Size is required"),
  qty: z.string().regex(/^\d+$/, "Quantity must be a whole number"),
  status: z.enum(["active", "inactive"], { invalid_type_error: "Please select a status" }),
});

//Converts FormData from the frontend into an object that Zod can validate
function validateFields(formData: FormData) {
  return formSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    size: formData.get("size"),
    qty: formData.get("qty"),
    status: formData.get("status"),
  });
}
//create item
export async function createItem(formData: FormData) {
  const validatedFields = validateFields(formData);

  if(!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Item.",
    };
  }

  try {
    let imagePath = null;
    const file = formData.get("image") as File;

    if (file && file.size > 0) {
      const blob = await put(`assets/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      imagePath = `/${blob.pathname}`;
    }

    let { name, price, size, qty, status } = validatedFields.data;
    
    // Auto-set status to inactive if qty is 0
    if (parseInt(qty) === 0) {
      status = "inactive";
    }

    const result = await sql`
      INSERT INTO items (name, image, price, size, qty, status)
      VALUES (${name}, ${imagePath}, ${price}, ${size}, ${qty}, ${status})
      RETURNING id
    `;

    // Create stock alert if qty is 0
    if (parseInt(qty) === 0 && result.rows.length > 0) {
      const itemId = result.rows[0].id;
      await createStockAlert(itemId, name);
    }

    revalidatePath("/dashboard/item");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Item.",
    };
  }
}
//update Item
export async function updateItem(id: string, formData: FormData) {
  const validatedFields = validateFields(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Item.",
    };
  }

  try {
    let imagePath = null;
    let updateImageInDB = false;

    const oldImage = formData.get("removeImage") as string;
    if (oldImage) {
      await del(`${process.env.NEXT_PUBLIC_BLOB_URL}${oldImage}`);//vercelblob storage remove image
    }

    const file = formData.get("image") as File;
    if (file && file.size > 0) {
      const blob = await put(`assets/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      imagePath = `/${blob.pathname}`;
      updateImageInDB = true; //new image update
    }
    
    let { name, price, size, qty, status } = validatedFields.data;
    
    // Auto-set status to inactive if qty is 0
    if (parseInt(qty) === 0) {
      status = "inactive";
    }

    // Only update image if a new one was provided
    if (updateImageInDB) {
      await sql`
        UPDATE items
        SET name = ${name},
            image = ${imagePath},
            price = ${price},
            size = ${size},
            qty = ${qty},
            status = ${status}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE items
        SET name = ${name},
            price = ${price},
            size = ${size},
            qty = ${qty},
            status = ${status}
        WHERE id = ${id}
      `;
    }

    // Create stock alert if qty becomes 0
    if (parseInt(qty) === 0) {
      await createStockAlert(id, name);
    }
    
    revalidatePath("/dashboard/item");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Update Item.",
    };
  }
}
//delete Item
export async function deleteItem(id: string, image: string) {
  try {
    del(`${process.env.NEXT_PUBLIC_BLOB_URL}${image}`);
    await sql`DELETE FROM items WHERE id = ${id}`;
    revalidatePath("/dashboard/item");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete item.");
  }
}
