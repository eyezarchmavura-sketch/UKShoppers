# UK Shoppers Africa — Total Cost Audit

**Audit date:** 12 October 2026  
**Repository audited:** `eyezarchmavura-sketch/UKShoppers`  
**Audited commit:** `befd7c4` — *Make UK Shoppers an East Africa commerce system*  
**Audit basis:** repository evidence, project handover documents, quotations, test/build results, and the supplied master audit framework.

> This is an evidence-led software cost and readiness assessment. It is not a tax invoice, statutory audit, legal opinion, signed contract, or proof of third-party expenditure.

## 1. Executive answer

There are **three different totals**, depending on what “total cost” means:

| Interpretation | Best-supported amount | Meaning |
|---|---:|---|
| **Recorded full platform delivery price** | **£12,500 / TZS 44,820,357.50** | The documented fixed commercial price for the current platform scope, using the recorded reference rate of TZS 3,585.6286/£ on 23 August 2026. |
| **Alternative affordable onboarding/activation arrangement** | **TZS 2,500,000** | A separate reduced activation proposal. TZS 500,000 is recorded as paid, leaving TZS 2,000,000. It should not be added to the £12,500 figure. |
| **Professional replacement cost for the current implemented scope** | **Base estimate: TZS 123,750,000 / about £34,510** | Estimated cost for a competent professional team to reproduce the existing full-stack platform foundation, excluding future WMS and live-operations scope. |
| **Remaining cost to production-ready release** | **About TZS 50,000,000–70,000,000 / £13,950–£19,520** | Estimate from the present repository state to a commercially safer launch with verified payments, launch controls, stronger staff operations, reliability, and legal/operational readiness. |

### Most useful single conclusion

If the question is **“What is the total professional cost of this system as it exists today?”**, the best audit estimate is:

> **TZS 123.75 million base replacement cost**, with a reasonable scenario range of **TZS 56.25 million to TZS 258 million**, depending on delivery quality, assurance, documentation, security, testing, and team rates.

If the question is **“How much was commercially quoted?”**, the answer is:

> **£12,500 fixed delivery**, recorded as **TZS 44,820,357.50** at the historical reference rate.

These figures measure different things and must not be presented as interchangeable.

## 2. Asset identity

| Field | Finding |
|---|---|
| Project | UK Shoppers Africa |
| Alternative names | UK Shoppers; portal prototype; cross-border shopping platform |
| Type | Full-stack web application and operating-platform prototype |
| Business purpose | Assisted shopping and parcel forwarding from the UK/Europe to East African customers |
| Intended users | Customers in Tanzania, Kenya, Uganda, Rwanda; purchasing, warehouse, logistics, support, finance, admin and owner roles |
| Current stage | Advanced functional prototype / controlled MVP foundation; not a fully live commercial fulfilment operation |
| Stack | React 19, Vite, Tailwind 4, shadcn/ui, Wouter, Express 5, tRPC 11, Drizzle ORM, MySQL, Vitest, Manus OAuth, S3-compatible storage, built-in LLM integration |
| Repository evidence | 174 TypeScript/TSX/SQL files; approximately 21,322 source lines; 12 database migration files; 29 project documents; 20 declared page routes |
| Current validation | `pnpm check` passed; 60 automated tests passed; production build passed; repository clean after commit |
| Known dependencies | OAuth/authentication runtime, MySQL, storage, Manus runtime, email endpoint, payment providers, messaging providers, carrier/customs operations |
| Ownership questions | Confirm source-code copyright, AI-tool terms, third-party licences, domain ownership, provider accounts, database/data ownership, and contractor/IP assignments |

## 3. What is actually implemented

### Strongly evidenced in the repository

- Public storefront and retailer discovery.
- Destination-aware indicative estimate calculator.
- English, Kiswahili, Kinyarwanda, and Luganda interface support.
- Authenticated customer portal and account shell.
- Product-link request intake.
- Cart-screenshot upload and safe AI extraction fallback.
- Customer-scoped orders, payments, notifications, receipts and exports.
- Seven-stage order/tracking milestone pipeline.
- Staff-protected operations queue and screenshot alerts.
- Staff invitation foundation and role checks.
- Queen customer-assistance interface with order/payment context.
- Seasonal offers and deal/advertising governance foundations.
- Database schema, migrations, regression tests, production build, deployment-oriented documentation.
- Public system narrative covering assisted shopping, parcel forwarding, consolidation, warehouse handling and repeat ordering.

