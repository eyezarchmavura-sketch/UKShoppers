import { describe, expect, it } from "vitest";
import { buildStoreDirectoryHref, getStoreDirectoryFilters } from "./storeDirectoryQuery";

describe("store directory discovery links", () => {
  it("builds a clean directory path when no discovery filters are selected", () => {
    expect(buildStoreDirectoryHref("   ", "All")).toBe("/stores");
  });

  it("preserves a customer search and category for the directory handoff", () => {
    expect(buildStoreDirectoryHref("running shoes", "Sport & Outdoors"))
      .toBe("/stores?q=running+shoes&category=Sport+%26+Outdoors");
  });

  it("reads optional discovery filters from the store-directory URL", () => {
    expect(getStoreDirectoryFilters("?q=skin+care&category=Beauty+%26+Health")).toEqual({
      searchTerm: "skin care",
      category: "Beauty & Health",
    });
  });
});
