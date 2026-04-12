import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from "@vercel/postgres";
import { User } from './app/lib/types';
import bcrypt from "bcrypt";
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    console.log('Database query: SELECT * FROM users WHERE email=', email);
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    console.log('Query result rows:', user.rows.length);
    console.log('Full result:', JSON.stringify(user.rows));
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email,password } = parsedCredentials.data;
          console.log('Login attempt for:', email);
          const user = await getUser(email);
          console.log('User found:', !!user);
          if (!user) {
            console.log('No user found with email:', email);
            return null;
          }
          console.log('Comparing password...');
          console.log('Password from input:', password);
          console.log('Password hash from DB:', user.password);
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log('Password match result:', passwordsMatch);
          if (passwordsMatch) return user;
        }
        console.log('Auth failed - invalid credentials format or password mismatch');
        return null;
      },
    }),
  ],
  session:{strategy:'jwt'}
});