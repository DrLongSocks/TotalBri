import 'server-only';
import { Resend } from 'resend';
import { serverEnv } from '@/lib/env.server';

const resend = new Resend(serverEnv.RESEND_API_KEY);

// Two fixed recipients from two discrete env vars, not a parsed
// comma-separated string — see original plan §6.
export async function sendLowStockAlert({
  materialName,
  currentStock,
  unit,
  threshold,
}: {
  materialName: string;
  currentStock: number;
  unit: string;
  threshold: number;
}) {
  await resend.emails.send({
    from: serverEnv.RESEND_FROM_EMAIL,
    to: [serverEnv.LOW_STOCK_ALERT_EMAIL_PRIMARY, serverEnv.LOW_STOCK_ALERT_EMAIL_SECONDARY],
    subject: `Stock bajo: ${materialName}`,
    text: `${materialName} está en ${currentStock} ${unit}, por debajo del umbral de ${threshold} ${unit}.`,
  });
}
