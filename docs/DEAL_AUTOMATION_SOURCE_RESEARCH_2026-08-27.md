# Approved Deal Data Sources — Research Notes

## Purpose

This note records the source-model research for UK Shoppers Africa’s proposed rotating product-deals feature. It does **not** authorize web scraping, automatic public publishing, or any current retailer claim.

## Findings

| Source | Relevant capability | Access and operating implication |
|---|---|---|
| [Rakuten Advertising Product Catalog](https://pubhelp.rakutenadvertising.com/hc/en-us/articles/4412243602189-Product-Catalog-Overview) | Provides approved publishers with dynamic advertiser product information and secure product links. Advertisers may provide promotion, season, sale and holiday-specific feeds. | Publisher must request technical setup and receive advertiser-by-advertiser feed approval. The feed requires SFTP download and XML or pipe-delimited processing. Rakuten describes daily updates; this alone does not justify hourly polling. |
| [Awin Product Data Feed guidance](https://success.awin.com/s/article/What-is-a-Product-Data-Feed) | Awin describes advertiser-provided product information available through approved publisher partnerships. | An authenticated publisher account and retailer approval are required. Retrieval cadence, permitted display fields, price freshness, imagery, attribution and deep-link terms must be set by the specific partner agreement. |
| [impact.com REST API overview](https://impact.com/partnerships/get-connected-with-rest-api/) | Describes REST APIs for partnership-system integration, including data exchange, automation and partner reporting. | Credentials, a contract and documented endpoint permissions are required before implementation. This article is a platform overview, not evidence that a particular UK retailer offers a public product/deals endpoint. |

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
