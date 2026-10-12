# UK Shoppers Africa — System Vision

## Product direction

UK Shoppers Africa is not only a public shopping website. It is a connected operating system for East Africans buying from the UK and Europe through assisted shopping, parcel forwarding, warehouse handling, consolidation, international shipping, local delivery, and repeat orders.

## Core operating pipeline

`Request → Quote → Approval → Payment → Purchase / Inbound → Receive → Inspect → Store → Consolidate → Reweigh → Ship → Track → Deliver / Collect → Reconcile → Repeat`

The public website explains and starts the journey. The customer portal owns the customer record, quote context, payment history, shipment milestones, support, and repeat actions. The staff workspace owns work queues, controlled milestone changes, request evidence, operational exceptions, and role-restricted access.

## System principles

- **One record per customer journey:** product requests, quotes, payments, parcels, notifications, and tracking should connect to a durable reference.
- **Transparent money movement:** distinguish known, estimated, optional, and conditional charges; preserve the assumptions behind a quote.
- **Warehouse as a system boundary:** receiving, inspection, custody, storage, consolidation, packing, and dispatch require evidence rather than informal messages.
- **Structured exceptions:** retailer cancellation, missing item, damaged goods, customs hold, address issue, payment dispute, and failed delivery need explicit workflows.
- **Least privilege:** customer, purchasing, warehouse, logistics, finance, support, administrator, and auditor responsibilities should not collapse into one shared login.
- **Channel-aware, not channel-dependent:** WhatsApp, email, and SMS can notify or support customers, but the portal and operations records remain the source of truth.

## Current implementation direction

The existing repository already contains a public landing experience, customer portal, order/tracking pages, payment records, multilingual support, Queen assistant, staff queue, screenshot intake, notifications, role checks, and verified webhook foundations. The new public system layer makes that operating model visible to customers without claiming that live payment, carrier, customs, or warehouse integrations are complete.

## Next system slices

1. Replace first-login sample data with explicit sample/onboarding mode.
2. Add quote records and versioned pricing/rate cards.
3. Add parcel, location, custody-event, consolidation, and scan evidence entities.
4. Add staff work queues with role and warehouse scoping.
5. Add payment settlement, reconciliation, refund, and provider failure workflows.
6. Add operational exception management, notifications, audit trails, and launch controls.
7. Extend country, currency, warehouse, carrier, and delivery-zone configuration beyond the initial East Africa destinations.
