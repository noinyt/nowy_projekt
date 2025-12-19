import type { NextAuthConfig } from 'next-auth';
import { User } from '@prisma/client';

export const authConfig = {
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/'); 
      const isOnLogin = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');

      const userRole = (auth?.user as User | undefined)?.role;
      if (isAdminRoute) {
        if (isLoggedIn && userRole === 'ADMIN') {
          return true; // Pozwól adminowi wejść
        } else {
          return false; // Zablokuj dostęp do admina
        }
      }
      if (isOnDashboard) {
        if (isOnLogin) return true;
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;