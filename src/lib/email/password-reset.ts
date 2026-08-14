import 'server-only';
import { serverEnv } from '@/lib/env.server';
import { sendEmail } from './mailer';

export async function sendPasswordResetEmail({ email, token }: { email: string; token: string }) {
  const resetUrl = new URL('/admin/reset-password/confirm', serverEnv.AUTH_URL);
  resetUrl.searchParams.set('token', token);

  await sendEmail({
    to: email,
    subject: 'Restablece tu contraseña de Total Bri',
    text: `Recibimos una solicitud para restablecer tu contraseña.\n\nCrea una nueva aquí: ${resetUrl.toString()}\n\nEste enlace expira en 1 hora. Si no solicitaste esto, ignora este correo.`,
  });
}
