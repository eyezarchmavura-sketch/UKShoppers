export type DealPublicationRecord = {
  status: "staged" | "approved" | "published" | "withdrawn" | "expired" | "rejected";
  productUrl?: string | null;
  sourceUrl?: string | null;
  termsSummary?: string | null;
  verifiedAt?: Date | null;
  expiresAt?: Date | null;
};

export type SponsoredCampaignRecord = {
  campaignStatus: "draft" | "submitted" | "approved" | "scheduled" | "live" | "paused" | "ended" | "rejected" | "withdrawn";
  advertiserStatus: "prospect" | "active" | "blocked";
  startsAt?: Date | null;
  endsAt?: Date | null;
  title?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  destinationUrl?: string | null;
  creativeUrl?: string | null;
  creativeAltText?: string | null;
};

function isPrivateOrLocalHostname(hostname: string) {
  const normalized = hostname.toLowerCase();
  if (normalized === "localhost" || normalized.endsWith(".localhost") || normalized === "::1") return true;
  if (/^127\./.test(normalized) || /^0\./.test(normalized) || /^10\./.test(normalized)) return true;
  if (/^192\.168\./.test(normalized) || /^169\.254\./.test(normalized)) return true;
  const secondOctet = Number(normalized.split(".")[1]);
  return /^172\./.test(normalized) && Number.isFinite(secondOctet) && secondOctet >= 16 && secondOctet <= 31;
}

/** Permits only external HTTPS destinations without embedded credentials. */
export function isSafeExternalHttpsUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password && !isPrivateOrLocalHostname(parsed.hostname);
  } catch {
    return false;
  }
}

function parseVerifiedAmount(value: string | null | undefined): number | null {
  if (!value || !/^\d+(?:\.\d{1,2})?$/.test(value.trim())) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * A discount is shown only when two positive source-verified prices show a
 * genuine reduction. Values are rounded to the nearest whole percent.
 */
export function calculateVerifiedDiscountPercent(
  currentPrice: string | null | undefined,
  previousPrice: string | null | undefined,
): number | null {
  const current = parseVerifiedAmount(currentPrice);
  const previous = parseVerifiedAmount(previousPrice);
  if (current === null || previous === null || current >= previous) return null;
  const percentage = Math.round((1 - current / previous) * 100);
  return percentage > 0 && percentage < 100 ? percentage : null;
}

/** Public placement requires evidence, clear customer terms, and a live validity window. */
export function canPublishDeal(record: DealPublicationRecord, now = new Date()): boolean {
  return record.status === "published"
    && isSafeExternalHttpsUrl(record.productUrl)
    && isSafeExternalHttpsUrl(record.sourceUrl)
    && Boolean(record.termsSummary?.trim())
    && Boolean(record.verifiedAt)
    && Boolean(record.expiresAt && record.expiresAt > now);
}

/** Sponsored content is separately labelled in the UI and only shown while an active advertiser campaign is live. */
export function canShowSponsoredCampaign(record: SponsoredCampaignRecord, now = new Date()): boolean {
  return record.campaignStatus === "live"
    && record.advertiserStatus === "active"
    && Boolean(record.startsAt && record.startsAt <= now)
    && Boolean(record.endsAt && record.endsAt > now)
    && Boolean(record.title?.trim() && record.body?.trim() && record.ctaLabel?.trim())
    && isSafeExternalHttpsUrl(record.destinationUrl)
    && isSafeExternalHttpsUrl(record.creativeUrl)
    && Boolean(record.creativeAltText?.trim());
}
