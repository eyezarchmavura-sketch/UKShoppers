# UK Shoppers Africa — Project Guide and Operations Handover

> This guide is the operational and engineering handover for the UK Shoppers Africa platform. It explains how the current product behaves, what teams should do each day, and which items must be completed before live commercial launch.

## 1. Purpose and Operating Model

UK Shoppers Africa supports an assisted-shopping and parcel-forwarding model. The service receives a customer’s UK retail request, records the order, manages purchase and warehouse milestones, and gives the customer a transparent tracking and communications experience. The platform is designed for customers receiving goods in Tanzania, Kenya, Uganda, and Rwanda.

| Role | Primary responsibility | Current platform access |
|---|---|---|
| Customer | Creates orders, pays, tracks parcels, downloads receipts, manages preferences | Authenticated customer portal |
| Operations administrator | Updates shipment milestones and follows exceptions | `admin`-protected operations actions |
| Platform owner | Receives operations alerts and manages configuration | Owner account, secrets, deployment, database |
| Engineer | Maintains application, schema, tests, and integrations | Repository and managed development environment |

## 2. Customer Workflows

### 2.1 Product Request and Quote

The customer starts from the public site or portal and supplies a UK product link or cart information. The estimate calculator uses the destination, item price, and estimated weight to present an indicative total. The customer should be clearly told that a quoted amount remains subject to final weight, retailer availability, prohibited-goods checks, duties, and operational confirmation.

### 2.2 Checkout and Payment Record

The checkout experience creates a payment record and an order record for an authenticated user after its current success path. Payment records store the gateway, amount, currency, destination, and settlement state. Customers can view their history and export a PDF or CSV record.

> **Operational status:** the interface has gateway-selection and payment-record flows, but the live provider credentials and verified webhooks are not yet configured. Do not represent the current implementation as a live payment-processing system until signed provider callbacks, settlement reconciliation, and failure handling are verified.

### 2.3 Shipment Tracking

An order moves through the following forward-only sequence:

| Sequence | Status key | Customer label | Typical responsible team |
|---:|---|---|---|
| 1 | `pending_purchase` | Awaiting purchase | Purchasing |
| 2 | `purchased` | Purchased at store | Purchasing |
| 3 | `in_warehouse` | At London warehouse | London warehouse |
| 4 | `shipped` | Shipped by air freight | Freight dispatch |
| 5 | `arrived` | Arrived in destination country | Destination operations/customs |
| 6 | `local_dispatch` | Out for local delivery | Local delivery partner |
| 7 | `delivered` | Delivered | Local delivery partner |

When an authorized administrator advances a status, the server appends a dated event to the order timeline and writes an unread notification for the affected customer. The portal notification bell and Queen badge read these notification records.

### 2.4 Customer Notifications

The notification flow has three layers:

1. An unread row is added to the `notifications` table for the customer.
2. The platform owner receives an operations notification.
3. If the user has an email address and `emailNotifications` is not set to `no`, the server attempts a customer email through the configured notification endpoint.

Email delivery failures are currently logged server-side rather than retried by a queue. Until sender-domain setup and delivery monitoring are confirmed, operations should treat the portal notification as the authoritative customer-facing update.

## 3. Application Components

| Component | File area | Responsibility |
|---|---|---|
| Routing and API contracts | `server/routers.ts` | Auth, customer data, profile preferences, admin status update, and Queen chat procedures |
| Data operations | `server/db.ts` | Drizzle queries, creation helpers, first-login demo data, milestone updates, notification/email dispatch |
| Schema | `drizzle/schema.ts` | Users, orders, payments, and notifications tables |
| Customer portal chrome | `client/src/components/PortalShell.tsx` | Navigation, real payment-balance display, user initials, notification menu |
| Queen assistant | `client/src/components/AssistantChat.tsx` | Assistant panel, message persistence, quick actions, unread badge |
| Customer pages | `client/src/pages/` | Dashboard, orders, tracking, payments, wallet, referrals, settings, checkout, receipt, address |
| Admin dashboard | `client/src/pages/AdminDashboard.tsx` | Admin status controls and operations interface |
| Localized copy | `client/src/lib/i18n.ts` | English, Kiswahili, Kinyarwanda, and Luganda strings |

## 4. Security and Data Rules

Every customer-oriented tRPC query is guarded by `protectedProcedure` and uses the authenticated `ctx.user.id` when reading orders, payments, or notifications. This means a customer should not be able to retrieve another customer’s data simply by changing a route or a tracking reference.

Administrators use `adminProcedure` for milestone updates. The production team should keep administrator access minimal and promote users through a controlled workflow. Avoid sharing a single administrator login among warehouse staff.

Never add fabricated reviews, ratings, testimonials, or referral users to the public site or portal. Demo content must be labeled as sample content and must be removed from customer-facing production flows.

