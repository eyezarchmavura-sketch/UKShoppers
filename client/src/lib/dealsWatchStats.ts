export type PublicOfferStatus = "published" | "upcoming";

export type OfferStatusSummary = {
  live: string;
  upcoming: string;
  retailerDestinations: string;
  isAvailable: boolean;
};

export function getOfferStatusSummary(
  offers: readonly { status: PublicOfferStatus }[],
  retailerDestinationCount: number,
  hasError = false,
): OfferStatusSummary {
  if (hasError) {
    return {
      live: "—",
      upcoming: "—",
      retailerDestinations: String(retailerDestinationCount),
      isAvailable: false,
    };
  }

  return {
    live: String(offers.filter((offer) => offer.status === "published").length),
    upcoming: String(offers.filter((offer) => offer.status === "upcoming").length),
    retailerDestinations: String(retailerDestinationCount),
    isAvailable: true,
  };
}
