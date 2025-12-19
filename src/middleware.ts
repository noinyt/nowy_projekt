import NextAuth from 'next-auth';
import { authConfig } from '../auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Uruchom middleware na wszystkim OPRÓCZ plików statycznych i obrazków
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};