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

# FULL AUDIT — 2026-08-11 (final quality sweep)

## Findings
1. **Checkout runtime crash**: browser console shows "Cannot access 'fwConfigMemo' before initialization" at Checkout.tsx — `useFlutterwave(fwConfigMemo)` called before the memo is defined (TDZ). Currently the memo IS defined above (line 114 vs call at line 130) — but the crash log is from earlier session; re-verify checkout actually renders without error boundary fallback. Fix properly: define fwConfig memo before hook call and never mutate it; compute tx_ref at payment time via state.
2. **fwConfigMemo.tx_ref = ref() mutation** (Checkout line 154) — mutate a useMemo'd object; replace with stable txRef state updated when pay button is clicked.
3. **PaystackButton reference instability** — paystackConfig uses ref() at render; keep (demo OK) but make reference stable via useMemo keyed on dest.
4. **M-Pesa dialog Account uses Date.now().slice(-6) on each render** — minor cosmetic; cache at dialog open time.
5. Check dark mode on /payments, /success, checkout step rendering.
6. Verify all hero/section image URLs load (Landing + portal pages).
7. Verify all routes reachable: /portal, /orders, /add-items, /tracking, /address, /wallet, /referrals, /settings, /checkout, /payments, /success, /, /admin.

## Fixes
- [ ] Fix TDZ + mutation in Checkout (fwConfig)
- [ ] Dark mode pass on payment pages
- [ ] Image URL audit
- [ ] Route smoke test all pages
- [ ] Checkpoint + deliver

# CURRENT TASK — 2026-08-11 (skill update + translations + legal pages)

1. [x] Update competitor-platform-builder skill (SKILL.md + references/payments-localization.md + references/audit-and-delivery.md + build-workflow.md); validated OK.
2. [ ] Translations for payment pages (sw/rw/lg): PaymentHistory.tsx (title, subtitle, stats Total Paid/Transactions/Completed/Pending, search placeholder, filter All, empty state, status labels Paid/Pending/Refunded, receipt tooltip), PaymentSuccess.tsx, Checkout.tsx, any English-only new pages. Use t() via tr(key, lang); add keys to lib/i18n.ts matching in all 4 languages.
3. [ ] Legal pages: /privacy, /terms, /returns (static, PortalShell layout, i18n keys), footer links (foot.privacy/foot.terms already exist + foot.shipping→/returns) and settings page link. Placeholder company details, no fabricated registrations.
4. [ ] Verify (tsc, screenshots, dark mode), checkpoint, deliver.
