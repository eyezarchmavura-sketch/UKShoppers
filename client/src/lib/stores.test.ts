import { describe, expect, it } from "vitest";
import { filterStores } from "./stores";

describe("filterStores", () => {
  it("finds retailers by name, domain, category, and catalogue note", () => {
    expect(filterStores("amazon", "All").map((store) => store.name)).toContain("Amazon UK");
    expect(filterStores("kitchen", "All").map((store) => store.name)).toContain("Lakeland");
  });

  it("combines category and keyword filters", () => {
    expect(filterStores("nike", "Fashion").map((store) => store.name)).toEqual(["Nike UK"]);
    expect(filterStores("nike", "Electronics")).toEqual([]);
  });

  it("maps common product intents to the relevant verified retailer category", () => {
    expect(filterStores("running shoes", "Sport & Outdoors").map((store) => store.name))
      .toEqual(["Sports Direct", "JD Sports", "Decathlon UK"]);
    expect(filterStores("skincare", "All").map((store) => store.name))
      .toContain("Boots");
  });
});
