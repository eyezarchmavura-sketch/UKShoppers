import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { calculateVerifiedDiscountPercent, canPublishDeal, canShowSponsoredCampaign, isSafeExternalHttpsUrl } from "./dealAdsGovernance";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: Partial<AuthenticatedUser> = {}): TrpcContext {
  const base: AuthenticatedUser = {
    id: 9191,
    openId: "deal-ads-governance-test-user",
    email: "governance@example.com",
    name: "Governance Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user: { ...base, ...user },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("deal and advertising governance", () => {
  const now = new Date("2026-08-27T12:00:00.000Z");

  it("accepts only external HTTPS destinations without embedded or local credentials", () => {
    expect(isSafeExternalHttpsUrl("https://www.asos.com/women/sale/")).toBe(true);
    expect(isSafeExternalHttpsUrl("http://www.asos.com/women/sale/")).toBe(false);
    expect(isSafeExternalHttpsUrl("https://user:password@example.com/")).toBe(false);
    expect(isSafeExternalHttpsUrl("https://127.0.0.1/private")).toBe(false);
  });

  it("computes a percentage only from a genuine source-verified price reduction", () => {
    expect(calculateVerifiedDiscountPercent("75.00", "100.00")).toBe(25);
    expect(calculateVerifiedDiscountPercent("100.00", "75.00")).toBeNull();
    expect(calculateVerifiedDiscountPercent("75", null)).toBeNull();
  });

  it("never permits an unverified or expired deal candidate to become public", () => {
    const candidate = {
      status: "published" as const,
      productUrl: "https://www.asos.com/women/sale/",
      sourceUrl: "https://www.asos.com/women/sale/",
      termsSummary: "Offer and availability remain subject to the retailer terms.",
      verifiedAt: now,
      expiresAt: new Date(now.getTime() + 3_600_000),
    };
    expect(canPublishDeal(candidate, now)).toBe(true);
    expect(canPublishDeal({ ...candidate, verifiedAt: null }, now)).toBe(false);
    expect(canPublishDeal({ ...candidate, expiresAt: new Date(now.getTime() - 1) }, now)).toBe(false);
  });

  it("only shows a complete active sponsored campaign from an active advertiser", () => {
    const campaign = {
      campaignStatus: "live" as const,
      advertiserStatus: "active" as const,
      startsAt: new Date(now.getTime() - 1),
      endsAt: new Date(now.getTime() + 3_600_000),
      title: "Partner service announcement",
      body: "A clearly disclosed message from an approved commercial partner.",
      ctaLabel: "Visit partner",
      destinationUrl: "https://example.com/partner",
      creativeUrl: "https://example.com/creative.jpg",
      creativeAltText: "Partner brand announcement graphic",
    };
    expect(canShowSponsoredCampaign(campaign, now)).toBe(true);
    expect(canShowSponsoredCampaign({ ...campaign, advertiserStatus: "prospect" }, now)).toBe(false);
    expect(canShowSponsoredCampaign({ ...campaign, campaignStatus: "scheduled" }, now)).toBe(false);
    expect(canShowSponsoredCampaign({ ...campaign, endsAt: new Date(now.getTime() - 1) }, now)).toBe(false);
  });

  it("prevents customers from opening either private operations register", async () => {
    const caller = appRouter.createCaller(createContext({ role: "user" }));
    await expect(caller.deals.listForOperations()).rejects.toThrow(/Staff access/);
    await expect(caller.advertising.listForOperations()).rejects.toThrow(/Staff access/);
  });

  it("limits advertiser identity and source governance to administrators", async () => {
    const caller = appRouter.createCaller(createContext({ role: "staff" }));
    await expect(caller.advertising.listAdvertisers()).rejects.toThrow(/permission/);
    await expect(caller.dealSources.create({
      name: "Unapproved test source",
      providerName: "Test network",
      providerKind: "manual",
      permittedFields: ["product_name"],
      status: "draft",
      enabled: "no",
    })).rejects.toThrow(/permission/);
  });

  it("rejects a non-HTTPS campaign destination before staff can create a record", async () => {
    const caller = appRouter.createCaller(createContext({ role: "staff" }));
    await expect(caller.advertising.createCampaign({
      advertiserId: 1,
      title: "Unsafe campaign",
      body: "This campaign must be rejected before any partner lookup occurs.",
      placement: "homepage_sponsor",
      ctaLabel: "Visit",
      destinationUrl: "http://example.com",
      creativeStorageKey: "ad-creatives/test/example.png",
      creativeUrl: "/manus-storage/example.png",
      creativeAltText: "Example partner creative",
      startsAt: Date.now(),
      endsAt: Date.now() + 3_600_000,
    })).rejects.toThrow(/HTTPS/);
  });
});
