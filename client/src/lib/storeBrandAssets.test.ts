import { describe, expect, it } from "vitest";
import { getStoreBrandLogo } from "./storeBrandAssets";
import { stores } from "./stores";

describe("store brand assets", () => {
  it("provides a visible brand asset for every supported retailer", () => {
    expect(stores.filter((store) => !getStoreBrandLogo(store.name)).map((store) => store.name)).toEqual([]);
  });

  it("uses managed asset URLs for all supported retailer logos", () => {
    stores.forEach((store) => {
      expect(getStoreBrandLogo(store.name)).toMatch(/^\/manus-storage\//);
    });
  });
});
