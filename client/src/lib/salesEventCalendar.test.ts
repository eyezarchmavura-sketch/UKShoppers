import { describe, expect, it } from "vitest";
import { formatShoppingEventDate, getUpcomingShoppingEvents } from "./salesEventCalendar";

describe("sales event calendar", () => {
  it("returns the next three standard retail-calendar events in chronological order", () => {
    const events = getUpcomingShoppingEvents(new Date("2026-08-26T00:00:00.000Z"));

    expect(events.map((event) => event.id)).toEqual(["black-friday", "cyber-monday", "boxing-day"]);
    expect(events.map((event) => event.date.toISOString().slice(0, 10))).toEqual([
      "2026-11-27",
      "2026-11-30",
      "2026-12-26",
    ]);
  });

  it("rolls forward to the following year once the current calendar has passed", () => {
    const events = getUpcomingShoppingEvents(new Date("2026-12-27T00:00:00.000Z"));

    expect(events[0]?.date.toISOString().slice(0, 10)).toBe("2027-11-26");
    expect(formatShoppingEventDate(events[0]!.date)).toContain("2027");
  });
});
