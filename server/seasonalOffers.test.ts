import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: Partial<AuthenticatedUser> = {}): TrpcContext {
  const base: AuthenticatedUser = {
    id: 9090,
    openId: "seasonal-offers-test-user",
    email: "offers@example.com",
    name: "Offer Test User",
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

describe("seasonal offers access and validation", () => {
  it("allows anyone to read only the public verified-offers projection", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.offers.listPublic()).resolves.toEqual(expect.any(Array));
  });

  it("prevents customers from reading the staff offer register", async () => {
    const caller = appRouter.createCaller(createContext({ role: "user" }));
    await expect(caller.offers.listForOperations()).rejects.toThrow(/Staff access/);
  });

  it("rejects malformed offer links before an offer can be saved", async () => {
    const caller = appRouter.createCaller(createContext({ role: "staff" }));
    await expect(caller.offers.create({
      storeName: "ASOS",
      title: "Verified seasonal promotion",
      details: "Terms checked against the official retailer page.",
      offerUrl: "not-a-url",
      couponCode: null,
      validFrom: null,
      validUntil: null,
      status: "draft",
    })).rejects.toThrow();
  });

  it("does not allow staff to publish without source evidence, terms, and a future expiry", async () => {
    const caller = appRouter.createCaller(createContext({ role: "staff" }));
    await expect(caller.offers.create({
      storeName: "ASOS",
      title: "Verified seasonal promotion",
      details: "Terms checked against the official retailer page.",
      sourceType: null,
      sourceUrl: null,
      termsSummary: null,
      linkType: "direct",
      offerUrl: null,
      couponCode: null,
      validFrom: null,
      validUntil: null,
      status: "published",
    })).rejects.toThrow(/required before publishing/);
  });

  it("does not allow staff to announce an upcoming campaign without a confirmed future start date", async () => {
    const caller = appRouter.createCaller(createContext({ role: "staff" }));
    await expect(caller.offers.create({
      storeName: "ASOS",
      title: "Confirmed future campaign",
      details: "Terms checked against the official retailer campaign page.",
      sourceType: "official_retailer",
      sourceUrl: "https://www.asos.com/",
      termsSummary: "The retailer has not yet published a customer-facing end date.",
      linkType: "direct",
      offerUrl: "https://www.asos.com/",
      couponCode: null,
      validFrom: null,
      validUntil: null,
      status: "upcoming",
    })).rejects.toThrow(/future start date/);
  });

  it("does not allow staff to make a campaign live before its confirmed start date", async () => {
    const caller = appRouter.createCaller(createContext({ role: "staff" }));
    await expect(caller.offers.create({
      storeName: "ASOS",
      title: "Confirmed future campaign",
      details: "Terms checked against the official retailer campaign page.",
      sourceType: "official_retailer",
      sourceUrl: "https://www.asos.com/",
      termsSummary: "The customer-facing campaign terms are published on the retailer page.",
      linkType: "direct",
      offerUrl: "https://www.asos.com/",
      couponCode: null,
      validFrom: Date.now() + 86_400_000,
      validUntil: Date.now() + 172_800_000,
      status: "published",
    })).rejects.toThrow(/cannot go live before its confirmed start date/);
  });

  it("limits deletion of seasonal-offer records to administrators", async () => {
    const caller = appRouter.createCaller(createContext({ role: "staff" }));
    await expect(caller.offers.delete({ id: 1 })).rejects.toThrow(/permission/);
  });
});
