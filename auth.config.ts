import type { NextAuthConfig } from 'next-auth';
import { fetchUserById } from './app/lib/user/user-data';
 
export const authConfig = {
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      if (session.user) {
        session.user.email = token.email!;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await fetchUserById(token.sub);
      if (!existingUser) return token;
      token.email = existingUser.email;
      token.role = existingUser.role;
      return token;
    }
  },
  providers: [],
} satisfies NextAuthConfig;