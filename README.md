# UK Shoppers Africa

> **Shop the UK. Delivered to East Africa.**

UK Shoppers Africa is a full-stack customer portal and operations prototype for personal shopping and parcel forwarding between UK retailers and customers in Tanzania, Kenya, Uganda, and Rwanda. It combines a public commerce experience, a customer shipment portal, payment records, multilingual assistance, and an operations workflow in one platform.

The current hosted preview is available at [crossport-hayeut38.manus.space](https://crossport-hayeut38.manus.space).

## Product Overview

Customers can paste a UK product link, obtain a delivery estimate, create an order, make a payment, and follow their shipment from purchase through final delivery. Each authenticated customer sees only their own orders, payments, and shipment notifications. The platform is designed around a premium **gold, black, and faint-blue** visual language that is localized for the East African market.

| Area | Current capability |
|---|---|
| Public shopping experience | Store discovery, destination-aware estimate calculator, FAQ, journey timeline, dark mode, and WhatsApp entry points |
| Customer portal | Personal UK warehouse address, orders, tracking, payments, receipts, wallet summary, referrals, settings, and notifications |
| Shipment tracking | Seven controlled milestones, timeline history, in-app status updates, and opt-in order-update emails |
| Payments | Recorded payment history, receipt export, CSV/PDF export, local-currency display, and gateway selection interface |
| Operations | Admin-protected shipment status advancement with an owner alert and a customer notification |
| Assistance | Queen, a multilingual AI assistant with order/payment context, quick actions, and conversation persistence |

## Customer Journey

```text
Choose a UK item
       ↓
Paste the product link or upload a cart
       ↓
Select Tanzania, Kenya, Uganda, or Rwanda
       ↓
Review estimated GBP and local-currency cost
       ↓
Complete payment and receive a receipt
       ↓
Track: Purchase → London warehouse → Air freight → Customs → Local delivery
```

## Feature Inventory

### Public Website

| Feature | Details |
|---|---|
| Instant estimate calculator | Calculates a delivery estimate by destination, item value, and estimated weight. |
| Store wall | Presents major UK retailers and allows a selected store to prefill the estimate flow. |
| East Africa localization | Supports Tanzania, Kenya, Uganda, and Rwanda, including local-currency display. |
| Languages | English, Kiswahili, Kinyarwanda, and Luganda are available through the language switcher. |
| Accessibility and presentation | Responsive navigation, dark mode, scroll-reveal treatments, mobile-safe WhatsApp support, FAQs, and legal pages. |

### Authenticated Customer Portal

| Feature | Details |
|---|---|
| Dashboard | Uses the signed-in customer’s name, current balance calculation, recent orders, and shipment summary. |
| Orders and tracking | Reads customer-scoped orders from MySQL and visualizes the shipment timeline. |
| Payments | Reads customer-scoped payment records and supports invoice-style PDF plus CSV exports. |
| Receipts | Produces a branded, downloadable receipt after a completed checkout flow. |
| Wallet summary | Calculates the displayed balance from recorded completed payments; it is not yet a stored-value ledger. |
| Referrals | Generates an account-derived referral code and avoids fabricated referral/customer records. |
| Notifications | Shows unread shipment-status updates in both Queen and the portal header notification menu. |
| Preferences | Stores the user’s email notification preference in the database. |

### Queen AI Assistant

Queen answers shopping, delivery, customs, payment, and portal questions in the active interface language. The assistant can receive limited customer context for relevant orders and payments, provide product/store suggestions, and retain conversation history in the browser. It is designed to be helpful without exposing data belonging to another customer.

### Operations Experience

The operations experience is protected by the `admin` role. An administrator can advance a shipment through the status pipeline. Every legitimate forward status update appends the order timeline, creates an unread notification for the affected customer, alerts the platform owner, and attempts an email update when the customer has opted in and has an email address.

## Shipment Milestones

| Key | Customer-facing label |
|---|---|
| `pending_purchase` | Awaiting purchase |
| `purchased` | Purchased at store |
| `in_warehouse` | At London warehouse |
| `shipped` | Shipped by air freight |
| `arrived` | Arrived in destination country |
| `local_dispatch` | Out for local delivery |
| `delivered` | Delivered |

The system only accepts forward movement through the pipeline. A repeated or backward status request does not overwrite the current milestone.

## Architecture

| Layer | Implementation |
|---|---|
| Web client | React 19, Vite, Tailwind CSS 4, shadcn/ui, Framer Motion, Wouter, jsPDF |
| API contract | tRPC 11 with SuperJSON |
| Authentication | Manus OAuth with protected and administrator procedures |
| Server | Express-based Manus application runtime |
| Persistence | MySQL accessed through Drizzle ORM |
| AI | Manus built-in LLM integration for Queen |
| Testing | Vitest |
| Hosting | Manus autoscale hosting with custom-domain support |

```text
React client
    │  tRPC /api/trpc
    ▼
Express application ──► protected/admin procedures
    │                         │
    │                         ├── MySQL / Drizzle
    │                         ├── Notification service
    │                         └── Queen LLM service
    ▼
Customer portal, operations dashboard, exports, and receipts
```

## Data Model

| Table | Purpose | Important fields |
|---|---|---|
| `users` | Authenticated accounts and preferences | `openId`, `name`, `email`, `role`, `emailNotifications` |
| `orders` | Customer purchase/shipment requests | `ref`, `userId`, `store`, `item`, `destination`, `amountGbp`, `status`, `timeline` |
| `payments` | Recorded customer transactions | `ref`, `userId`, `orderId`, `gateway`, `amount`, `currencyCode`, `status` |
| `notifications` | Shipment-status notifications | `userId`, `orderId`, `title`, `body`, `statusFrom`, `statusTo`, `read` |

Customer-facing database reads are executed through authenticated tRPC procedures and are scoped to `ctx.user.id`. The database schema is defined in [`drizzle/schema.ts`](./drizzle/schema.ts).

## Repository Layout

```text
client/
  src/
    pages/          # Public, portal, checkout, operations, and legal routes
    components/     # Portal shell, Queen, widgets, language UI, shared UI
    contexts/       # Theme and language state
    lib/            # tRPC client, i18n, receipts, local helpers
server/
  routers.ts        # tRPC API surface
  db.ts             # Query helpers, order status workflow, notification dispatch
  assistantKnowledge.ts
  *.test.ts         # Vitest coverage
drizzle/
  schema.ts         # MySQL tables and generated types
shared/
  orderStatus.ts    # Client-safe shipment-status labels
PROJECT_GUIDE.md    # Operations and engineering handover
```

## Local Development

### Prerequisites

Use Node.js 22+ and pnpm. The runtime also needs the application-provided environment values for OAuth, MySQL, Manus built-in APIs, and authentication. Never commit `.env` files, tokens, gateway secrets, or database connection strings.

### Commands

```bash
pnpm install
pnpm dev
pnpm test
pnpm check
pnpm build
```

| Command | Purpose |
|---|---|
| `pnpm dev` | Starts the local Express/Vite development runtime. |
| `pnpm test` | Runs the Vitest suite. |
| `pnpm check` | Runs TypeScript with `--noEmit`. |
| `pnpm build` | Produces the client and server production build. |
| `pnpm db:push` | Generates and applies Drizzle migrations; inspect generated SQL before applying in shared environments. |

## Database Change Workflow

1. Update `drizzle/schema.ts` and generated TypeScript types as required.
2. Generate a migration with `pnpm drizzle-kit generate` or the project database workflow.
3. Review the SQL carefully, especially for destructive operations.
4. Apply the approved migration through the managed database workflow.
5. Add or revise tests, run `pnpm test`, and run `pnpm check`.

## Validation Baseline

The most recent platform audit verified the public and authenticated portal routes, responsive mobile views, payment summaries, referral empty states, notifications, Dashboard identity, and order status rendering. The working baseline included a clean TypeScript check and six passing Vitest tests.

## Production Readiness Notes

This repository is a **working platform prototype**, not yet a fully live financial/fulfilment deployment. Before accepting customer money or shipping live customer parcels, complete the following actions.

| Priority | Required action | Reason |
|---|---|---|
| Critical | Replace test/placeholder payment setup with live Paystack, M-Pesa, and/or Flutterwave credentials plus signed webhook verification. | Payment UI and records must be backed by provider-confirmed settlement. |
| Critical | Replace first-login demonstration seed data with an onboarding empty state or explicit sample-mode flag. | New real customers must not receive example Nike/Boots orders and payments. |
| High | Add a dedicated admin `orders.listAll` procedure with audit logging and staff-scoped roles. | The current customer order query remains user-scoped; live operations need a controlled cross-customer work queue. |
| High | Confirm email delivery, sender domain configuration, unsubscribe/preference handling, and failure logging. | Milestone messages must be reliably deliverable and compliant. |
| High | Verify pricing, duties, customs rules, insurance, terms, and delivery claims with the operating business before publication. | Operational and legal claims require current business approval. |
| Medium | Add analytics, error monitoring, backup/recovery checks, rate limits, and an incident-response process. | These controls support reliable day-to-day operation. |

Read [`PROJECT_GUIDE.md`](./PROJECT_GUIDE.md) for the detailed operational runbook and engineering handover.

## License

Proprietary. Copyright © UK Shoppers Africa / INM LTD. All rights reserved.
