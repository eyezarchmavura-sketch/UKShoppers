import { describe, expect, it } from "vitest";
import { homepageDealsWatch } from "./dealsWatch";

describe("homepageDealsWatch", () => {
  it("takes customers to reviewed deal destinations without asserting an unverified discount", () => {
    expect(homepageDealsWatch.primaryHref).toBe("#retailer-deals");
    expect(homepageDealsWatch.secondaryHref).toBe("/stores");
    expect(`${homepageDealsWatch.title} ${homepageDealsWatch.description} ${homepageDealsWatch.assurance}`).not.toMatch(/\d+%/);
  });
});
