
'use server';

import { sql } from "@vercel/postgres";
import bcrypt from 'bcrypt';
import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";


const userSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function validateUserFields(formData: FormData) {
  return userSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}


export async function authenticate(
    prevState: { success?: boolean; error?: string } | undefined,
    formData: FormData,
  ) {
    try {
      const result = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,  // Prevent automatic redirect
      });

      // Check if signIn was successful
      if (result?.error) {
        return { success: false, error: 'Invalid credentials.' };
      }

      // Return success flag instead of redirecting
      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return { success: false, error: 'Invalid credentials.' };
          default:
            return { success: false, error: 'Something went wrong.' };
        }
      }
      throw error;
    }
  }



export async function register(formData: FormData) {
  const validatedFields = validateUserFields(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }
  try {
    const { email, password } = validatedFields.data;
    const encryptedPassword = await bcrypt.hash(password, 1);

    await sql`
      INSERT INTO users (email, password, role)
      VALUES (${email}, ${encryptedPassword}, 'other');
    `;
    console.log("✅ User created successfully:", email);
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Database Error: Failed to Create User." };
  }
}