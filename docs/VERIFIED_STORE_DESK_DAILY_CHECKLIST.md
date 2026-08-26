# Verified Store Desk — Daily Offer Review Checklist

**Owner:** UK Shoppers Africa operations team  
**Purpose:** Publish a small number of current, evidence-backed UK offers for predominantly women customers without presenting stale, unsupported, or misleading savings claims.  
**Use with:** [`WOMENS_FIRST_OFFER_PUBLISHING_QUEUE.md`](./WOMENS_FIRST_OFFER_PUBLISHING_QUEUE.md) and the staff workspace at `/admin/offers`.

> **Operating rule:** An offer is not public merely because it was found online. It becomes public only when the official source, customer terms, destination, future expiry, and verification check have been captured in the staff workspace.

## Daily rhythm

| Window | Owner | Required outcome |
|---|---|---|
| Morning review | Assigned offer reviewer | Inspect the priority official retailer sources and create evidence-complete drafts only. |
| Verification pass | Reviewer or second reviewer | Re-open each proposed source, confirm it remains available, and publish only offers meeting every gate. |
| Midday sweep | Duty staff member | Re-check every live hero offer, update material changes, and withdraw expired or unclear cards. |
| End-of-day close | Duty staff member | Confirm the live list is current, record exceptions, and prepare the next source queue. |

## Morning review: source and relevance

Start with the women-first priority sequence: **ASOS, LOOKFANTASTIC, Boots, and Superdrug**. Then review Zara, Next, and M&S on their scheduled days. Open only official UK retailer pages or an approved partner-data source; do not use a social post, coupon aggregator, old screenshot, or memory as evidence.

| Check | Required action | Pass condition |
|---|---|---|
| Customer relevance | Select a campaign, product group, or offer useful for women’s fashion, beauty, skincare, haircare, shoes, bags, or occasionwear. | The offer has a clear women-first customer fit. |
| Official evidence | Copy the exact UK retailer source URL. | The page directly supports the proposed claim. |
| Current availability | Check that the price, code, campaign, or category benefit is visible now. | The source loads and shows the offer at the time of review. |
| Customer destination | Identify the official retailer destination customers should open. | The destination is HTTPS and matches the source/retailer. |
| Scope and limitations | Record exclusions, code requirements, minimum spends, stock conditions, member restrictions, and territory limits. | Material limitations are concise and understandable. |

## Draft record: required staff fields

Create a **draft** in `/admin/offers`; never publish directly from a browser tab. Every proposed record must contain all of the following.

| Field | Required standard |
|---|---|
| Retailer and headline | Use a restrained, factual description. Do not use “best,” “biggest,” or an unsupported percentage saving. |
| Official source URL | The direct official UK retailer or approved partner source that evidences the offer. |
| Customer destination URL | The official page the customer should visit, or an approved tracked partner link with disclosure. |
| Terms | Summarise meaningful conditions, exclusions, code use, and availability limits. |
| Expiry | Enter a verified future end date. If the source is “while stocks last,” set a conservative review deadline and state that availability can change. |
| Category and customer fit | Mark the category accurately so women-first offers remain easy to discover. |
| Affiliate disclosure | Mark the offer if the customer destination is a tracked partner link. |

## Publication gate: verify before making an offer visible

Before publishing, the reviewer must re-open the source and answer every question below. A single “no” or uncertainty means the offer stays a draft or is discarded.

- [ ] Does the official source still show the claimed offer or price condition?
- [ ] Is the headline factual, specific, and supported by the source?
- [ ] Are the important terms, exclusions, and expiry visible to the customer?
- [ ] Is the expiry in the future, or is a short review deadline set for limited-stock availability?
- [ ] Does the destination link point to the correct official retailer or disclosed approved partner link?
- [ ] Does the offer fit the women-first priority without excluding other customers from browsing it?
- [ ] Are no delivery, overseas availability, customs, stock, or final-price guarantees implied?
- [ ] Has the reviewer checked that the offer is not already expired, changed, or unavailable?

When every answer is “yes,” publish in `/admin/offers`. The platform records the verification time and reviewer identifier server-side. Keep the hero to **six or fewer** current cards so each one can be checked properly.

## Midday sweep: protect customer trust

Review each visible card at midday and immediately before a major campaign period. If the source no longer supports the card, the price changes materially, the conditions become unclear, or the offer expires, remove it from public view first and investigate afterward.

| Situation | Required response |
|---|---|
| Offer is expired or source is unavailable | Unpublish immediately; do not wait for the next scheduled review. |
| Retailer changes a material term | Update terms and expiry, then re-verify before republishing. |
| Customer reports a mismatch | Unpublish as a precaution, log the report, and compare the customer evidence with the official source. |
| Offer is nearly sold out or “while stocks last” | Add the stock qualifier, reduce the review deadline, or unpublish if confidence is low. |
| Affiliate link is used | Confirm the partner disclosure is visible and the destination remains correct. |

## End-of-day close

At the end of the shift, count the published cards, confirm every one remains current, and list the next sources to review. The duty staff member should record an internal note for withdrawn items, source issues, customer complaints, or uncertain terms. Do not replace an empty offer section with guesses; the existing public empty state is the correct outcome when there are no verified savings.

## Weekly review and escalation

Once each week, the operations lead reviews which retailers generated customer clicks, product requests, and verified purchases. This informs the next watchlist update, but it must not change publication standards. Escalate recurring retailer-source problems, potential affiliate partnerships, or any request for automation to the owner before implementation.

> **Four-week milestone:** After four weeks of accurate manual reviews, assess approved retailer or affiliate data feeds. Any future automation should create **drafts only**; a staff member keeps the final publication decision.
