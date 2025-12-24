// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      const isAdminPath = nextUrl.pathname.startsWith('/admin');
      const isTasksPath = nextUrl.pathname.startsWith('/tasks'); // Nowa chroniona ścieżka

      const userRole = (auth?.user as any)?.role;

      // 1. Ochrona Admina
      if (isAdminPath) {
        if (isLoggedIn && userRole === 'ADMIN') return true;
        return false;
      }

      // 2. Ochrona Zadań (To będzie nowa podstrona dla zalogowanych)
      if (isTasksPath) {
        if (isLoggedIn) return true;
        return false; // Przekieruj na login
      }

      // 3. Strona główna (Dashboard) jest teraz PUBLICZNA
      // Usuwamy blokadę dla isOnDashboard
      
      return true;
    },
    // ... (jwt i session callbacks bez zmian - zostaw je tutaj)
    async jwt({ token, user }) {
        if (user) token.role = (user as any).role;
        return token;
    },
    async session({ session, token }) {
        if (session.user) (session.user as any).role = token.role;
        return session;
    }
  },
  providers: [],
} satisfies NextAuthConfig;