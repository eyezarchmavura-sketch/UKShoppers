import { describe, expect, it } from "vitest";
import { EXTERNAL_STAFF_INVITE_TTL_HOURS, createStaffInviteToken, getStaffInviteExpiry, hashStaffInviteToken } from "./externalStaffInvites";

describe("external staff invitations", () => {
  it("creates unique, URL-safe tokens with enough entropy for bearer-link access", () => {
    const first = createStaffInviteToken();
    const second = createStaffInviteToken();

    expect(first).toMatch(/^[A-Za-z0-9_-]{40,60}$/);
    expect(second).toMatch(/^[A-Za-z0-9_-]{40,60}$/);
    expect(second).not.toBe(first);
  });

  it("persists only a deterministic SHA-256 digest, never the raw access token", () => {
    const token = createStaffInviteToken();
    const digest = hashStaffInviteToken(token);

    expect(digest).toMatch(/^[a-f0-9]{64}$/);
    expect(digest).toBe(hashStaffInviteToken(token));
    expect(digest).not.toContain(token);
  });

  it("sets the documented 72-hour expiry window from the creation time", () => {
    const now = new Date("2026-08-19T09:00:00.000Z");
    const expiry = getStaffInviteExpiry(now);

    expect(EXTERNAL_STAFF_INVITE_TTL_HOURS).toBe(72);
    expect(expiry.toISOString()).toBe("2026-08-22T09:00:00.000Z");
  });
});