### Not yet proven as live commercial operations

- Live provider-confirmed card/mobile-money payment collection.
- Signed provider webhook settlement, reconciliation, refund and chargeback workflow in production.
- Full warehouse management system with parcel IDs, locations, bins, scans, custody events, photos, quarantine, consolidation parent/child records, packing and dispatch evidence.
- Versioned quote records and configurable rate cards covering all fees and later changes.
- Full least-privilege roles for purchasing, receiving, warehouse, logistics, finance, support and audit.
- Carrier integrations, live shipping rates, customs workflow and proof-of-delivery integrations.
- Reliable outbound email delivery with retry queue, sender-domain controls and delivery monitoring.
- Production monitoring, alerting, backup-recovery drills, rate limits and incident response.
- Verified customer revenue, transaction volume, retention, margins or operating profit.

## 4. Weighted functional completion

The following score measures the **target operating system**, not only the visible website. The weights recognise that payments, warehouse custody, pricing, and security are more important than cosmetic content.

| Capability | Weight | Evidence-based completion fraction | Weighted contribution |
|---|---:|---:|---:|
| Public storefront and discovery | 12 | 1.00 | 12.00 |
| Customer authentication and portal | 14 | 0.85 | 11.90 |
| Request and cart intake | 12 | 0.75 | 9.00 |
| Quote and pricing engine | 12 | 0.40 | 4.80 |
| Payments and settlement | 14 | 0.40 | 5.60 |
| Orders and tracking | 10 | 0.80 | 8.00 |
| Warehouse/WMS | 12 | 0.20 | 2.40 |
| Operations and RBAC | 8 | 0.60 | 4.80 |
| Notifications, support and AI | 6 | 0.65 | 3.90 |
| Deals/admin content controls | 4 | 0.80 | 3.20 |
| Security, QA and deployment readiness | 5 | 0.65 | 3.25 |
| **Total** | **109** |  | **68.85** |

**Weighted functional completion: 68.85 / 109 = 63.2%**

This is a provisional system-level measure. The current website and portal alone are materially further along than 63%; the score falls because a genuine cross-border operating system requires live financial controls, versioned quotes, WMS custody evidence, exceptions, and production operations.

## 5. Readiness by dimension

| Dimension | Provisional rating | Reason |
|---|---:|---|
| Functional implementation | **63%** | Good public/customer foundation; major WMS, pricing and live-payment gaps remain. |
| Technical architecture | **68%** | Coherent React/Express/tRPC/Drizzle structure with reusable modules, but current orders/timeline model is compact and not yet a full operational data model. |
| Testing and QA | **72%** | 60 automated tests, clean TypeScript and successful build; production transactions, real provider callbacks and full authenticated acceptance still require evidence. |
| Security readiness | **58%** | Protected customer reads, admin checks, signed-event foundations and invitation controls exist; least-privilege roles, audit trails, rate limits and production secrets/provider controls need completion. |
| Deployment readiness | **62%** | Build and runtime foundations are healthy; live provider settings, monitoring, backups and release controls remain. |
| Documentation/handover | **78%** | Strong README, operations guide, health assessment, pricing notes and system vision; final legal, commercial and provider handover still required. |
| Commercial readiness | **42%** | A clear product direction exists, but live payment, fulfilment, pricing, customs, support and revenue evidence are not yet established. |

## 6. Recorded commercial cost positions

### 6.1 Full platform delivery quotation

The project records a fixed delivery price of **£12,500.00**. The associated document records:

- Reference rate: **TZS 3,585.6286 per £1** on 23 August 2026.
- Converted total: **TZS 44,820,357.50**.
- Recorded payment: **TZS 500,000.00**.
- Recorded balance: **TZS 44,320,357.50**.
- Optional Operations & Growth Care Plan: **£750/month**, separate from delivery.

The £12,500 figure is a **commercial asking/contract-position figure**, not proof of actual cost incurred and not proof that all future production requirements are included.

### 6.2 Affordable onboarding/activation proposal

A separate document records:

- Affordable onboarding and activation total: **TZS 2,500,000**.
- Recorded payment: **TZS 500,000**.
- Outstanding amount: **TZS 2,000,000**.
- Scope includes activation, setup, hosting allocation, handover and 30 days of initial support as described in the related quotation.

