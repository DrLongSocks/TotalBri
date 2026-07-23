import { describe, expect, it } from 'vitest';
import { isInviteValid } from './token';

const now = new Date('2026-01-15T00:00:00Z');

describe('isInviteValid', () => {
  it('is valid when unused and not yet expired', () => {
    expect(isInviteValid({ expiresAt: new Date('2026-01-16T00:00:00Z'), usedAt: null }, now)).toBe(
      true,
    );
  });

  it('is invalid once used, even if not expired', () => {
    expect(
      isInviteValid(
        { expiresAt: new Date('2026-01-16T00:00:00Z'), usedAt: new Date('2026-01-14T00:00:00Z') },
        now,
      ),
    ).toBe(false);
  });

  it('is invalid once expired', () => {
    expect(isInviteValid({ expiresAt: new Date('2026-01-14T00:00:00Z'), usedAt: null }, now)).toBe(
      false,
    );
  });

  it('is invalid exactly at the expiry instant', () => {
    expect(isInviteValid({ expiresAt: now, usedAt: null }, now)).toBe(false);
  });
});
