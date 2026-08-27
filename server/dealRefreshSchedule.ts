import type { Express, Request, Response } from "express";
import * as db from "./db";
import { sdk } from "./_core/sdk";

type ScheduledSource = {
  id: number;
  providerKind: "manual" | "affiliate_feed" | "approved_api";
  status: "draft" | "approved" | "paused" | "disabled";
  enabled: "no" | "yes";
};

export type RefreshDisposition =
  | { kind: "skip"; reason: "source-not-approved" | "source-paused" | "manual-source" | "provider-adapter-not-configured" }
  | { kind: "refresh" };

/**
 * Defines the safe runtime state before any provider-specific adapter exists.
 * The application intentionally refuses to fetch retailer pages or use source
 * credentials from the database. A future approved adapter must replace the
 * provider-adapter-not-configured path after its contract is recorded.
 */
export function decideRefreshDisposition(source: ScheduledSource): RefreshDisposition {
  if (source.status !== "approved") return { kind: "skip", reason: "source-not-approved" };
  if (source.enabled !== "yes") return { kind: "skip", reason: "source-paused" };
  if (source.providerKind === "manual") return { kind: "skip", reason: "manual-source" };
  return { kind: "skip", reason: "provider-adapter-not-configured" };
}

function errorSummary(error: unknown) {
  return error instanceof Error ? error.message.slice(0, 1024) : "Unknown scheduled refresh error";
}

async function handleDealSourceRefresh(req: Request, res: Response) {
  let taskUid: string | undefined;
  let sourceId: number | undefined;
  let runId: number | undefined;
  let leaseExpiresAt: Date | undefined;
  try {
    const user = await sdk.authenticateRequest(req);
    taskUid = user.taskUid;
    if (!user.isCron || !taskUid) return res.status(403).json({ error: "cron-only" });

    // `taskUid` is provided by authenticated cron identity, never request body.
    const source = await db.getDealSourceByScheduleTaskUid(taskUid);
    if (!source) return res.status(200).json({ ok: true, skipped: "orphan" });

    sourceId = source.id;
    leaseExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const acquired = await db.acquireDealSourceRefreshLease(source.id, leaseExpiresAt);
    if (!acquired) return res.status(200).json({ ok: true, skipped: "already-running" });

    const startedAt = new Date();
    await db.updateDealSource(source.id, { lastRefreshStartedAt: startedAt, lastRefreshError: null });
    const run = await db.createDealRefreshRun({ sourceId: source.id, status: "started" });
    runId = run.id;
    const disposition = decideRefreshDisposition(source);

    if (disposition.kind === "skip") {
      await db.finishDealRefreshRun(run.id, {
        status: "skipped",
        completedAt: new Date(),
        errorSummary: disposition.reason,
      });
      return res.status(200).json({ ok: true, skipped: disposition.reason });
    }

    // This branch is unreachable until an explicitly approved API/feed adapter
    // is added. Do not replace it with retailer-site browsing or scraping.
    return res.status(200).json({ ok: true, skipped: "provider-adapter-not-configured" });
  } catch (error) {
    const summary = errorSummary(error);
    if (runId) {
      await db.finishDealRefreshRun(runId, { status: "failed", completedAt: new Date(), errorSummary: summary }).catch(() => undefined);
    }
    if (sourceId) {
      await db.updateDealSource(sourceId, { lastRefreshError: summary }).catch(() => undefined);
    }
    console.error("[DealRefreshSchedule] Scheduled refresh failed", { taskUid, error });
    return res.status(500).json({
      error: summary,
      stack: error instanceof Error ? error.stack : undefined,
      context: { path: req.path, taskUid: taskUid ?? null },
      timestamp: new Date().toISOString(),
    });
  } finally {
    if (sourceId && leaseExpiresAt) {
      await db.releaseDealSourceRefreshLease(sourceId, leaseExpiresAt).catch(error => {
        console.error("[DealRefreshSchedule] Could not release refresh lease", { sourceId, error });
      });
    }
  }
}

export function registerDealRefreshScheduleRoutes(app: Express) {
  app.post("/api/scheduled/deal-source-refresh", handleDealSourceRefresh);
}