This is best understood as an **alternative relationship/onboarding arrangement**, not an additional TZS 2.5 million on top of the £12,500 platform delivery price. The parties should formally clarify which commercial position governs the same scope.

### 6.3 Important reconciliation issue

The records currently contain both:

1. **£12,500 / TZS 44,820,357.50** as the full platform delivery price; and
2. **TZS 2,500,000** as an affordable onboarding/activation arrangement.

They must not be added together without a written agreement. The audit cannot determine from repository evidence whether the second amount superseded, discounted, staged, or merely activated the first position.

## 7. Estimated professional replacement cost

This estimates what a competent team would charge to reproduce the **current implemented platform scope**, not the complete future warehouse/enterprise system.

### Assumed work packages

| Work package | Lean hours | Professional hours | Higher-assurance hours |
|---|---:|---:|---:|
| Discovery and product architecture | 60 | 90 | 130 |
| UX/UI and content system | 80 | 120 | 170 |
| Frontend/storefront and portal | 300 | 420 | 540 |
| Backend/API/database | 340 | 470 | 620 |
| Integrations, payments foundation and notifications | 120 | 190 | 280 |
| Authentication, security and RBAC | 80 | 120 | 180 |
| QA and automated testing | 120 | 170 | 250 |
| DevOps and deployment | 60 | 90 | 130 |
| Documentation and training | 40 | 60 | 80 |
| Project management and coordination | 50 | 120 | 170 |
| **Total hours** | **1,250** | **1,830** | **2,550** |

| Scenario | Assumed blended rate | Estimated cost TZS | Approx. GBP at recorded rate | Interpretation |
|---|---:|---:|---:|---|
| Lean local implementation | TZS 45,000/hour | **TZS 56,250,000** | **£15,690** | Smaller team, narrower QA, lower documentation and lower assurance. |
| Professional commercial implementation | TZS 75,000/hour | **TZS 137,250,000** | **£38,280** | Stronger product, engineering, QA, deployment and handover discipline. |
| Higher-assurance implementation | TZS 120,000/hour | **TZS 306,000,000** | **£85,300** | More rigorous security, testing, resilience, operational controls and delivery governance. |

**Base replacement-cost estimate: TZS 137.25 million / approximately £38,280.**

The existing £12,500 quotation is therefore commercially discounted relative to an independent professional rebuild estimate. That does not prove the quotation is wrong; it means it may reflect relationship pricing, AI-assisted productivity, reuse of existing foundations, limited launch scope, or a reduced delivery margin.

## 8. Remaining cost to reach key milestones

These are estimates from the current repository state. They are not calculated by subtracting the quoted price from replacement cost.

| Milestone | Remaining work | Hours | Estimated cost at TZS 75,000/hour | Approx. duration |
|---|---|---:|---:|---:|
| Functional prototype polish | Remove/label first-login sample data, polish empty states, correct user-facing wording, route and mobile refinements | 60–100 | **TZS 4.5m–7.5m** | 2–4 weeks part-time |
| Usable MVP | Add quote records, versioned rate assumptions, better staff queue controls, onboarding mode, core exception records, acceptance testing | 350–500 | **TZS 26.25m–37.5m** | 6–10 weeks |
| Production-ready commercial release | Verified provider payment flow, settlement/reconciliation/refunds, staff role separation, communication reliability, legal/operational controls, monitoring, backups and launch runbook | 700–950 | **TZS 52.5m–71.25m** | 12–20 weeks |
| Enterprise/scale-ready system | Parcel/WMS entities, scans and custody, locations, consolidation, carrier adapters, warehouse scoping, audit trails, resilience, reporting and mobile scanning | 1,200–1,800 | **TZS 90m–135m** | 5–9 months |

### Mandatory launch blockers

1. Remove automatic sample orders/payments from normal first-login customer accounts.
2. Complete one real payment-provider path with signed callbacks, settlement, failure, refund and reconciliation tests.
3. Add full staff work queues, least-privilege role boundaries and immutable audit events.
4. Finalise pricing, duties, customs, returns, claims, prohibited-item and delivery policies.
5. Confirm email/messaging delivery, consent, retry and failure handling.
6. Add production monitoring, backups, rate limiting and incident response.

## 9. Current software asset value

A software asset value is not the same as the replacement cost or quoted client price. The current value is reduced by unfinished live integrations, missing WMS depth, technical debt, uncertain ownership records, and the absence of revenue/usage evidence.

