import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_URL_UNPOOLED: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url(),
  ADMIN_HOST: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
  LOW_STOCK_ALERT_EMAIL_PRIMARY: z.string().email(),
  LOW_STOCK_ALERT_EMAIL_SECONDARY: z.string().email(),
});

export const serverEnv = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
  ADMIN_HOST: process.env.ADMIN_HOST,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  LOW_STOCK_ALERT_EMAIL_PRIMARY: process.env.LOW_STOCK_ALERT_EMAIL_PRIMARY,
  LOW_STOCK_ALERT_EMAIL_SECONDARY: process.env.LOW_STOCK_ALERT_EMAIL_SECONDARY,
});
