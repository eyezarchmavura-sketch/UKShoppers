import { createHash, randomBytes } from "node:crypto";
import type { Express, Request, Response } from "express";
import { COOKIE_NAME } from "@shared/const";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { ENV } from "./_core/env";

export const EXTERNAL_STAFF_INVITE_TTL_HOURS = 72;
const EXTERNAL_STAFF_SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

/** Generates an unguessable bearer token; only its digest is persisted. */
export function createStaffInviteToken() {
  return randomBytes(32).toString("base64url");
}

export function hashStaffInviteToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getStaffInviteExpiry(now = new Date()) {
  return new Date(now.getTime() + EXTERNAL_STAFF_INVITE_TTL_HOURS * 60 * 60 * 1000);
}

function validToken(token: string) {
  return /^[A-Za-z0-9_-]{40,60}$/.test(token);
}

function inviteFailure(res: Response, message: string) {
  res.status(410).setHeader("Referrer-Policy", "no-referrer").type("text/plain").send(message);
}

export function registerExternalStaffInviteRoutes(app: Express) {
  app.get("/api/external-staff/accept/:token", async (req: Request<{ token: string }>, res) => {
    const token = req.params.token;
    if (!validToken(token)) {
      inviteFailure(res, "This staff access invitation is invalid, expired, or has been revoked.");
      return;
    }

    const invite = await db.getActiveStaffInviteByTokenHash(hashStaffInviteToken(token));
    if (!invite) {
      inviteFailure(res, "This staff access invitation is invalid, expired, or has been revoked.");
      return;
    }

    const openId = `external_staff_invite_${invite.id}`;
    await db.upsertUser({
      openId,
      name: invite.name,
      email: invite.email,
      loginMethod: "external_staff_invite",
      role: "staff",
      lastSignedIn: new Date(),
    });
    const staffUser = await db.getUserByOpenId(openId);
    if (!staffUser || staffUser.role !== "staff") {
      res.status(500).setHeader("Referrer-Policy", "no-referrer").type("text/plain").send("Staff access could not be initialized.");
      return;
    }

    await db.markStaffInviteAccepted(invite.id);
    const remainingInviteLifetime = Math.max(1, invite.expiresAt.getTime() - Date.now());
    const sessionToken = await sdk.signSession(
      { openId: staffUser.openId, appId: ENV.appId, name: staffUser.name ?? invite.name, externalInviteId: invite.id },
      { expiresInMs: Math.min(EXTERNAL_STAFF_SESSION_MAX_AGE_MS, remainingInviteLifetime) },
    );
    res.setHeader("Referrer-Policy", "no-referrer");
    res.cookie(COOKIE_NAME, sessionToken, getSessionCookieOptions(req));
    res.redirect(303, "/admin");
  });
}
