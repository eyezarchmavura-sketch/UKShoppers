import { describe, expect, it } from "vitest";
import { getRetailerUrl } from "./retailerLinks";

describe("getRetailerUrl", () => {
  it("creates an HTTPS URL for a supported retailer domain", () => {
    expect(getRetailerUrl("amazon.co.uk")).toBe("https://www.amazon.co.uk");
    expect(getRetailerUrl("nike.com/gb")).toBe("https://www.nike.com/gb");
  });

  it("normalizes accidental protocol and www prefixes", () => {
    expect(getRetailerUrl("https://www.boots.com")).toBe("https://www.boots.com");
  });

  it("rejects malformed outbound-domain values", () => {
    expect(() => getRetailerUrl("not a domain")).toThrow("supported retailer domain");
  });
});
