# Approved Deal Data Sources — Research Notes

## Purpose

This note records the source-model research for UK Shoppers Africa’s proposed rotating product-deals feature. It does **not** authorize web scraping, automatic public publishing, or any current retailer claim.

## Findings

| Source | Relevant capability | Access and operating implication |
|---|---|---|
| [Rakuten Advertising Product Catalog](https://pubhelp.rakutenadvertising.com/hc/en-us/articles/4412243602189-Product-Catalog-Overview) | Provides approved publishers with dynamic advertiser product information and secure product links. Advertisers may provide promotion, season, sale and holiday-specific feeds. | Publisher must request technical setup and receive advertiser-by-advertiser feed approval. The feed requires SFTP download and XML or pipe-delimited processing. Rakuten describes daily updates; this alone does not justify hourly polling. |
| [Awin Product Data Feed guidance](https://success.awin.com/s/article/What-is-a-Product-Data-Feed) | Awin describes advertiser-provided product information available through approved publisher partnerships. | An authenticated publisher account and retailer approval are required. Retrieval cadence, permitted display fields, price freshness, imagery, attribution and deep-link terms must be set by the specific partner agreement. |
| [impact.com REST API overview](https://impact.com/partnerships/get-connected-with-rest-api/) | Describes REST APIs for partnership-system integration, including data exchange, automation and partner reporting. | Credentials, a contract and documented endpoint permissions are required before implementation. This article is a platform overview, not evidence that a particular UK retailer offers a public product/deals endpoint. |

## Primary documentation check — 27 August 2026

### Awin

Awin’s developer documentation describes a product feed as a regularly updated advertiser data file that can include product names, prices, availability, descriptions, images and attributes. It identifies Awin-format feeds as intended for content, voucher, cashback and comparison partners, and separately documents a Google-format feed API for advertisers. This supports Awin as a viable **publisher-feed candidate**, but it does not establish access to any particular UK retailer: UK Shoppers Africa still needs an authenticated publisher account, approved advertiser relationships, the retailer’s terms and confirmed permission for every field shown publicly. [6]

### Rakuten Advertising

Rakuten Advertising’s public developer site exposes Product Search, Offers, Partnerships, Deep Link and Access Tokens documentation routes, indicating that these are part of its affiliate API catalogue. The page body did not expose the detailed access and rate-limit content to the unauthenticated research session, so the platform must obtain the publisher account documentation and confirm advertiser-specific catalogue entitlement before treating Rakuten as an active product source. The existing Rakuten Product Catalog source record remains the more specific published evidence for partner-approved catalogue data. [1] [7]

Rakuten’s Product Catalog implementation guidance describes two distinct approvals: technical product-catalog setup and approval by each participating advertiser to use its catalogue on the publisher’s website or blog. It requires a publisher implementation capable of downloading from its SFTP account and processing XML or pipe-delimited files. Catalogues are dynamically generated when retrieved; their actual freshness still depends on each advertiser’s upload frequency. This makes Rakuten technically suitable for the planned private ingestion model, but an hourly task must be conditional on retailer approval and incoming source changes—not presented as proof that every retailer refreshes prices hourly. [10]

### impact.com

impact.com’s partner help centre states that product catalogues can be downloaded through the partner account, FTP or API. It describes an account view with catalogue details including its last-updated time, while noting that the platform synchronises brand API changes once a day. This makes impact.com a valid catalogue/feed candidate, but its stated daily synchronisation means an hourly request would usually re-check the most recent authorised data rather than assume an hour-by-hour retailer-price update. Partner access and each brand’s content rights remain prerequisites. [8]

### Retailer-fit evidence — LOOKFANTASTIC UK on Awin

The public LOOKFANTASTIC UK Awin merchant profile invites publishers to join its programme, refers to affiliate promotions and explicitly instructs relevant partners to use **Awin feeds only** rather than scrape LOOKFANTASTIC sites. This is direct evidence that Awin is the strongest first provider to pursue for UK Shoppers Africa’s beauty, skincare and haircare priority, subject to publisher onboarding and acceptance into the individual merchant programme. The platform will not display the listed commission rates or promotional claims as customer offers; they are programme terms, not customer price evidence. [9]

### Retailer-fit evidence — M&S UK on Awin

The public M&S UK merchant profile invites publishers to join the programme, states that dedicated feeds are available, and identifies an M&S product feed made available through the publisher’s Awin account and an associated EasyFeed platform after login. It also identifies women’s clothing, lingerie, beauty, flowers and gifts among the M&S range, closely matching the platform’s women-first shopping and gifting priorities. The profile says publisher applications are considered weekly and aims to respond within 14 days; this is an indicative merchant statement, not a guaranteed onboarding timeline. [11]

### Additional priority-retailer checks

Superdrug and Nike publish official affiliate-programme pages, supporting the existence of a direct commercial-partnership route for beauty and footwear. The sources reviewed do not confirm a product-feed API, current network assignment or approval terms for UK Shoppers Africa, so neither retailer is marked as an active feed candidate. Public third-party listings associate ASOS with several networks, but those are not a substitute for an advertiser’s current official partner approval. [12] [13]

## Design Conclusion

The correct production pattern is **approved feed/API → staging → automated validation and deduplication → staff approval → timed public rotation**. The app must not scrape retailer storefront pages or automatically present a price, discount percentage, image, availability or promotion unless the designated feed/partner terms permit it and the item passes validity checks.

The hourly request should therefore be interpreted as an **hourly refresh check**, not an hourly unreviewed public upload. The execution should persist cursors, feed timestamp, source URL, permitted content fields, validation state, approval state, expiry and withdrawal reason. Product refreshes must be idempotent and must fall back to the last known valid approved item or a truthful empty state.

## Partner Advertising Requirement

Paid partner placements must be obviously identifiable to customers. The UK Advertising Standards Authority states that labels such as **Ad**, **Advert**, **Advertising**, **Advertisement** and **Ad Feature** are likely to be acceptable for advertising features. The CAP Code’s recognition rules require marketing communications to be obviously identifiable as such. UK Shoppers Africa should therefore show a visible `Sponsored`/`Ad` label on every paid placement, retain the advertiser identity and campaign approval record, and prevent an advert from being confused with independently verified retailer deals.

## References

1. Rakuten Advertising, “Product Catalog Overview,” last edited 22 July 2026: https://pubhelp.rakutenadvertising.com/hc/en-us/articles/4412243602189-Product-Catalog-Overview
2. Awin Success Centre, “What is a Product Data Feed?”: https://success.awin.com/s/article/What-is-a-Product-Data-Feed
3. impact.com, “Get connected: The benefits of REST APIs and how to use them in partnership marketing”: https://impact.com/partnerships/get-connected-with-rest-api/
4. ASA, “Recognising ads: Advertisement features”: https://www.asa.org.uk/advice-online/recognising-ads-advertisement-features.html
5. ASA, “Recognition of marketing communications”: https://www.asa.org.uk/type/non_broadcast/code_section/02.html
6. Awin Developers, “Introduction,” updated 2 April 2026: https://help.awin.com/developers/docs/introduction-1
7. Rakuten Advertising Developers, “Product Search API”: https://developers.rakutenadvertising.com/guides/product_search
8. impact.com Help Center, “Download Product Catalogs as a Partner,” updated 30 July 2026: https://help.impact.com/partner/what-would-you-like-to-learn-about/platform-features/marketing-content/product-marketplace-and-catalogs/download-product-catalogs-as-a-partner
9. Awin, “LOOKFANTASTIC UK Affiliate Programme”: https://ui.awin.com/merchant-profile/2082
10. Rakuten Advertising Publisher Help Center, “Product Catalog Data Feed Implementation Guidelines,” last edited 9 July 2025: https://pubhelp.rakutenadvertising.com/hc/en-us/articles/11258487715981-Product-Catalog-Data-Feed-Implementation-Guidelines
11. Awin, “Marks and Spencer UK Affiliate Programme”: https://ui.awin.com/merchant-profile/1402
12. Superdrug, “Work With Us | Superdrug Affiliate”: https://www.superdrug.com/affiliate
13. Nike, “Nike Affiliate Programme”: https://www.nike.com/gb/help/a/nike-affiliate-programme
