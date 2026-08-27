import { describe, expect, it } from "vitest";
import { getOfferStatusSummary } from "./dealsWatchStats";

describe("getOfferStatusSummary", () => {
  it("counts only the published and upcoming public campaigns", () => {
    expect(
      getOfferStatusSummary(
        [{ status: "published" }, { status: "upcoming" }, { status: "published" }],
        24,
      ),
    ).toEqual({
      live: "2",
      upcoming: "1",
      retailerDestinations: "24",
      isAvailable: true,
    });
  });

  it("does not turn a failed campaign query into a fake zero", () => {
    expect(getOfferStatusSummary([], 24, true)).toEqual({
      live: "—",
      upcoming: "—",
      retailerDestinations: "24",
      isAvailable: false,
    });
  });
});
