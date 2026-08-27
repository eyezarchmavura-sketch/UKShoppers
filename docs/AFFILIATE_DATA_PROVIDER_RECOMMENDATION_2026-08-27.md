# Affiliate Data Provider Recommendation — 27 August 2026

## Decision summary

> **Recommended first provider to apply for: Awin.**

For UK Shoppers Africa’s current women-first priorities, **Awin is the best-supported first route** among the providers reviewed. Its public merchant profiles confirm both **LOOKFANTASTIC UK** and **Marks & Spencer UK** programmes, and M&S explicitly describes publisher feed access through its Awin account. LOOKFANTASTIC’s public programme terms expressly require relevant partners to use Awin feeds instead of scraping the retailer website. This is unusually direct support for the platform’s no-scraping, staff-approved operating model.[1][2]

This is a **provider recommendation, not an assertion that the platform has access**. UK Shoppers Africa must create and verify a publisher account, disclose its operating model, and be accepted into each merchant programme before importing or displaying any retailer product content.

## Evidence-led comparison

| Provider | Confirmed data-access model | Evidence relevant to UK Shoppers Africa | Strengths | Constraints and required approval | Recommendation |
|---|---|---|---|---|---|
| **Awin** | Advertiser product feeds; publisher access is governed by network and merchant programme participation | LOOKFANTASTIC UK tells relevant affiliates to use **Awin feeds only**, not retailer-page scraping. M&S describes a feed available in the publisher’s Awin account and through EasyFeed after login.[1][2] | Closest documented match to beauty, skincare, haircare, women’s fashion, gifting and seasonal merchandising | Publisher onboarding, merchant-by-merchant approval, confirmed field/image/price rights, advertiser terms | **Apply first** |
| **Rakuten Advertising** | Product Catalog via publisher SFTP/feed workflow; data is dynamically generated on retrieval | Rakuten says technical setup and approval by each participating advertiser are required, and source freshness still depends on advertiser uploads.[3] | Strong structured catalogue model for future comparison and product-card flows | Account, technical setup, advertiser approvals, XML/pipe-delimited processing, field permissions | **Evaluate second** when a priority merchant is available |
| **impact.com** | Partner catalogue download, FTP and API | impact.com documents these catalogue access modes and notes that its source synchronisation may occur daily.[4] | Viable parallel catalogue option with API/FTP paths | Partner account, individual brand entitlement, content rights; hourly checking does not promise hourly retailer updates | **Evaluate in parallel or as fallback** |

## Recommended commercial path

The most practical next move is to apply to **Awin as UK Shoppers Africa**, using a business description that accurately states the service: an East African cross-border personal-shopping and parcel-forwarding platform with a staff-reviewed UK deals area. During onboarding, request acceptance into the initial priority programmes in this order: **LOOKFANTASTIC UK**, **Marks & Spencer UK**, and any other merchants that accept the business model after review. This priority reflects documented programme availability and the platform’s core audience; it is not a claim that all three are open, approved, or suitable for promotion in every destination country.

After acceptance, obtain written or dashboard-confirmed permission for each merchant covering the exact fields intended for the customer-facing experience: product title, destination/deep link, image, current price, former price if available, currency, terms, promotion end time, geography and brand attribution. Do not show a former price, percentage reduction, stock status, product image or promotional term unless the approved source and merchant agreement permit it and the record remains fresh.

## Operating safeguards already built

The platform already has a provider-independent foundation that keeps imported records private until a staff reviewer publishes a valid record. Product candidates carry source, terms, timestamps, expiry, review and withdrawal fields. Public cards return only currently valid, reviewed deal records. The source-refresh route is cron-identity protected, task-UID bound and guarded with an expiring database lease; without a configured and approved source adapter it logs a safe skipped run. No schedule, retailer browser automation, or external feed call is active.

Sponsored partner content is a separate workflow. It requires a named advertiser, managed-storage creative reference, accessible alt text, HTTPS destination, campaign dates, staff review and a visible **Sponsored** or **Ad** label. It is not placed in checkout, payment or shipment-critical surfaces.

## Information required before integration

| Required input | Why it is required | Safe handling |
|---|---|---|
| Approved network and publisher account | Determines the permitted integration and commercial relationship | Owner confirms the provider; access details are entered only through protected settings |
| Approved merchant list | Defines which source records may be imported | Record each merchant in the staff source register with evidence and terms URL |
| Permitted fields and image rights | Prevents unauthorised use of product data or assets | Store only permission metadata in the source register; do not commit credentials |
| Customer target geographies | Applies merchant restrictions and clear eligibility messaging | Configure source-level and record-level geography rules |
| Publication policy | Sets whether staff approval remains mandatory | Recommended default: **staff approval required; no automatic public posting** |
| Refresh expectation | Determines schedule timing and freshness labels | Hourly checks only after the provider confirms the access mode and source cadence |

## Explicit non-options

Retailer-page scraping is not an approved substitute for a commercial product feed or API. It can conflict with programme terms, provides weak evidence for price claims and may copy unauthorised product content. An hourly page-scraper will **not** be added to this platform.

Likewise, the platform will not fabricate deals, discount percentages, advertiser campaigns, click totals or retailer availability to make the home page appear active. The existing official deal-destination links remain useful navigation, but do not prove individual price reductions.

## Sources

[1]: https://ui.awin.com/merchant-profile/2082 "Awin — LOOKFANTASTIC UK Affiliate Programme"
[2]: https://ui.awin.com/merchant-profile/1402 "Awin — Marks and Spencer UK Affiliate Programme"
[3]: https://pubhelp.rakutenadvertising.com/hc/en-us/articles/11258487715981-Product-Catalog-Data-Feed-Implementation-Guidelines "Rakuten Advertising — Product Catalog Data Feed Implementation Guidelines"
[4]: https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/marketing-content/product-marketplace-and-catalogs/download-product-catalogs-as-a-partner "impact.com — Download Product Catalogs as a Partner"