| Scenario | Provisional software asset value | Basis |
|---|---:|---|
| Low | **TZS 35 million** | Reusable code and documented foundation, with high launch and integration risk. |
| Base | **TZS 60 million** | Working full-stack prototype with meaningful portal, operations, AI, database and test assets, adjusted for incomplete production controls. |
| High | **TZS 90 million** | Assumes clean IP transfer, continued maintainability, successful handover and credible deployment evidence. |

**Confidence: low to medium.** This is a cost-based provisional value, not a market transaction valuation.

### Current business value

No reliable revenue, active-customer, transaction-volume, retention, gross-margin, CAC or operating-profit evidence was found in the audited materials. Therefore:

- A revenue multiple should **not** be applied.
- Current business value cannot be established from the evidence available.
- The present business value is best described as **software asset value plus an unproven commercial opportunity**.

## 10. Recurring and excluded costs

The following are not included in the software replacement-cost estimate unless specifically contracted:

- Hosting, database, storage and monitoring renewals.
- Domain, DNS and business email renewals.
- Payment-provider transaction fees, chargebacks and refunds.
- Mobile-money provider fees and bank charges.
- WhatsApp, SMS, email and AI usage charges.
- Retailer purchases, international freight, customs, duties, insurance and local delivery.
- Advertising, content production and professional translation.
- New country operations, mobile applications, carrier APIs and substantial new features.
- Ongoing maintenance and support after any included warranty period.

The documented recommended Operations & Growth Care Plan is **£750/month**, but no evidence shows that it has been activated or paid.

## 11. Reusable intellectual property

Potentially reusable assets found in the repository include:

- Customer authentication and protected procedure patterns.
- Role checks and external staff invitation flow.
- Order, payment, notification and webhook data patterns.
- React/Tailwind/shadcn UI system and portal shell.
- Multilingual content architecture.
- AI assistant context and safe cart extraction fallback.
- Deal/offer governance and evidence-first publishing controls.
- Receipt/export utilities.
- Express 5 route handling and regression tests.
- Deployment, project documentation and route manifest patterns.

These should not be valued again as standalone assets in another product without checking whether the same reusable modules are shared across INM projects.

## 12. Risk register affecting value and cost

| Risk | Impact | Cost implication |
|---|---|---|
| First-login sample data in normal customer flow | High | Data-cleanup, onboarding-mode and acceptance work before live customers. |
| Live payments not fully configured | Critical | Provider integration, compliance, webhook, settlement and refund work required. |
| Compact order timeline rather than full parcel/WMS model | High | Refactor or extension required before warehouse scale. |
| No complete quote/rate-card versioning | High | Pricing disputes and margin leakage risk; requires domain model and audit history. |
| Basic staff-role separation | High | Operational privacy and segregation-of-duties risk. |
| Email failures logged without retry queue | Medium | Customer communication reliability work. |
| Unknown provider/domain/IP ownership records | High | Can reduce transferable asset value and delay handover. |
| No verified revenue or customer evidence | High | Prevents income-based or comparable business valuation. |
| Custom/third-party dependency mix | Medium | Maintenance and migration costs may increase over time. |

## 13. Audit conclusion

The asset is **substantially more than a website**. It is a credible full-stack cross-border commerce and fulfilment-platform foundation with real customer, staff, database, notification, payment-record, AI-assistance and governance components.

However, it is not yet accurate to value it as a completed enterprise warehouse and payment business. The strongest defensible conclusion is:

- **Documented commercial delivery price:** £12,500 / TZS 44.82m.
- **Alternative affordable activation proposal:** TZS 2.5m, with TZS 2.0m recorded outstanding; clarify whether it supersedes the full quotation.
- **Professional replacement cost of the current implemented scope:** base TZS 137.25m, with a TZS 56.25m–306m scenario range.
- **Provisional current software asset value:** base TZS 60m, with a TZS 35m–90m range.
- **Remaining production-release cost:** approximately TZS 52.5m–71.25m.
- **Remaining enterprise/WMS-scale cost:** approximately TZS 90m–135m.
- **Current business value:** not numerically supportable without revenue and operating data.

The next commercial action should be to reconcile the two price positions in writing and separate the **existing platform delivery**, **activation/onboarding**, **third-party operating costs**, **production completion work**, and **ongoing support** into distinct scopes.
