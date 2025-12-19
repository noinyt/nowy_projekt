import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod'; 
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
});


export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log('LOGOWANIE START');
        const parsedCredentials = LoginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          const user = await prisma.user.findUnique({ where: { email } });
          console.log('Znaleziony user:', user ? user.email : 'BRAK');
          if (user) console.log('User Password Hash:', user.password);

          if (!user) {
            console.log('User nie istnieje');
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          console.log('Hasło pasuje?:', passwordsMatch);

          if (passwordsMatch) return user;
        } else {
          console.log('Błąd walidacji Zod:', parsedCredentials.error);
        }

        console.log('Hasło nieprawidłowe lub inny błąd podczas logowania');
        return null;
      },
    }),
  ],
});