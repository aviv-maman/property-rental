import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string | null;
    } & DefaultSession['user'];
  }
  // interface User {
  //   email_verified: Date | null;
  // }
}
