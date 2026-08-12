# Audit findings 2026-08-12

Technical: tsc 0 errors; vitest 6/6 green; no new console errors after 21:41 (older logs are from pre-fix session).

Desktop route audit (logged-in session):
- / OK — full landing page renders all sections.
- /add OK — empty cart empty-state fine.
- /address OK.
- /success BUG — shows "My Orders" list (Orders.tsx) instead of the payment success receipt page. Route mapping issue: /success resolves to Orders component. FIX.
- /referrals BUG — hardcoded fake referrals (Juma M., Grace W., Patrick K.) — CONTENT POLICY violation: never fabricate user-generated/testimonial content; also not per-user real data. FIX: make demo fallback only for logged-out guests; logged-in users show empty state + explain referral mechanics (or real data when referrals table exists).
- /privacy /terms /returns OK.
- /orders, /payments, /tracking, /settings, /wallet, /admin OK (verified earlier).

Remaining to check: mobile viewport (375px), dark mode, language switchers.

/success root cause: PaymentSuccess redirects to /orders when localStorage key "uksa_last_payment" is empty — and the screenshot session had no completed payment in this browser (seed payment exists in DB only). This is expected redirect behavior, NOT a routing bug; but the UX is poor: users arriving at /success from a deep link see Orders page unexplained. FIX: show a proper "no recent payment" empty state with a CTA to view orders instead of an abrupt redirect.

/referrals root cause confirmed: Referrals.tsx shows hardcoded fake friend referrals + fake referral link — violates the content policy. FIX: logged-in → empty state w/ real referral link generation from user ID; logged-out → generic explanation only, no fake names/money.

/portal dashboard: shows hardcoded "Amina" demo data (warehouse counts, recent orders) — acceptable as UI shell but should pull real orders for logged-in users and at minimum show real user name. Flag for Phase-4 discussion.

Checkout page: renders fine step 1 (destination, address, duties toggle).

Mobile (375x812):
- /orders OK — cards stack correctly, filter pills wrap. Bottom nav labels truncated: "Wallet & Pay"/"Payments" cutoff at edge (minor).
- /checkout OK — country cards 2-col, stepper wraps fine.
- / (landing) ISSUE — WhatsApp floating button + banner overlap hero "Paste Link" bar at viewport bottom; also dark-mode toggle and language switch crowded. FIX: shrink/offset WhatsApp button on mobile (bottom-24 or smaller), ensure paste-link bar clears WhatsApp widget.
- Bottom nav mobile labels wrap/truncate on portal pages — minor cosmetic fix: reduce label size or icon-only mode.
