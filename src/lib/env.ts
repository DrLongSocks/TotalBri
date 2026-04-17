import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_WHATSAPP_PRIMARY: z.string().regex(/^\d{10,15}$/),
  NEXT_PUBLIC_WHATSAPP_SECONDARY: z
    .string()
    .regex(/^\d{10,15}$/)
    .optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_WHATSAPP_PRIMARY: process.env.NEXT_PUBLIC_WHATSAPP_PRIMARY,
  NEXT_PUBLIC_WHATSAPP_SECONDARY: process.env.NEXT_PUBLIC_WHATSAPP_SECONDARY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
