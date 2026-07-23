import type { NextAuthConfig } from 'next-auth';

// Edge-safe: no providers here. Credentials' authorize() needs bcrypt + a DB
// lookup, neither of which can run in Edge middleware — see auth.ts for the
// full config and auth-edge.ts for the middleware-only instance built from
// this file alone.
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30, // 30 days — workers stay signed in across shifts
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role!;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
