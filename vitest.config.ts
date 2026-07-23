import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Next's server webpack build aliases `server-only` to a no-op so
      // server-only-flagged modules (db/index.ts, env.server.ts) import
      // cleanly on the server; vitest has no such build step, so mirror it
      // here for the one test that legitimately needs a real DB connection.
      'server-only': path.resolve(__dirname, './src/test/server-only-mock.ts'),
    },
  },
});
