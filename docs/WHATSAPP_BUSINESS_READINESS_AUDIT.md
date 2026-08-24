# WhatsApp Business Readiness Audit

**Status:** Deferred — no WhatsApp Business Cloud API credentials, recipient configuration, webhook, or live dispatch is active in the platform.

## Current Verified State

The purchase-request workflow persists a new order before creating a shared staff alert for cart-screenshot requests. It does not call a WhatsApp provider. The order-status workflow persists the order timeline and in-app notification, then attempts an existing owner notification and opt-in customer email. These current channels are separate from WhatsApp.

| Area | Current behavior | WhatsApp readiness conclusion |
|---|---|---|
| New purchase request | Saves the order; cart screenshots create a staff operations alert | A post-persistence event is available, but no WhatsApp adapter exists |
| Order-status change | Saves status/timeline and in-app notification | A second event point exists, but live WhatsApp dispatch is absent |
| Existing owner notification | Transport failures return `false`; configuration validation can still throw | The WhatsApp path must contain its own failure isolation and never affect order creation or status changes |
| Customer email | Sent only when the customer has an email and has not opted out | WhatsApp customer messaging must likewise require appropriate opt-in and policy-compliant timing |
| Secrets and recipients | No Meta environment entries or recipient list are configured in the application | Activation must wait for managed settings; do not put values in source or documentation |

## Required Activation Architecture

Use a **server-side event handler** after the durable order or status write. The handler should call a dedicated `whatsappNotifications` service only when a managed enablement flag and required configuration are present. The service must return a result object or log a controlled failure; it must never throw into `orders.create` or the staff milestone mutation.

Use the Meta Cloud API from server code only. Meta documents that Cloud API sends outbound messages through the Messages API and reports outgoing delivery status through the `messages` webhook field.[1][2] Store the provider message ID, the local event/deduplication key, the returned acceptance state, and later delivery/read/failure events for operational auditability. A successful send response represents acceptance, not delivery.[2]

| Component | Required behavior |
|---|---|
| Event trigger | Run after the order/status database write succeeds; do not use browser-side tokens or scheduled polling |
| Recipient configuration | Read only from managed configuration; normalize an approved recipient to international format and do not hard-code administrator numbers |
| Message content | Use the smallest useful operational summary: internal order reference, event type, and a staff-dashboard link. Exclude customer address, payment data, screenshot URLs, and unnecessary personal data |
| Delivery safety | Wrap all sending, parsing, and logging in a non-blocking failure boundary; retain an in-app operations alert as the fallback |
| Idempotency | Use a deterministic event key such as `order:<id>:event:<type>:version:<timestamp-or-status>` and reject duplicate sends and duplicate webhook deliveries |
| Webhook endpoint | Add the verification `GET` and signed `POST` endpoint before JSON parsing so signature verification can use the raw request body |
| Security | Validate Meta’s verification challenge with the configured verify token; validate incoming webhook signatures with the app secret and `X-Hub-Signature-256`; do not log tokens or raw sensitive payloads |
| Customer messaging | Send only to recipients with the required opt-in. Use a pre-approved template when the 24-hour customer-service window is closed; do not use a free-form message outside that window.[3] |
| Test mode | Start with Meta’s test resources and an explicit disabled-by-default configuration. Production messages require a deliberate enablement change after webhook verification and an end-to-end test |

## Managed Inputs Required Before Any Implementation

Do not request values in chat or record them in Git. Add them only through secure managed settings when activation is approved.

| Configuration key | Purpose |
|---|---|
| `WHATSAPP_ACCESS_TOKEN` | Server-side Meta access token |
| `WHATSAPP_PHONE_NUMBER_ID` | Cloud API sender phone-number identifier |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Verification challenge secret |
| `WHATSAPP_APP_SECRET` | Webhook HMAC verification secret |
| `WHATSAPP_ADMIN_RECIPIENTS` | Comma-separated, approved administrator recipients; no default values in source |
| `WHATSAPP_ENABLED` | Explicit feature switch, defaulting to disabled |
| `WHATSAPP_TEMPLATE_*` | Approved template identifiers required for customer notifications outside the service window |

## Activation Checklist

1. Confirm the Meta business account, registered sender number, approved recipient policy, and any required templates.
2. Add the managed configuration values and keep `WHATSAPP_ENABLED=false`.
3. Implement server-only send and webhook modules with unit tests for normalization, idempotency, redaction, signature validation, and non-blocking fallback.
4. Register the webhook route before body parsing, verify the Meta challenge, and subscribe to the `messages` webhook field.[1]
5. Test with Meta’s supplied test account and a non-production recipient, checking the accepted provider ID and status-webhook handling.[2]
6. Review the logs for duplicate handling and fallback alerts, then obtain explicit approval before enabling production dispatch.
7. Provide an immediate disable procedure: set `WHATSAPP_ENABLED=false`, retain in-app staff alerts, and investigate failed webhook or provider events without losing order operations.

## References

[1] [Meta for Developers — WhatsApp Business Platform Webhooks](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview)

[2] [Meta for Developers — WhatsApp Business Platform overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/about-the-platform)

[3] [Meta for Developers — WhatsApp Cloud API service messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages)
