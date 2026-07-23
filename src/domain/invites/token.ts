export function isInviteValid(invite: { expiresAt: Date; usedAt: Date | null }, now: Date): boolean {
  return invite.usedAt === null && invite.expiresAt > now;
}
