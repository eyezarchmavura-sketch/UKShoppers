export type ShoppingEvent = {
  id: "black-friday" | "cyber-monday" | "boxing-day";
  title: string;
  date: Date;
  preparation: string;
  category: "Fashion" | "Beauty & Health" | "Electronics";
};

function lastFridayOfNovember(year: number) {
  const lastDay = new Date(Date.UTC(year, 10, 30));
  const daysBackToFriday = (lastDay.getUTCDay() + 2) % 7;
  return new Date(Date.UTC(year, 10, 30 - daysBackToFriday));
}

export function getUpcomingShoppingEvents(referenceDate = new Date()): ShoppingEvent[] {
  const startYear = referenceDate.getUTCFullYear();
  const events: ShoppingEvent[] = [];

  for (const year of [startYear, startYear + 1]) {
    const blackFriday = lastFridayOfNovember(year);
    events.push(
      {
        id: "black-friday",
        title: "Black Friday season",
        date: blackFriday,
        preparation: "Create a fashion, shoes or beauty shortlist before retailer terms are announced.",
        category: "Fashion",
      },
      {
        id: "cyber-monday",
        title: "Cyber Monday",
        date: new Date(blackFriday.getTime() + 3 * 24 * 60 * 60 * 1000),
        preparation: "Keep exact product links ready for online departments and staff review.",
        category: "Electronics",
      },
      {
        id: "boxing-day",
        title: "Boxing Day shopping",
        date: new Date(Date.UTC(year, 11, 26)),
        preparation: "Save gift, clothing and beauty ideas, then compare official retailer terms when campaigns open.",
        category: "Beauty & Health",
      },
    );
  }

  return events
    .filter((event) => event.date.getTime() >= referenceDate.getTime())
    .sort((first, second) => first.date.getTime() - second.date.getTime())
    .slice(0, 3);
}

export function formatShoppingEventDate(date: Date, locale = "en-GB") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
