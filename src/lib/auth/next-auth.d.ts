// next-auth v5's NextAuthConfig callback signatures (jwt/session) reference
// @auth/core's User/Session/JWT interfaces directly, not next-auth's own
// re-exported aliases — so augmentation has to target @auth/core's modules
// or it silently merges onto an unrelated type and role stays untyped.
import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
  interface User {
    role: 'admin' | 'worker';
  }

  interface Session {
    user: {
      id: string;
      role: 'admin' | 'worker';
    } & DefaultSession['user'];
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: 'admin' | 'worker';
  }
}
