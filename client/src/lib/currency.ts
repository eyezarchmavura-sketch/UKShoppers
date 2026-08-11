/* UK Shoppers Africa — automatic currency conversion
   Demo rates (Aug 2026 approximations). In production these would be fetched
   from a live FX API (e.g. Open Exchange Rates) server-side before display. */

export interface LocalCurrency {
  code: "TZS" | "KES" | "UGX" | "RWF";
  name: string;
  symbol: string;
  flag: string;
  rate: number; // local units per 1 GBP
  decimals: 0;
}

export const DESTINATIONS: Record<string, LocalCurrency> = {
  TZ: { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", flag: "🇹🇿", rate: 3390, decimals: 0 },
  KE: { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪", rate: 1780, decimals: 0 },
  UG: { code: "UGX", name: "Ugandan Shilling", symbol: "USh", flag: "🇺🇬", rate: 6150, decimals: 0 },
  RW: { code: "RWF", name: "Rwandan Franc", symbol: "RF", flag: "🇷🇼", rate: 1840, decimals: 0 },
};

export const DESTINATION_LABELS: Record<string, string> = {
  TZ: "Tanzania",
  KE: "Kenya",
  UG: "Uganda",
  RW: "Rwanda",
};

/** Format GBP → local currency amount. */
export function gbpToLocal(gbp: number, dest: LocalCurrency): string {
  const local = Math.round(gbp * dest.rate);
  return `${dest.symbol} ${local.toLocaleString("en-GB")}`;
}

/** Full currency display, e.g. "£132.49 (TSh 448,534)" */
export function gbpWithLocal(gbp: number, dest: LocalCurrency): string {
  return `£${gbp.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${gbpToLocal(gbp, dest)})`;
}
