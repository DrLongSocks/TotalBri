import 'server-only';
import nodemailer from 'nodemailer';
import { serverEnv } from '@/lib/env.server';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: serverEnv.GMAIL_USER, pass: serverEnv.GMAIL_APP_PASSWORD },
});

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string | string[];
  subject: string;
  text: string;
}) {
  await transporter.sendMail({ from: serverEnv.GMAIL_USER, to, subject, text });
}
