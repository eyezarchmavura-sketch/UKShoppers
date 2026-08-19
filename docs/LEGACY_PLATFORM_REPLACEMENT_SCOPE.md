# UK Shoppers Africa: Simple Client System Replacement Scope

**Prepared by:** Manus AI  
**Date:** 19 August 2026  
**Purpose:** Convert verified legacy-platform risks into a practical, low-friction customer system for UK-to-East Africa shopping and parcel forwarding.

## Executive recommendation

The correct next step is **not** to add more catalogue pages, decorative effects, or generic e-commerce controls. The prior site already exposes a catalogue, comparison, wishlist, cart, and store navigation, but its actual service relies on human quotation and parcel forwarding. That mismatch is visible in the public customer journey and produces avoidable uncertainty about price, payment, delivery, and support.[1] [2]

UK Shoppers Africa should therefore operate as one simple, traceable workflow:

> **Choose a UK store or paste a product link → submit one purchase request → receive a staff-approved quote → pay only after approval → follow one delivery timeline → ask Queen or a human team member for help.**

The current replacement platform already contains the foundations for this approach: authenticated request intake, real order records, a staff operations queue, store discovery, multilingual entry points, per-user notifications, and an active external staff-invitation model. The remaining work should concentrate on making the high-trust steps visible, complete, and operationally repeatable rather than widening the public storefront prematurely.

## Evidence-led diagnosis

| Verified legacy issue | Why it matters to a client | System response required |
|---|---|---|
| Assisted shopping and self-forwarding are explained, but the operational call-to-action is WhatsApp.[1] [2] | A customer leaves the site before there is a request record, destination address, quote state, or tracking context. | Make the authenticated purchase-request form the canonical start point; keep WhatsApp as an assisted entry channel that creates or links to a platform request. |
| The site shows product prices, cart, wishlist, and comparison controls even though its own “How it works” content says staff provides the full quotation.[1] [2] | Shoppers may mistake a display price for an all-in payable amount. | Show **planning estimates** only; issue the payable amount through a dated, staff-approved quote with itemised inclusions and an expiry. |
| Contact details, locations, pages, and legal-policy content include generic or unrelated template material.[1] [3] [4] | Clients cannot confidently verify who will receive their money or goods. | Publish verified business contacts, service coverage, policies, and escalation routes before any payment push. Keep each legal page separate and business-specific. |
| Store and deals navigation lead to pages with no visible retailer or deal content.[5] [6] | Dead-end navigation increases abandonment and weakens trust. | Keep the existing verified store directory as the main discovery surface; show only live, sourced promotions and remove incomplete navigation. |
| Unrelated everyday-carry content appears on the homepage, About page, and blog.[1] [3] [7] | The service proposition looks unfocused. | Replace generic template content with guidance on store selection, request preparation, restricted items, delivery milestones, and country-specific support. |
| The legacy WordPress dashboard uses a page-builder and several content plugins, with a dashboard notice of plugin maintenance needs. | Page changes are possible, but the architecture is not a substitute for an order, quote, payment, and logistics system. | Treat the legacy WordPress site as a possible content source only. Do not make it the system of record for orders, quotes, payments, or customer support. |

## The simple client journey

The system should make the customer answer only one question at each point. The table below is the recommended journey that the client sees; staff complexity remains inside the operations queue.

| Stage | One client question | Required visible outcome | Staff system action |
|---|---|---|---|
| 1. Discover | “Where can I shop?” | Searchable verified UK store directory, categories, and an obvious **Request this item** action. | Maintain approved retailer links and category mapping. |
| 2. Request | “What do you need from me?” | Product URL, item details, quantity/options, destination country, and delivery address. No invented price. | Create an order request and assign it to the operations queue. |
| 3. Quote | “What will I pay and what does it include?” | Staff-approved, versioned quote that separates product, UK delivery, handling, freight, duties/clearance approach, and local delivery where applicable. | Check retailer availability, calculate actual costs, record assumptions, and issue a dated quote. |
| 4. Approve and pay | “Can I trust the amount and payment?” | Clear accept/decline action, payment status, and a receipt after verified settlement. | Expose only production-validated payment rails; reconcile every payment through signed webhooks and idempotent events. |
| 5. Parcel proof | “Has my item reached the UK warehouse?” | Receipt date, retailer tracking number, parcel condition, photo evidence, measured weight/dimensions, and any exception. | Record warehouse receipt and operational evidence against the order. |
| 6. Delivery | “Where is my shipment now?” | Single milestone timeline with next action and clear escalation path. | Update shipment milestones, notify customer, and resolve exceptions in an assigned support case. |

## Prioritized implementation scope

### P0 — Trust before scale

