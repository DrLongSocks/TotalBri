import 'server-only';
import { Resend } from 'resend';
import { serverEnv } from '@/lib/env.server';

const resend = new Resend(serverEnv.RESEND_API_KEY);

export async function sendPasswordResetEmail({ email, token }: { email: string; token: string }) {
  const resetUrl = new URL('/admin/reset-password/confirm', serverEnv.AUTH_URL);
  resetUrl.searchParams.set('token', token);

  await resend.emails.send({
    from: serverEnv.RESEND_FROM_EMAIL,
    to: [email],
    subject: 'Restablece tu contraseña de Total Bri',
    text: `Recibimos una solicitud para restablecer tu contraseña.\n\nCrea una nueva aquí: ${resetUrl.toString()}\n\nEste enlace expira en 1 hora. Si no solicitaste esto, ignora este correo.`,
  });
}
