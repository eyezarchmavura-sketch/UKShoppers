/**
 * Builds a safe outbound URL for the static, vetted UK retailer catalogue.
 * Retailers remain responsible for product browsing and checkout; UK Shoppers
 * Africa receives a specific product link later through the request flow.
 */
export function getRetailerUrl(domain: string): string {
  const normalizedDomain = domain
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");

  if (!normalizedDomain || /[\s@]/.test(normalizedDomain)) {
    throw new Error("A supported retailer domain is required.");
  }

  return `https://www.${normalizedDomain}`;
}
