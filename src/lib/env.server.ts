import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_URL_UNPOOLED: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url(),
  // GMAIL_USER doubles as both the SMTP auth username and the "from"
  // address — Gmail's SMTP requires the from address to match the
  // authenticated account (or a verified alias), so there's no separate
  // "from" var the way the previous Resend setup had one.
  GMAIL_USER: z.string().email(),
  GMAIL_APP_PASSWORD: z.string().min(1),
  LOW_STOCK_ALERT_EMAIL_PRIMARY: z.string().email(),
  LOW_STOCK_ALERT_EMAIL_SECONDARY: z.string().email(),
  // Optional, unlike the vars above: invoice import is the only feature that
  // needs these, and the rest of the app must keep working (dev + prod)
  // before the user has set up an Anthropic key / Vercel Blob store. The
  // invoice-import code itself throws a clear, scoped error if it's invoked
  // without them configured.
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
});

export const serverEnv = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
  LOW_STOCK_ALERT_EMAIL_PRIMARY: process.env.LOW_STOCK_ALERT_EMAIL_PRIMARY,
  LOW_STOCK_ALERT_EMAIL_SECONDARY: process.env.LOW_STOCK_ALERT_EMAIL_SECONDARY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
});
