import 'server-only';
import { serverEnv } from '@/lib/env.server';
import { sendEmail } from './mailer';

const roleLabels = { admin: 'administrador', worker: 'trabajador' } as const;

export async function sendInviteEmail({
  email,
  role,
  token,
}: {
  email: string;
  role: 'admin' | 'worker';
  token: string;
}) {
  const acceptUrl = new URL('/admin/invite/accept', serverEnv.AUTH_URL);
  acceptUrl.searchParams.set('token', token);

  await sendEmail({
    to: email,
    subject: 'Invitación al panel de Total Bri',
    text: `Fuiste invitado al panel de Total Bri como ${roleLabels[role]}.\n\nCrea tu cuenta aquí: ${acceptUrl.toString()}\n\nEste enlace expira en 7 días.`,
  });
}
