# Currency + Payment History + PDF Receipt — Todo

## Phase 1: currency engine + PDF
- [ ] Create client/src/lib/currency.ts: rates for TZS/KSh/UGX/RWF with symbol, name, flag, minor units
- [ ] Add jspdf dependency for PDF receipt generation

## Phase 2: wire into pages
- [ ] Checkout currency-aware totals: derive destination from address selection or portal currency header; show local total + GBP side-by-side on confirm step and in order review
- [ ] Create PaymentHistory page (/portal/payments): table of transactions (date, gateway, amount GBP + local, status chips, ref, receipt download)
- [ ] Create PaymentSuccess page (/portal/success?ref=...): order summary, PDF receipt download button (jspdf), back to orders
- [ ] Update Checkout onSuccess to navigate to success page with ref + last tx details stored in localStorage
- [ ] Add Wallet & Pay nav link to Payment History
- [ ] Persist payment transactions in localStorage for demo consistency across pages

## Phase 3: verify
- [ ] Screenshot checkout, payments, success pages desktop + mobile
- [ ] Checkpoint and deliver

## PROGRESS UPDATE
DONE: currency.ts (lib/currency.ts: DESTINATIONS TZ/KE/UG/RW rates 3390/1780/6150/1840, gbpToLocal, gbpWithLocal); receipts.ts (lib/receipts.ts: PaymentTransaction, loadTransactions/addTransaction/saveLastPayment/getLastPayment, ensureDemoHistory seeds 3 demo txs, downloadReceipt(tsx) builds A4 jsPDF receipt with dark header + gold accent).
DONE: PaymentHistory.tsx page (grid stats, filter chips, search, tx rows with gateway icon/status/receipt download).
jspdf installed.
REMAINING: PaymentSuccess.tsx page (/portal/success?ref=...); wire Checkout onSuccess to saveLastPayment + navigate to /portal/success?ref=...; update Checkout totals to use gbpWithLocal + destination selection (add dest select on step 0/2); add Payments nav link to PortalShell (Wallet & Pay -> /payments); wire routes in App.tsx; verify screenshots; checkpoint; deliver.
Checkout route currently /checkout inside PortalShell; success link = /success?ref=UKSA-...

## UPDATE 2 — verification
DONE: PaymentSuccess.tsx (dark gold header, animated check, summary rows, PDF download button, next steps, orders/dashboard CTAs); wired in App.tsx routes /payments + /success; PortalShell nav updated (Payments link added, mobile bar swapped referrals in). Checkout: dest currency selector on step 0, totals gbpWithLocal, Paystack minor-units dynamic, M-Pesa dialog dynamic, onSuccess records tx to localStorage + navigates to /success?ref=...; bank flow pending status. TSC: no errors.
REMAINING: screenshots checkout /payments /success (desktop); checkpoint; deliver.
