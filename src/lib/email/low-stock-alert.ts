import 'server-only';
import { serverEnv } from '@/lib/env.server';
import { sendEmail } from './mailer';

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
  await sendEmail({
    to: [serverEnv.LOW_STOCK_ALERT_EMAIL_PRIMARY, serverEnv.LOW_STOCK_ALERT_EMAIL_SECONDARY],
    subject: `Stock bajo: ${materialName}`,
    text: `${materialName} está en ${currentStock} ${unit}, por debajo del umbral de ${threshold} ${unit}.`,
  });
}
