import { describe, expect, it } from "vitest";
import { decideRefreshDisposition } from "./dealRefreshSchedule";

describe("deal source scheduled refresh disposition", () => {
  it("never refreshes unapproved or disabled sources", () => {
    expect(decideRefreshDisposition({ id: 1, providerKind: "approved_api", status: "draft", enabled: "yes" })).toEqual({ kind: "skip", reason: "source-not-approved" });
    expect(decideRefreshDisposition({ id: 1, providerKind: "approved_api", status: "approved", enabled: "no" })).toEqual({ kind: "skip", reason: "source-paused" });
  });

  it("keeps manual sources and unconfigured commercial source types from fetching", () => {
    expect(decideRefreshDisposition({ id: 1, providerKind: "manual", status: "approved", enabled: "yes" })).toEqual({ kind: "skip", reason: "manual-source" });
    expect(decideRefreshDisposition({ id: 1, providerKind: "affiliate_feed", status: "approved", enabled: "yes" })).toEqual({ kind: "skip", reason: "provider-adapter-not-configured" });
  });

  it("does not make an approved API source fetchable before an adapter is deliberately installed", () => {
    expect(decideRefreshDisposition({ id: 1, providerKind: "approved_api", status: "approved", enabled: "yes" })).toEqual({ kind: "skip", reason: "provider-adapter-not-configured" });
  });
});
