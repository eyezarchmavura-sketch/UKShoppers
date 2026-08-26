import { describe, expect, it } from "vitest";
import { officialDealDestinations } from "./officialDealDestinations";

describe("officialDealDestinations", () => {
  it("contains unique HTTPS links to the configured retailer-owned domains", () => {
    const urls = officialDealDestinations.map((deal) => new URL(deal.url));

    expect(new Set(urls.map((url) => url.toString())).size).toBe(officialDealDestinations.length);
    expect(urls.every((url) => url.protocol === "https:")).toBe(true);
    expect(urls.map((url) => url.hostname)).toEqual([
      "www.asos.com",
      "www.lookfantastic.com",
      "www.superdrug.com",
      "www.marksandspencer.com",
    ]);
  });

  it("describes product areas without publishing unsupported price or percentage claims", () => {
    for (const destination of officialDealDestinations) {
      expect(destination.retailer).not.toHaveLength(0);
      expect(destination.title).not.toHaveLength(0);
      expect(destination.categories).not.toHaveLength(0);
      expect(destination.source).toMatch(/^Official /);
      expect(`${destination.title} ${destination.categories}`).not.toMatch(/\d+%|£\d|coupon|code/i);
    }
  });
});
