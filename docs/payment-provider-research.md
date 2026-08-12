# Regional Payment Provider Research

**Purpose.** This working note records the production payment-routing decision for UK Shoppers Africa. It is implementation evidence, not a customer-facing statement of supported payment methods. Every payment remains **pending** until the provider’s event has passed cryptographic or server-to-server verification and the expected amount, currency, merchant reference, and settlement status match the platform record.

| Market or gateway | Integration decision | Verification design | Current production prerequisite |
| --- | --- | --- | --- |
| Paystack | Implement first-party webhook handler now. | Validate the raw-body `x-paystack-signature` HMAC-SHA512 with the Paystack secret, then verify the transaction server-to-server before settlement. | Live secret key and configured public webhook URL. |
| Flutterwave | Implement first-party webhook handler now. | Validate the raw-body `flutterwave-signature` HMAC-SHA256 with the configured secret hash, then verify the transaction server-to-server before settlement. | Live secret key, secret hash, and configured public webhook URL. |
| Kenya — Safaricom M-Pesa | Build a pending callback/reconciliation adapter; do not credit a customer solely from the callback payload. | Match the business reference to an expected pending payment and reconcile it through Daraja’s authenticated transaction-status/pull facilities before settlement. | Daraja production credentials, live PayBill/Till, and registered secure callback URL. |
| Tanzania — Vodacom M-Pesa | Build a pending callback/reconciliation adapter; keep it disabled until official account documentation and production credentials are supplied. | Use the Vodacom M-Pesa Payments Gateway authentication model and a provider-side transaction-status check before settlement. | Activated business collection account, Vodacom developer account/API key/public key, and approved production application. |
| Uganda and Rwanda | Keep provider choice configurable; prefer MTN MoMo Collection where a direct operator route is appropriate, otherwise evaluate a licensed regional collection partner. | Treat an asynchronous request-to-pay/callback as provisional; query provider status before settlement. | Chosen provider account, market approval, credentials, and callback contract. |
| Burundi | Do not present a live direct method until a contracted operator or regulated regional collection partner confirms coverage and callback verification. | Provider-specific server-to-server status confirmation is mandatory. | Contracted coverage, credentials, and callback contract. |

## Implementation Rules

The customer browser must not send a “payment succeeded” signal that settles an order. Instead, checkout creates an expected payment record in `pending` state with a unique merchant reference. A verified webhook records the external event once, performs the provider verification, and transitions the associated payment exactly once. Duplicate deliveries must be acknowledged without re-crediting an order or wallet.

For provider callbacks where publicly available documentation does not establish a strong inbound signature, the callback is a **notification only**. It becomes actionable only after an authenticated server-to-server status check confirms the expected payment reference, amount, currency, and success state. This is especially important for mobile-money collection routes.

## Findings and Sources

Paystack documents HMAC-SHA512 validation through the `x-paystack-signature` header, urges a quick HTTP 200 acknowledgment, and retries unsuccessful deliveries for up to 72 hours in live mode.[1] Flutterwave documents raw-body HMAC-SHA256 verification via `flutterwave-signature`, independent transaction verification before value is granted, and idempotent event handling.[2] Vodacom’s M-Pesa developer portal identifies C2B, reversal, and transaction-status APIs and describes API/public-key-based authorization for an approved account.[3] Safaricom’s Daraja documentation describes secure callback URLs and a pull-transactions reconciliation flow that can recover missed C2B callbacks within a recent 48-hour window.[4] MTN’s official MoMo API offers Collection and status-query flows for Uganda and Rwanda, while Airtel’s developer portal lists both markets; either route still requires commercial onboarding and exact callback documentation.[5] [6]

## References

[1]: https://paystack.com/docs/payments/webhooks/ "Paystack Webhooks"
[2]: https://developer.flutterwave.com/docs/webhooks "Flutterwave Webhooks"
[3]: https://business.m-pesa.com/developers/ "Vodacom M-Pesa Developer Portal"
[4]: https://developer.safaricom.co.ke/apis/PullTransaction "Safaricom Daraja Pull Transactions"
[5]: https://momo.mtn.com/api/ "MTN MoMo API"
[6]: https://developers.airtel.africa/developer "Airtel Africa Developer Portal"