P0 must be completed before marketing a public checkout heavily or accepting additional live payment methods. It converts the current platform into a reliable commercial workflow rather than a better-looking information site.

| Item | Outcome | Definition of done |
|---|---|---|
| **Versioned staff quote** | A customer can see and approve an authoritative amount. | Each quote has a version, currency basis, expiry, line items, inclusions/exclusions, and an immutable approval record. A quote change creates a new version rather than overwriting the old one. |
| **Payment activation discipline** | Payment status becomes trustworthy. | A provider is enabled only after credentials, return flows, webhook verification, idempotency, reconciliation, receipt, and refund/exception handling are tested. |
| **Business identity and policy correction** | Customers see genuine, usable contact and policy information. | Live contact data, operating coverage, privacy, terms, shipping, returns, and dispute/claims information are distinct, reviewed pages. |
| **Single request entry point** | A request never disappears into chat. | Product links, screenshots, and store-directory actions create the same traceable purchase-request record. WhatsApp can notify staff but must not replace the record. |

### P1 — Operational proof and support accountability

P1 makes the system visibly safer than a chat-and-invoice model. It should follow P0 because it relies on confirmed requests and quotes.

| Item | Outcome | Definition of done |
|---|---|---|
| **Parcel Passport** | The customer sees evidence of warehouse handling. | Receipt photo, retailer tracking reference, condition, measured dimensions/weight, consolidation decision, and departure batch are stored with the order. |
| **Customer delivery timeline** | One page answers “where is my parcel?” | Ordered milestones, timestamp, responsible team, next action, and a clearly marked exception state are visible to the authenticated customer. |
| **Structured support cases** | Human support has an accountable owner. | Each case is linked to an order or parcel and records owner, priority, status, next-response promise, and customer-visible updates. |
| **Country playbooks** | Localisation becomes operational, not just a destination field. | Kenya, Tanzania, Uganda, and Rwanda each have reviewed payment availability, delivery options, address guidance, support channel, and permitted customer guidance. |

### P2 — Growth after the core journey is dependable

P2 should be intentionally delayed until P0 and P1 generate consistent, real operational data. This protects the business from promoting features it cannot yet fulfil.

| Item | Reason to defer | Safe future outcome |
|---|---|---|
| Loyalty, referral, and offer programmes | Rewards must be based on genuine completed orders, not display data. | Auditable rewards tied to real payment and delivery completion. |
| Retailer API integrations | APIs create contractual, compliance, and support obligations. | Integrate only an authorised retailer source after measured demand and a written business case. |
| Business procurement / reseller lane | It requires different approvals, documents, and roles than consumer orders. | Dedicated business accounts, pro forma invoices, multi-item requests, and permission controls. |

## Operating principles for the co-owner team

The platform must remain simple outside and disciplined inside. Customers should never be asked to infer whether an amount is final, whether a parcel has been received, or whether a WhatsApp message has been seen. Staff should never have to search personal chat history to find a request, quote, payment, or delivery decision.

| Principle | Practical rule |
|---|---|
| One source of truth | Every request, quote, payment, parcel event, and support case belongs to the customer record—not to a private chat thread. |
| No invented certainty | Do not promise final landed prices, retailer stock, payment completion, customs outcome, or delivery dates until the responsible operational event confirms it. |
| Local by evidence | Show a country-specific payment or delivery promise only when the team has a valid operational process and tested provider configuration. |
| Trust is visible | Prefer parcel proof, clear policies, verified contacts, receipts, and milestone records over generic testimonials or template promotion blocks. |
| Staff roles are narrow | External staff should receive only the operations permissions they need. Owner controls, payment configuration, and invitation management remain restricted. |

## Decision requested

The recommended first co-owner decision is whether to make **P0: the versioned staff quote and payment-request workflow** the next build priority. It is the highest-leverage change because it connects the current request intake, staff queue, and eventual local payment rails into a single defensible commercial journey.

## References

[1]: [UK Shoppers Africa — Public homepage](https://ukshoppersafrica.com/)

[2]: [UK Shoppers Africa — How it works](https://ukshoppersafrica.com/how-it-works/)

[3]: [UK Shoppers Africa — Contact us](https://ukshoppersafrica.com/contact-us/)

[4]: [UK Shoppers Africa — Privacy policy](https://ukshoppersafrica.com/privacy-policy/)

[5]: [UK Shoppers Africa — All Stores](https://ukshoppersafrica.com/all-stores/)

[6]: [UK Shoppers Africa — UK Deals](https://ukshoppersafrica.com/uk-deals/)

[7]: [UK Shoppers Africa — Blog](https://ukshoppersafrica.com/blog/)