## 5. Current Data Model

| Entity | Relationship | Notes |
|---|---|---|
| User | One user can have many orders, payments, and notifications | Auth identity comes from Manus OAuth. |
| Order | Belongs to a single customer | Timeline is compact JSON containing dated milestone events. |
| Payment | Belongs to a single customer and may reference an order | Payment `status` is `pending`, `paid`, or `failed`. |
| Notification | Belongs to a customer and an order | `read` is `yes` or `no`; the UI counts unread rows. |

The user’s `emailNotifications` preference is stored as `yes` or `no`. The default is `yes`.

## 6. Daily Operations Runbook

### Start of Day

Review incoming orders, check retailer availability and item restrictions, verify outstanding payment status, and confirm warehouse arrivals. Use the customer order reference as the operational identifier in communications.

### During Purchase and Warehouse Processing

Move an order to **Purchased at store** only after the retailer purchase is confirmed. Move it to **At London warehouse** only after the item is physically scanned or checked at the warehouse. Add notes that are factual, customer-safe, and specific enough to resolve follow-up questions.

### Air Freight, Customs, and Delivery

Advance to **Shipped by air freight** when the item has actually departed. Advance to **Arrived in destination country** only after confirmed arrival. Use **Out for local delivery** when the delivery partner holds the item, and use **Delivered** only after proof of delivery or a confirmed handover.

### Exceptions

For retailer cancellations, missing items, customs holds, damaged goods, address issues, or payment disputes, do not use a misleading shipment status. Contact the customer through the approved support channel, record a clear internal note, and apply the relevant refund/returns policy.

## 7. Engineering Runbook

### Local Commands

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
pnpm build
```

| Check | Expected result |
|---|---|
| `pnpm check` | TypeScript exits with zero errors. |
| `pnpm test` | Vitest passes. |
| `pnpm build` | Client and server bundles build successfully. |
| Browser validation | Verify the public home, portal, checkout, tracking, payments, settings, referrals, legal, and admin routes. |

### Database Changes

Use a schema-first workflow. Update `drizzle/schema.ts`, generate and inspect migration SQL, then apply the approved SQL once. Confirm the change with a read query and add tests where relevant. Do not use destructive schema operations without a backup and a written recovery plan.

### Secrets and Third-Party Services

Manage all OAuth, database, email, and payment credentials through the project’s managed secrets interface. Do not hardcode private keys, gateway secrets, access tokens, sender passwords, or database URLs in client code, server code, Markdown files, or commits.

## 8. Launch Blockers and Recommended Build Sequence

| Priority | Work item | Current reason |
|---:|---|---|
| 1 | Replace first-login seed data with explicit onboarding/sample mode. | Every first-time account currently receives sample orders, a payment, and status notifications so the demo does not look empty. This is unsuitable for real customers. |
| 2 | Implement verified live payment flows. | Payment selection and recorded transactions exist, but live provider credentials, signed webhook verification, reconciliation, refunds, and ledger credits require completion. |
| 3 | Add an admin order work queue and staff roles. | The customer `orders.list` router remains user-scoped. Build `admin.orders.listAll`, audit logging, and least-privilege warehouse/delivery roles before staff operations scale. |
| 4 | Harden customer communications. | Confirm email provider delivery, template approval, sender domain, preference enforcement, retry behavior, and delivery logs. |
| 5 | Establish operational/legal controls. | Approve final service pricing, delivery estimates, claims process, prohibited-item list, privacy policy, terms, returns policy, and local regulatory requirements. |
| 6 | Add reliability controls. | Add monitoring, analytics, alerting, backups, rate limits, and incident documentation. |

## 9. Release Checklist

Before publishing a new version, the release owner should confirm the following.

- [ ] TypeScript passes with `pnpm check`.
- [ ] Vitest passes with `pnpm test`.
- [ ] The landing page works in desktop, mobile, light, and dark themes.
- [ ] Each language option displays safely and the primary calls to action remain clear.
- [ ] Customer identity, order scoping, payment history, notification counts, and referral state are tested with a real authenticated session.
- [ ] Checkout only marks payment/order success after the verified provider callback is received.
- [ ] Admin access and every cross-customer query are reviewed for authorization.
- [ ] No secrets, private customer records, fake reviews, or mislabeled demo data are included in the release.
- [ ] A checkpoint is saved before publishing.

## 10. Ownership and Support

The platform owner is responsible for business policy, shipping/fulfilment accuracy, payment-provider relationships, and user support. The engineering owner is responsible for access controls, release quality, integration safety, backups, and incident response. Business changes that alter prices, estimated delivery times, customs claims, or financial terms should be reviewed by the owner before they reach customers.

---

For the high-level platform overview and setup instructions, see [`README.md`](./README.md).

