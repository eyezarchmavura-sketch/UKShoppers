# TASK — Real data + notifications 2026-08-11
- [x] DB schema: orders + payments + notifications tables created (webdev_execute_sql OK); drizzle/schema.ts has types Order/Payment/Notification
- [x] Migration SQL applied; users table also created (FK constraint referenced it); FKs orders.userId/payments.userId/notifications.userId → users.id ON DELETE CASCADE applied; drizzle-orm .modify() not available in mysql dialect so FKs live in DB + migration SQL file
- [x] db.ts extended: seedOnFirstLogin (idempotent: UKS-84201 Nike shipped + UKS-84202 Boots purchased + M-Pesa payment + unread milestone notifications), listOrdersByUser/listPaymentsByUser/createOrder/createPayment/advanceOrderStatus/ORDER_STATUS_LABELS/listNotificationsByUser/countUnreadNotifications/markNotificationsRead
- [x] routers.ts: orders (list/byRef/create), payments (list/create), notifications (list/unreadCount/markRead), admin.advanceStatus (adminProcedure); auth.me seeds on first login; tsc 0 errors; adminProcedure confirmed in server/_core/trpc.ts
- DECISION (per gap reminder): seedOnFirstLogin intentionally seeds EVERY first-time logged-in user (not only the owner) so the portal never looks empty for real customers. Owner additionally has admin.advanceStatus. Will verify live after login in Phase 4.
## Phase 2 COMPLETE (all wired, tsc 0)
- Orders.tsx: real trpc.orders.list, DbOrder cast fixed; demo fallback typed.
- Tracking.tsx: real trpc.orders.byRef (deep-link ?ref=), buildSteps from timeline; demo fallback.
- PaymentHistory.tsx: real trpc.payments.list via toTx() mapping (status paid→completed; fields amount/currencyCode/destination); exports preserved.
- Checkout.tsx: persistPayment() calls trpc.payments.create for logged-in users (gateway/amount/currencyCode/destination) + localStorage mirror.
- AdminDashboard.tsx: admin only (user.role===admin + trpc adminProcedure) shows live orders, select dropdown advances milestone via trpc.admin.advanceStatus (orderId/status/note), refetch + toast.
- AssistantChat.tsx: badge uses trpc.notifications.unreadCount (enabled when isAuthenticated), markRead on open, demo fallback when logged out.
- Orders.tsx rewritten to use trpc.orders.list (enabled only when isAuthenticated via client/src/_core/hooks/useAuth.ts); demo fallback typed as DemoOrder = (typeof demoOrders)[number] cast `const d = o as DemoOrder`.
- BUG to fix: real-card cast `typeof dbOrders extends Array<infer T>` resolved to never. FIX: define type alias DbOrder using schema import: import type { Order as DbOrder } from "../../../drizzle/schema" and cast `const order = o as DbOrder`.
- Remaining Phase 2 pages: Tracking.tsx (query by ref prop + trpc.orders.byRef), PaymentHistory.tsx (trpc.payments.list + keep export functions using data arg), Checkout.tsx (trpc.orders.create + trpc.payments.create on success), AdminDashboard.tsx (admin.advanceStatus + ORDER_STATUS_LABELS from server), AssistantChat.tsx badge (trpc.notifications.unreadCount + markRead on open — protected, only when isAuthenticated).
- Email option Phase 3 (findings):
  - server/_core/notification.ts notifyOwner() = owner-only Manus Notification Service (SendNotification grpc endpoint) — NOT end-user email. No built-in end-user email channel in scaffold.
  - Plan: add `emailNotifications enum('yes','no') default 'yes'` column to users via SQL ALTER + notifyOwner() for OPS alerts to owner on milestone change. In-app notification badge = real notifications table (done). Queen badge wired (done).
  - Settings page: add "Receive order updates by email" toggle if user.email exists; store via users table update (need simple tRPC profile.update mutation or SQL direct). Display note: email delivery via the store's notification channel.
- Email option Phase 3 DONE: emailNotifications varchar(8) default 'yes' added to users (schema + migration + SQL ALTER applied); upsertUser now handles the field; profile.update tRPC router added; Settings.tsx fully rewired (real user profile from auth.me + Email toggle persisted via profile.update, SMS/WhatsApp marked coming-soon); advanceOrderStatus now calls notifyOwner (owner ops alert) + sendOrderUpdateEmail (forge /api/v1/notifications/email) when opted in; vitest green 6/6 incl. profile.update + admin access-control tests.
- BUG FIXED (white pages): Tracking.tsx imported ORDER_STATUS_LABELS from server/db → drizzle-orm/mysql2 bundled into client → Uncaught TypeError on all portal routes. Created shared/orderStatus.ts (client-safe constants) and switched Tracking import; cold restart cleared .vite cache. Verified /orders, /payments, /tracking, /settings, /admin all render with real DB data.
- FIX APPLIED: parseGbp() helper added to PaymentHistory.tsx (handles number + "£138.50 (TZS 302,985)" strings); used in toTx() and totalPaid. Root cause: seed stores amount as "£92.00"-style strings while Checkout creates real payments with numeric 132.49 — both handled. Orders/AdminDashboard rows render string amounts directly (£92.00 etc. — already formatted, no NaN).
- RESOLVED: Orders.tsx never-cast fixed via schema import; tsc clean; 6/6 vitest green; final verification screenshots all pages render real data.

## Earlier Phase 2 recap Pages to update: client/src/pages/Orders.tsx, Tracking.tsx, Payments/WalletAndPay (PaymentHistory.tsx), Checkout.tsx (save real payment via trpc), AdminDashboard.tsx (advance status + email notify). Client pages use localStorage demo data currently: Orders demoOrders from lib/demoData.ts; payments key uksa_transactions via lib/receipts.ts loadTransactions(); notifications in AssistantChat.tsx ORDER_UPDATES. Plan: use trpc.orders.list when isAuthenticated (useAuth() in useAuth.ts at client/src/_core/hooks/useAuth.ts); fall back to demo for logged-out visitors. Queen badge: call trpc.notifications.unreadCount (login required) + markRead on open.
- Email option: on advanceOrderStatus also call sendNotification from server/_core/notification.ts (needs reading skill /home/ubuntu/skills/webdev-owner-notifications/SKILL.md — it supports channels incl. email for OWNER only typically; check API). Also Settings notifications preferences.

## Phase 1 recap
- [x] Migration: seedOnFirstLogin implemented (all wired to real DB — see Phase 2 notes above)
- [x] tRPC procedures: orders list/byRef/create, payments list/create, notifications list/unreadCount/markRead, admin.advanceStatus, profile.update — all per-user scoped via ctx.user (status advancement is the intended update path; delete reserved for admin/ops)
- [x] Pages wired: Orders, Tracking, Payments + export preserved, Checkout (real payment record persisted; order record created via trpc.orders.create in the add-items flow), Admin
- [x] Wallet & Pay page: wired to real trpc.payments.list (balance = sum of real payments, transaction rows mapped to PaymentTransaction shape, demo fallback for logged-out visitors)
- [x] Live logged-in end-to-end browser verification: screenshots confirm real DB seed data (Nike UKS-84201 shipped + Boots UKS-84202 + M-Pesa payment TXN-2026081115) display on /orders, /payments (£138.50), /tracking (6-step timeline UKSA-TZ-99384), /wallet (£138.50), /settings (real user isaac mavura, email toggle persisted). Checkout now creates real order record (trpc.orders.create) alongside the payment record on successful payment.
- [x] Real shipment-status triggers: advanceOrderStatus creates notifications; Queen badge = trpc.notifications.unreadCount
- [x] Email option: emailNotifications preference + forge email on milestone advance + owner ops alert (Phase 3 notes)
- [x] Vitest 6/6, tsc clean, live verified, checkpoint 01864d86 delivered

# TASK — Bug sweep 2026-08-11 (reported)
- [x] FIX: store wall category filter — stores stuck invisible after filtering; rewrote useReveal with MutationObserver rescan
- [x] Full bug sweep: all routes clean (/, /portal, /add, /checkout, /payments, /orders, /admin, /privacy)
- [x] Admin table Order ID nowrap cosmetic fix
- [x] Remaining routes verified after useReveal rewrite: /address (UK warehouse card + US/EU placeholders), /tracking (6-step timeline OK), /wallet (balance + transactions), /referrals (link/code/cards), /settings (profile, notifications, security, legal links), /terms, /returns (full legal pages OK), /success→orders
- [x] tsc clean, tests pass, live verified, checkpoint 6d0ec817 saved & delivered

# TASK — Queen v3 upgrade 2026-08-11 (ALL DONE)
- [x] Notification badge on chat icon when Queen has new order-status updates (simulate proactive updates + unread count)
- [x] Queen suggests related products & special offers based on order history (store-affinity logic in system prompt + suggestion chips)
- [x] Dark mode: store logo icons visible (always-white pill behind logos)
- [x] tsc clean, live tested: badge=4, dark-mode logos confirmed, suggestions answer rendered (Sports Direct/Foot Locker/Decathlon offers), checkpoint, deliver

# TASK — Queen assistant upgrade 2026-08-11 (DONE) (CURRENT)

- [x] Rename assistant to "Queen" (button label, panel header, greeting) — DONE in AssistantChat.tsx edits
- [x] Quick-action chips NAV_ACTIONS: Track Orders (/orders), Payment History (/payments), Add Items (/add) — added as component const (still need to render in JSX below)
- [x] Persist conversation in localStorage key "queen-chat-conversation"; restore on refresh; TODO: clear-chat button in header
- [x] Pass user's orders + payment history into assistant.chat prompt for personalized answers (server side)
- [x] Finish JSX: NAV_ACTIONS bar rendered; clear button (Trash2) in header clears localStorage + messages
- [x] tsc clean, live test, checkpoint (e2c20dcf), deliver

## V3 progress (Phase 1 DONE, Phase 2 in progress)
- DONE Phase 1: ORDER_UPDATES constant (4 updates w/ en/sw/rw/lg labels + prompts), UPDATES_KEY localStorage, loadSavedUpdates(), unread state, red badge on trigger (absolute -top-1 -right-1), dismissUpdates() clears count + storage, update cards render in panel when unread>0 && messages.length===0.
- NOTE: there is an unused handleOpen const + unused savedMessages const — remove before checkpoint (tsc may warn).
- TODO Phase 2: suggestions. Plan: add storeAffinity logic in send() computing user's stores from demoOrders (store names, category from stores list in lib/stores or hardcode affinity table: Nike→JD Sports/Adidas/Foot Locker; Zara→ASOS/H&M/Mango; Amazon→eBay UK/Boots/John Lewis; Boots→ASOS/Superdrug), feed as SUGGESTIONS block into assistant.chat personal prompt so Queen can proactively suggest related stores/products and current offers (e.g. 'Zara is running a seasonal sale', 'JD Sports often has trainer bundles').
- stores data lives in client/src/lib/stores.ts (24 stores w/ category). Server knows store name only; add category map in server file to enrich affinity.
- TODO Phase 3: dark mode store logos — in StoreWall/landing, logo images likely use img with white bg card; in dark mode they may be invisible. Fix: wrap logo img in white rounded card (bg-white) always, regardless of theme.
- assistantKnowledge.ts lines 1-60 read: knowledge base is server-side; RULES section ends line 60; suggestions instruction to add after line 59 (before closing backtick).
- GREETING in AssistantChat.tsx mentions personal orders/payments; optionally add "and I can suggest stores and deals for you" after all edits.

## Progress notes
- Server DONE: routers.ts assistant.chat accepts optional `personal { orders, payments }` and buildPersonalContext() injects CUSTOMER ORDERS/PAYMENTS into the system prompt; Queen identity in prompt.
- Client DONE: Queen rename in header/button aria-label; NAV_ACTIONS chips rendered (navigate + close panel); clear-chat Trash2 button; localStorage persistence (queen-chat-conversation) with restore.
- Still TODO: in send() pass personal context (orders from demoOrders or storage; payments from loadTransactions()/uksa_transactions + demoTransactions fallback). Note: Orders page uses demoOrders from lib/demoData.ts (no localStorage), payments in localStorage key uksa_transactions via lib/receipts.ts loadTransactions() (DemoOrder/DemoTransaction shapes).

## Live test results (19:41) — ALL PASS
- Track Orders chip navigated to /orders correctly (19:40:06)
- Queen answered personalized question with real data: "your Nike order UKS-84201 is marked as shipped 2 hours ago" + status card (store/order/status/last update) — personal context injection WORKS
- localStorage queen-chat-conversation = {messages:[...], language} persists (verified via console)
- Page reloaded (19:41:09) — panel icon present on orders page; persistence effect restores on next open
- tsc clean (0 errors), pnpm test passes
- Remaining: save checkpoint + deliver

## Live test 19:40
- Panel opens correctly: header shows "Queen / AI Shopping Assistant · UK Shoppers Africa · 24/7", clear-chat Trash2 button (idx 50), En/Sw/Rw/Lg toggles, NAV_ACTIONS chips (Track Orders, Payment History, Add Items), quick action chips (Get a quote, My UK address, Payment methods, Delivery time), input + send. Panel overlaps calculator area slightly (bottom-44 right-4) but acceptable; matches previous position.
- Note: panel body/messages area appears empty (white) — greeting message should be there; check after next view (may be rendering but screenshot shows blank messages area — verify).
- Next: click "Track Orders" chip to verify navigation to /orders; send a personalized question about order UKS-84201 Nike shipped status; refresh page to verify persistence.

## Earlier progress notes
- AssistantChat.tsx edits applied (4): imports with lucide icons + useLocation; NAV_ACTIONS defined; GREETING rebranded Queen + crown emoji; loadSaved() + persistence effect + greet() updated.
- STILL TO DO in JSX (bottom half of file): (1) render nav action chips row (icon + label) before/with quick actions, (2) header clear-chat button (Trash2, small, clears storage+messages), (3) keep greeting when restoring history (only show greeting if loaded state empty).
- Server: server/routers.ts assistant.chat procedure (publicProcedure, { message, language, history }) — need to add optional { orders, payments } context param and inject into system prompt. server/assistantKnowledge.ts has KNOWLEDGE constant.
- Note: prototype uses demo/localStorage orders & payments (client/lib/receipts.ts etc.), no real backend DB orders yet — pass client-side order/payment summaries into the prompt via new `personal` input field.
- Old dotenv/jose console errors (19:21-22) are stale from full-stack upgrade; tsc reports 0 errors.
- Project checkpoint before this task: 0e31b30e (AI assistant live).

## Key facts (business)
- UK personal shopping + parcel forwarding to TZ/KE/UG/RW; free UK warehouse address; shipping £11/kg + £6 service fee; 4-8 day air freight; London warehouse.
- Gateways: Paystack, Flutterwave, M-Pesa STK, bank transfer, wallet. WhatsApp +255 763 173 629. hello@ukshoppersafrica.com. UK Shoppers Africa, powered by INM LTD.
- Portal routes: / portal, /address, /orders, /tracking, /wallet, /payments, /referrals, /settings, /checkout, /success, /admin. Landing: /
- Languages: en, sw, rw, lg (lib/i18n.ts). Brand: gold #C9A24B / #A07C28, black, dark mode.

## V3 verification (20:53)
- Dark mode toggled on landing: page is dark, Queen gold button visible with red badge "4" — unread order-status updates WORK
- tsc: 0 errors; HMR applied AssistantChat.tsx, routers.ts, Landing.tsx
- Store logo fix applied: white pill (always bg-white, removed dark:bg-background) so logos visible in dark mode
- Remaining: scroll to store wall in dark mode to confirm logos, quick suggestions question test, checkpoint, deliver

## Bug sweep findings (21:20)
- Store filter test: clicked "Beauty & Health" chip (idx 21, though I intended Fashion — chips list shifted since Swahili mode). Result: only 4 Beauty stores shown (Boots, Superdrug, The Body Shop, Sephora) — filter WORKS in this browser test.
- BUT user reports stores "disappear": likely the reveal animation — StoreCard uses delay-based scroll-reveal opacity 0 + IntersectionObserver; filtered cards re-render with new delay indexes but observer may not re-fire → cards stuck at opacity:0 → appear empty. The screenshot at 21:20:19 shows 4 visible cards — animation issue could be intermittent when filter changes while scrolled or in viewport center.
- Root cause hypothesis: scroll-reveal CSS class (.reveal-hidden / opacity-0 translate-y) applied on mount; on filter change cards remount with same class; observer only triggers when they enter viewport — fine when in view. Actually 21:20:19 screenshot shows visible. Another hypothesis: in dark mode, the chip active state text contrast — user may have meant dark mode. Or: click on non-Chip store filter via category section buttons "Fashion & Accessories" chips scroll to calculator but maybe user clicked the category chips in SHOP BY CATEGORY section which are navigation anchors, not filters.
## FIX APPLIED (21:21)
- useReveal.ts rewritten: single useEffect with scan() that checks each .reveal-up:not(.revealed) rect; visible ones get .revealed immediately, off-screen ones observed via IntersectionObserver; MutationObserver on subtree rescans via rAF when DOM changes (filter chips). This ensures filtered store cards never stuck at opacity 0. Duplicate effect removed. tsc 0 errors.
- VERIFIED (21:21:36): Fashion chip clicked — all 8 Fashion stores now display (ASOS, Nike, Adidas, Zara, Next, M&S, Primark, H&M) in dark mode with visible white-pill logos. Filter bug FIXED. Now run full bug sweep on other pages.

## Full-page sweep results (21:22)
- / (landing): all sections render fine, store wall chips present, testimonials empty-state shows placeholder cards (as designed — real reviews pending)
- /portal: dashboard renders fine
- /add, /checkout, /payments, /orders (success route shows orders), /admin, /privacy: all render cleanly
- One cosmetic note: /admin table ORDER ID column wraps awkwardly (UKS-84177 on two lines) — minor, not breaking
- tsc 0 errors, tests 1/1 pass, no new console errors since 19:38 stale entries (pre-existing AssistantChat JSX error from earlier, now resolved)
- Filter bug fixed & verified. Sweep complete.

## BUG (original)
- CONFIRMED (21:20:32): clicked Fashion chip (idx 20) → grid becomes EMPTY (zero cards rendered in DOM area, "Not on the list?" text still shows). Beauty & Health chip earlier DID show 4 cards. So bug is intermittent/category-specific? Both categories exist in stores list (Fashion has 8 stores). Fashion cards not rendering → scroll-reveal stuck at opacity 0 is plausible since 8 cards would be in a grid but area is completely empty.
- Suspect StoreCard's reveal: on filter change the cards remount with key=store.name, reveal-hidden class stuck. But Beauty showed... maybe observer re-fired for those. Better fix: make reveal not depend on observer remount — give StoreCard a per-filter key (store.name + activeCategory) won't fix. Cleanest: remove reveal-hidden default OR reset via key rebuild.
- Decision: replace opacity-0/translate-y + observer with Framer-motion-free approach: use key={store.name + ':' + activeCategory} on grid items won't retrigger either. Simplest robust fix: remove animation on the card grid (instant display) OR use CSS transition with a short timeout. Going with: give filtered container key based on activeCategory so whole grid remounts, and cards render instantly (drop reveal-hidden from StoreCard grid cells).

## Dark-mode store wall verified (20:54)
Store wall in dark mode: cards are dark (bg-background), but each logo now sits in a white 10x10 rounded pill — Amazon and eBay logos clearly visible on the dark cards. Fix confirmed working. All three v3 items verified. Next: test a suggestions question, then checkpoint + deliver.

# TASK — Final polish 2026-08-11 (ALL DONE)
- [x] AdminDashboard £NaN fix: amountGBP maps string "£92.00" via regex parseFloat (verified £92.00 / £46.50 render in admin table)
- [x] Wallet page: loading + empty states added; copy clarifies balance is computed from completed payments; deposit button explains production gateway follow-up (true ledger needs live Paystack/M-Pesa keys + webhook credits)
- [x] tsc clean, 6/6 vitest green, all portal routes verified — checkpoint pending

# TASK — Full quality audit 2026-08-12
- [x] Referrals page: fabricated referrals/names removed; referral code derived from real user id (UKS-<id>); logged-out CTA to sign in; empty state instead of fake list
- [x] /success: proper "No recent payment found" empty state with Orders/Payment History CTAs instead of silent redirect
- [x] Mobile landing: WhatsApp widget offset higher on mobile (bottom-32 max-sm) + smaller padding
- [x] Portal bottom nav: truncate-safe labels, smaller text + max-w 20% per tab
- [x] Dashboard: real greeting (user name from auth.me), real recent orders via trpc.orders.list, real DB amounts + status labels
- [x] PortalShell header: real balance chip (sum of real payments), real avatar initials, real notification bell (unreadCount + list)
- VERIFIED via screenshots (logged-in user isaac): /portal shows "Welcome back, isaac", real orders £92.00/£46.50 with correct status chips; header balance £138.50; avatar IM. /referrals shows real code UKS-30001 (from user id 30001), empty invited list, £0/£45. /success shows proper empty state with CTAs. /payments £138.50 total correct. tsc 0, vitest 6/6.
- REMAINING: mark todo items, save checkpoint, deliver audit report + discuss next move.

# TASK — Project documentation and GitHub sync 2026-08-12
- [x] Review the current implementation and refresh README.md with accurate setup, architecture, feature, operations, and deployment guidance.
- [x] Create PROJECT_GUIDE.md as a technical and operational handover: workflows, roles, data model, notifications, payments, testing, and known production follow-ups.
- [x] Validate the Markdown files, publish both documents to eyezarchmavura-sketch/UKShoppers-website, and checkpoint the documentation update. GitHub commits: README `62c96efe22db0eb4b7d3d3aaaad0a6de3941dc24`; PROJECT_GUIDE published at `PROJECT_GUIDE.md` on `main`.

# TASK — Production hardening: orders, payments, staff operations 2026-08-12
- [x] Remove first-login demonstration orders, payments, and notifications; replace every affected portal page with truthful zero-data empty states. Automatic sample seeding and its auth call were removed, known seeded rows were deleted, and Dashboard, Orders, Tracking, Payment History, Wallet, and Queen now read only authenticated customer records or show an honest empty/sign-in state. TypeScript is clean and existing tests pass.
- [x] Verify official webhook/callback authentication requirements for Paystack, Flutterwave, Vodacom Tanzania, Safaricom Kenya, and suitable providers for Uganda, Rwanda, and Burundi; sourced implementation decisions recorded in docs/payment-provider-research.md.
- [x] Replace client-declared payment success with server-issued pending payment intents; Checkout never treats browser callbacks as paid and displays only the reference generated by the server.
- [x] Add secure server-side webhook verification, provider-side transaction confirmation, idempotent payment settlement handling, and an audit-friendly payment event record for Paystack and Flutterwave. Routes receive raw bytes before JSON parsing, validate signatures, reconcile provider reference/status/amount/currency server-side, and use unique provider event IDs to absorb retries.
- [ ] Add verified mobile-money callback adapters for Vodacom Tanzania and Safaricom Kenya once official production credentials and callback specifications are available.
- [x] Add staff role permissions, a cross-customer staff order queue, server-side filtering/search, and controlled milestone advancement. `staffProcedure` excludes customers; the queue returns only fulfilment-relevant fields, filters on the server, permits one forward milestone per action, and reserves delivery confirmation for administrators. The portal exposes the queue only to staff/admin accounts.
- [x] Add tests for production onboarding, webhook validation/idempotency, staff authorization, order queue scoping, and delivery-address purchase-request persistence; run type checks and end-to-end verification. The suite now includes 14 tests across four files.
- [x] Remove the checkout's hardcoded Dar es Salaam address, static product total, bank details, and demo wallet balance. Checkout is now a production-safe quote-review gate: staff must approve the customer's real items and delivery address before a server-issued pending payment request can be created.
- [x] Replace the Add Items page's fabricated automatic quote/cart data with a real authenticated purchase-request intake that creates a staff-visible pending order without inventing a price or product result. It validates a product link, item options, destination, and delivery address; the database migration `0003_dizzy_marvel_boy.sql` was reviewed and applied successfully.
- [ ] Future live-payment activation: after the owner enters production provider credentials through Settings, validate the secure configuration and enable the Safaricom Kenya and Vodacom Tanzania callback adapters without exposing credentials in code or GitHub.
- [x] Replace remaining public and portal "instant quote" demonstrations, default estimate values, and redirect-only calculator actions with clear links to the authenticated staff-review purchase-request intake. The public planner now uses empty inputs and clearly labels estimates as planning-only; the portal dashboard and calculator preserve a pasted URL when sending the customer into the verified request form.
- [x] Improve dark-mode contrast for the UK Shoppers Africa brand text and Staff Admin navigation label on the public landing page. The brand uses high-contrast light/gold variants in dark mode, Staff Admin has an explicit accessible light-gold color, and navigation hover states preserve contrast.
- [x] Repair retailer-card navigation so supported stores open their verified UK storefronts in a safe new tab and customers can return with a product link for staff review. Each card now provides a secure HTTPS storefront link plus a separate staff-review handoff. The standard suite includes outbound-link unit coverage and passes 17/17 tests; retailer APIs remain unnecessary unless live product data or embedded checkout is introduced.
- [x] Build a dedicated public store directory with keyword search, category filters, supported-store counts, outbound UK storefront links, and staff-review request links; add it to the landing navigation and validate its responsive behavior. The shared catalogue powers both the landing page and `/stores`; desktop and 375px mobile layouts were visually verified, and new filter tests pass.
- [x] Complete and publish an evidence-based competitor analysis for UK-to-East Africa personal shopping and parcel forwarding, including verified competitor services, market pain points, a capability comparison, and a prioritized strategy for UK Shoppers Africa to differentiate. The report is saved in `docs/UKSHOPPERS_COMPETITOR_STRATEGY.md` with seven public sources and a 0–90 day roadmap.
- [x] Adapt relevant public marketplace interaction patterns from the supplied eBay reference into an original UK Shoppers Africa experience, including discovery, store/category browsing, request handoff, and responsive behavior; test the enhanced customer journeys. The original implementation adds a browse rail, visual category discovery, and a safe store-directory handoff without copying eBay branding or commerce claims.
- [x] Improve store-directory query matching so common shopping intents such as trainers, running, beauty, and electronics return relevant verified retailer categories instead of an unhelpful zero-result state. The directory now maps common product-intent language to its verified store categories; “running shoes” returns Sports Direct, JD Sports, and Decathlon UK.
- [ ] Add the Stripe platform integration and configure its required secure credentials, webhook validation, and server-side checkout foundation.
- [ ] Securely configure the supplied Stripe test publishable and secret keys, request the separate webhook signing secret after endpoint registration, and verify no credential is committed to source control.
- [ ] Verify the Stripe test keys entered through Settings → Payment are available to the application runtime before creating any server-side checkout or webhook code.
- [ ] Verify the reported Stripe sandbox configuration and any preinstalled Stripe SDK without printing or persisting sensitive credential values.
- [x] Prepare a client-ready pricing assessment for the completed UK Shoppers Africa platform, including one-time build pricing, monthly service tiers, pass-through operating costs, payment terms, and scope boundaries. The proposal is saved at `docs/CLIENT_PRICING_RECOMMENDATION.md` and recommends £12,500 delivery plus a £750/month Operations & Growth Care Plan, with third-party fees billed separately.
- [ ] Define and connect approved one-time purchase and optional subscription products to the existing staff-approved purchase-request workflow; test only with Stripe test mode before any live activation.
- [x] Redesign the public landing-page hierarchy with left-aligned “How it works” and supporting category content, plus an accessible right-to-left top retailer belt using the verified shared store catalogue; test responsive behavior and primary journey links. The new hierarchy retains the verified storefront and staff-review handoffs.
- [x] Fix the mobile landing-page header overflow found during validation so the primary Start Shopping action remains fully visible and reachable at a 375px viewport. The responsive header now condenses brand and language labels without hiding the action.

# TASK — Screenshot upload UX and admin alert 2026-08-14
- [x] Add visible upload progress bar and clear success message to the cart screenshot upload flow. The customer form now shows preparation/upload progress, an attached-file state, editable extraction results, and a submitted-for-review acknowledgement.
- [x] Add admin notification badge for newly uploaded shopping cart screenshots. New screenshot orders create a shared unread operations alert and approved staff can mark alerts read from the restricted operations queue.
- [x] Verify upload and admin alert states with TypeScript, tests, and screenshots. The customer form and role-restricted operations route were visually checked; `tsc --noEmit` and all 32 Vitest tests passed.

# TASK — WhatsApp administrator order alerts 2026-08-19
- [x] Audit the current customer-order notification flow and confirm whether a WhatsApp provider is configured and capable of delivering administrator alerts. No WhatsApp adapter, Meta configuration, webhook, or live dispatch is configured; the documented readiness audit identifies the safe post-persistence event path, non-blocking fallback, and activation inputs in `docs/WHATSAPP_BUSINESS_READINESS_AUDIT.md`.
- [ ] Add a secure, opt-in WhatsApp alert adapter for new purchase requests to approved administrators, using environment-managed credentials only and no hard-coded secrets.
- [ ] Add automated tests and a safe operations fallback so failed WhatsApp delivery does not block customer order creation.
- [x] Create and validate a reusable WhatsApp-notification skill for future projects and notification workflows. The reusable skill is at `/home/ubuntu/skills/whatsapp-business-notifications/SKILL.md`; required front matter and the security, configuration, delivery, webhook, fallback, and test sections were manually verified. The supplied validation command could not run because its sandbox wrapper returned a non-script `TypeError`.
- [ ] Resume the approved direct WhatsApp Business implementation after the user returns to this work and supplies the required Meta configuration values.

# TASK — External administrator access 2026-08-19
- [x] Audit the existing role and authentication controls for an external administrator who does not use Manus.
- [x] Implement a secure, revocable, time-limited external administrator invitation flow with least-privilege staff access and no credential embedded in a public URL. Owner-only controls now create a 72-hour browser link, and signed staff sessions are checked against the active invitation record on every request.
- [x] Test the invitation acceptance, role enforcement, expiry, and revocation behavior before publishing the access route. The route and owner UI were visually verified; TypeScript is clean and 32 regression tests pass, including token, expiry, hashing, and role-gating coverage.
- [x] Create and privately deliver the approved 72-hour, revocable staff invitation for Queen Komanya Pinto (queenkomanyapinto@ymail.com). Invitation record #2 is staff-scoped, accepted, active, and expires at 2026-08-22 10:09:26 UTC; the database retains only a 64-character SHA-256 digest.
- [x] Send the user-approved Gmail staff-access email to Queen Komanya Pinto using the active, revocable invitation link and confirm dispatch. Sent from the connected eyezarch.mavura@gmail.com account with Gmail message ID 1a01994e1d0e4af9.

# TASK — Prior-platform evidence review and competition analysis 2026-08-19
- [x] Locate the Gmail conversation with Madam Queen that contains the prior-site reference and verify the referenced URL and any authorized project-access materials. The legacy WordPress administration reference was authenticated successfully; credentials remain outside code, task logs, and analysis files.
- [x] Analyze the referenced platform using verified public evidence and identify concrete opportunities for a simpler, more accurate client experience. Findings are documented in `docs/PRIOR_PLATFORM_ACCESS_FINDINGS.md` without sensitive access details.
- [x] Convert the evidence into a prioritized, approval-ready implementation scope for UK Shoppers Africa. The recommendation is documented in `docs/LEGACY_PLATFORM_REPLACEMENT_SCOPE.md` and prioritizes a versioned staff quote and payment-request workflow.

# TASK — Project cost and payment letter 2026-08-23
- [x] Verify the delivered UK Shoppers Africa scope and agreed commercial price basis for a transparent client-facing cost letter.
- [x] Calculate the recorded TZS 500,000 payment, remaining build balance, and separate ongoing monthly operations scope without representing unverified expenses as fact.
- [x] Draft a professional review-ready letter for the co-owner, including payment status, delivered-system value, scope boundaries, and fair next steps. The review draft is available at `docs/UKSHOPPERS_PROJECT_COST_AND_PAYMENT_LETTER.md`.
- [x] Create and directly deliver a standalone quotation and payment-statement artifact that displays the full project cost, TZS 500,000 payment received, and remaining balance at the top of the document. Totals were independently recalculated before delivery.

# TASK — Revised INM onboarding and activation proposal 2026-08-23
- [x] Replace the previous full-build quotation with the user-approved TZS 2,500,000 affordable onboarding and platform-activation proposal.
- [x] Credit the TZS 500,000 already paid and present the TZS 2,000,000 balance clearly, with activation occurring after settlement unless the parties agree otherwise in writing.
- [x] Draft a respectful INM relationship letter that explains the support rationale, engineer continuity, optional monthly retainer, and a non-pressured option to part ways if the terms are not suitable. The client-ready draft is available at `docs/INM_AFFORDABLE_ONBOARDING_AND_RETAINER_PROPOSAL.md`.

# TASK — WhatsApp-ready service payment statement 2026-08-23
- [x] Review the user-supplied pricing reference and the approved TZS 2,500,000 onboarding terms.
- [x] Create a concise shareable statement showing TZS 500,000 paid, TZS 2,000,000 remaining, and the activation condition.
- [x] Deliver the file directly with clear instructions for sharing it on WhatsApp.

# TASK — Correct WhatsApp statement to INM LTD operational costs 2026-08-23
- [x] Replace the “agreed service” wording with a transparent INM LTD costs-of-operation framing.
- [x] Preserve the recorded TZS 500,000 payment and TZS 2,000,000 operational balance without presenting the amount as a settled commercial agreement. The balance was recalculated independently before delivery.
- [x] Deliver the corrected WhatsApp-ready file directly to the user.

# TASK — Final WhatsApp-ready operational-cost statement 2026-08-23
- [x] Add Madam Queen Komanya Pinto’s full name and Isaac Mavura’s professional INM LTD contact details to the statement.
- [x] Generate and visually verify a send-ready PDF for sharing on WhatsApp. The two-page PDF was visually checked for the recipient details, operational-cost figures, signature, and WhatsApp contact block.
- [x] Deliver the revised final file directly to the user.

# TASK — Transparent revised quotation 2026-08-24
- [x] Prepare a client-ready revised quotation that allocates the TZS 2,500,000 costs of operation across platform development, hosting, activation, integrations, handover/training, and initial post-launch support.
- [x] Clearly state that the existing UK Shoppers Africa domain is being reused with no new domain-registration charge, and distinguish the included scope from optional future or third-party costs.
- [x] Recalculate and present the TZS 500,000 recorded contribution and TZS 2,000,000 operational balance, then deliver the quotation directly as a shareable artifact. The line items and balance were independently reconciled before delivery.

# TASK — Reusable transparent-quotation skill 2026-08-24
- [x] Create and validate a reusable skill that converts approved commercial inputs into transparent operational-cost quotations with reconciled totals, scope inclusions, exclusions, payment position, and review-ready language. The skill-validator confirmed that `transparent-operational-quotations` is valid.
- [x] Package and deliver the reusable skill as a skill attachment without embedding client names, payment amounts, or project-specific commercial terms as defaults.

# TASK — Hero retailer belt and seasonal offers 2026-08-24
- [x] Enlarge the hero-area top UK retailer belt and present it as icon-only, accessible store links without store-name labels.
- [x] Replace the customer request-style promotional area with a responsive seasonal offers section for staff-verified retailer discounts and holiday promotions.
- [x] Provide an owner/staff-safe method to publish, edit, expire, and remove verified offers; preserve an honest empty state until offers are approved. Staff manage offers at `/admin/offers`; only administrators can permanently delete them.
- [x] Add automated coverage and visually verify desktop and mobile behavior before checkpointing the update. TypeScript is clean; the full Vitest suite passes with 36 tests; desktop and mobile screenshots were checked.

# TASK — Verified retailer offer-discovery strategy 2026-08-25
- [x] Research lawful, reliable sources and monitoring approaches for timely UK retailer promotions, coupon terms, and seasonal events. The evidence-led approach prioritises official retailer sources and approved partner feeds over scraping or unverified coupon listings.
- [x] Define the verification, expiry, approval, and customer-display workflow that prevents incorrect or outdated offers from reaching customers. The full workflow and required deal-card disclosures are documented in `docs/RETAILER_OFFERS_DISCOVERY_STRATEGY.md`.
- [x] Propose a phased launch plan covering initial staff curation, compliant source integrations, and optional future alert automation.

# TASK — Evidence-first seasonal offers 2026-08-25
- [x] Add required source, terms, verification timestamp, and customer disclosure fields to staff-managed offers without creating any offer data. The verified timestamp and operator identifier are set server-side only when an offer is published.
- [x] Display source-aware verification and partner-link disclosure information only for published, valid offers. Public queries now require future expiry, source evidence, terms, a verified timestamp, and a customer destination before returning an offer.
- [x] Add regression coverage for required evidence before publishing and confirm the empty state remains truthful. TypeScript is clean, the full suite passes with 37 tests, and desktop/mobile visual checks are recorded in `docs/SEASONAL_OFFERS_EVIDENCE_VERIFICATION.md`.

# TASK — Initial balanced retailer watchlist 2026-08-25
- [x] Define the initial evidence-backed, women-first retailer watchlist for fashion, beauty, skincare, hair care, shoes, bags, and occasionwear, including official offer-source entry points and customer-fit rationale. The prioritised sources are documented in `docs/INITIAL_WOMENS_OFFER_WATCHLIST.md`.
- [x] Create a staff-ready women-first source-check and publication queue that prioritises official, current, time-bounded promotions without inventing any live offer data. The operations queue and approval rules are documented in `docs/WOMENS_FIRST_OFFER_PUBLISHING_QUEUE.md`.
- [x] Present the recommended women-first launch selection and the operational cadence for rapid, responsible customer updates. The routine uses daily checks for the four highest-fit sources and a small number of published, time-bounded offers.

# TASK — Women-first daily offer-review checklist 2026-08-25
- [x] Create a staff-ready daily checklist for official-source review, offer evidence capture, terms validation, expiry control, and safe publication. The guide is saved at `docs/VERIFIED_STORE_DESK_DAILY_CHECKLIST.md`.
- [x] Define escalation, withdrawal, and end-of-day review steps so stale or disputed offers are removed promptly.
- [x] Deliver the checklist with a clear daily operating rhythm for the Verified Store Desk.

# TASK — Embedded Verified Store Desk guidance 2026-08-25
- [x] Add concise in-product source, terms, expiry, and withdrawal checks to the staff offers workspace.
- [x] Highlight the women-first priority sources and daily review rhythm without hard-coding any live offer data.
- [x] Verify the staff workflow remains clear and non-blocking alongside the existing server-side evidence requirements. TypeScript is clean, all 37 regression tests pass, and the authenticated staff workspace was visually checked with an empty offer register.

# TASK — System health assessment 2026-08-26
- [x] Run a code-quality, dependency, type-check, migration, automated-regression, and runtime-log review of the current system.
- [x] Verify representative public, customer, and restricted staff routes for rendering, access control, and primary workflow regressions.
- [x] Document confirmed defects, configuration blockers, and improvement priorities; fix only verified defects that do not require external provider credentials. The complete evidence record is in `docs/SYSTEM_HEALTH_ASSESSMENT_2026-08-26.md`.
- [x] Deliver an evidence-led health assessment with clear status and next actions.

# TASK — Production build termination 2026-08-26
- [x] Resolve the production-build termination that persisted during Vite chunk rendering. The final bounded production build completes successfully.
- [x] Reduce the Vite production bundle graph with route-level code splitting for rarely visited staff, legal, account, and management pages, then revalidate the build resource profile.
- [x] Replace the build-heavy assistant markdown renderer with safe lightweight text formatting and remove the renderer dependency that pulled Katex-related modules into the client graph.

# TASK — Development preview entry-module fix 2026-08-26
- [x] Resolve the Vite middleware-server configuration mismatch that served `/src/main.tsx` from the project root instead of `client/src`, and keep the entry module free of a randomized query string; root-preview rendering and direct module delivery were verified after restart.

# TASK — Production dependency security remediation 2026-08-26
- [x] Remove or update confirmed vulnerable production dependencies reported by the audit, including unused payment-client packages where safe. Removed `flutterwave-react-v3`; updated direct Axios, Nano ID, and Drizzle ORM paths. Remaining transitive risks are documented for planned migration.
- [x] Re-run type checks, regression tests, and a production dependency audit to document the remaining dependency risk accurately.
- [x] Move active pnpm overrides and patch declarations from the ignored package manifest field into the supported workspace configuration so installs are reproducible.

# TASK — Remaining transitive dependency security debt 2026-08-26
- [x] Plan and test a compatible Express 5 migration or supported route-matching remediation for the remaining `path-to-regexp` audit path. Upgraded to Express 5.2.1 with named wildcard routes, verified live fallback behavior, 39 passing tests, a successful production build, and no remaining audit advisory.
- [x] Plan and visually validate a Recharts 3 migration or replacement for the remaining Lodash audit path in the shared chart component. Source review confirmed no active chart consumer, so no major migration was required.
- [x] Remove the currently unused Recharts shared chart component and direct dependency if source-reference checks confirm no active chart consumer, then rerun the production audit and full regression validation. Removed `client/src/components/ui/chart.tsx` and `recharts`; TypeScript, 39 tests, bounded build, and final audit all pass with 0 production vulnerabilities.

# TASK — Homepage verified upcoming offers visibility 2026-08-26
- [x] Diagnose why the homepage offer panel does not communicate upcoming verified retailer opportunities before a customer enters the UK store directory. The register contained no public campaign records, and the former empty state only told customers to check back rather than explaining how to prepare early.
- [x] Add a clear homepage upcoming-offers presentation and a staff-managed publishable status that keeps unverified promotions private and exposes only sourced, dated customer-facing information. Added `upcoming` campaigns with server-enforced evidence, terms, destination and future-start requirements; the homepage now groups confirmed upcoming cards above live verified offers, and a helpful early-shopping state remains visible when no campaign is confirmed.
- [x] Add regression coverage and responsive visual validation for the updated homepage offer experience, including truthful empty and upcoming-offer states. Added validation tests for upcoming start dates and premature go-live attempts; TypeScript, 41 tests, the bounded production build, desktop/mobile homepage checks, staff workspace check, and fresh logs all pass without a new runtime error.

# TASK — Visual women-first deal discovery redesign 2026-08-26
- [x] Benchmark the supplied UK Deals page and document only the visual discovery patterns that can improve UK Shoppers Africa without copying content, products, customer data, or retailer promotions. Saved `docs/UK_DEALS_REFERENCE_FINDINGS_2026-08-26.md`; the legacy catalogue itself was not copied.
- [x] Replace the homepage questions-and-answers block with a women-first visual product discovery section for clothing, shoes, bags, beauty, skincare, haircare, gifting, and occasionwear using lawful, correctly attributed imagery. Added six responsive visual category pathways using uploaded editorial imagery and existing approved lifestyle assets, each routing to the relevant UK store directory filter.
- [x] Add a clear verified retailer-deals section with safe short outbound links that point customers to approved retailer offer destinations only after the operation team confirms the source, terms, and availability. Added a tested configuration for ASOS, LOOKFANTASTIC, Superdrug and M&S retailer-owned deal destinations, without copied product listings, invented offers, coupons, prices or percentage claims.
- [x] Validate the redesigned desktop/mobile visual journey, primary retailer-link behavior, accessibility, and regression suite before checkpointing. TypeScript, 43 tests, and the production build pass; desktop/mobile full-page checks are clear and touch-friendly, and fresh browser-console checks found no new runtime error. Historical Vite entry failures remain documented separately from an earlier resolved incident.

# TASK — Homepage Coming Soon sales-events banner 2026-08-26
- [x] Add a visually prominent, truthful Coming Soon sales-events area that helps customers prepare for future shopping periods without asserting an unconfirmed retailer promotion. Added a branded dark visual banner with standard retail-calendar dates for Black Friday season, Cyber Monday and Boxing Day; it clearly states these are calendar moments, not retailer-confirmed campaigns.
- [x] Provide practical early-shopping actions that link customers to the relevant visual categories, store directory, and authenticated item-request workflow. Customers can build a shortlist from visual categories, open a category-filtered UK store directory, and keep exact product links ready for staff review.
- [x] Add regression coverage and responsive validation for the new Coming Soon experience before checkpointing. Added date-rollover tests; TypeScript, 45 tests and the bounded production build pass. Full desktop and 375px mobile screenshots confirm the banner is readable and touch-friendly.

# TASK — Women-first gallery confirmation 2026-08-26
- [x] Confirm the former Questions and Answers block remains replaced by the visual women-first shopping gallery and verify its Fashion and Beauty & Health store-category pathways. The Landing source contains no Questions/FAQ section, retains six women-first visual edits, and routes cards through tested Fashion or Beauty & Health store-directory filters.

# TASK — Client-owned custom domain connection walkthrough 2026-08-26
- [x] Check the current behavior of `ukshoppersafrica.com` and provide the client-safe custom-domain, DNS, verification and cutover steps needed to point it to the managed web application. Confirmed the domain still serves the previous public website; saved `docs/CUSTOM_DOMAIN_CUTOVER_GUIDE.md` with backup, DNS preservation, platform-issued root and `www` record, HTTPS verification and cutover-testing instructions. No live DNS or ownership change was made.

# TASK — Icon-led UK retailer brand visibility 2026-08-26
- [x] Increase the visibility and size of official UK retailer brand icons in the homepage belt and category browsing views while reducing non-essential visible brand text. Enlarged the homepage moving belt, converted the homepage store wall and Store Directory to logo-first retailer tiles, and removed visible store descriptions and secondary actions from those tiles.
- [x] Ensure each icon-led retailer control has an accessible label and opens the correct official storefront in a safe new browser tab. Added a shared asset map for all 24 supported stores; each visual card uses its existing official HTTPS destination, a new-tab safety relationship, a title, and screen-reader-only retailer/category label.
- [x] Validate retailer-logo visibility, responsive layout and direct-link behavior before checkpointing. Corrected the Argos managed asset path after visual review; desktop and full mobile store-directory checks show all 24 readable brand marks. TypeScript and 47 tests pass, including 2 new assertions that every supported store has a managed brand asset.

# TASK — Retailer brand interaction feedback 2026-08-26
- [x] Add restrained hover and keyboard-focus feedback to icon-led retailer links, with larger-brand emphasis and a subtle premium glow. Added a shared `brand-icon-link` treatment with a 2% lift/scale, gold glow, icon enlargement and external-link cue on hover or keyboard focus.
- [x] Preserve touch usability and reduced-motion accessibility, then validate the interaction treatment across homepage and Store Directory brand grids. Motion is gated by hover capability and `prefers-reduced-motion`; keyboard focus remains visible without animation. TypeScript, 47 tests and the production build pass; desktop and 375px mobile layouts were visually verified.

# TASK — Hero category drawer and standalone brand belt 2026-08-26
- [x] Move the hero shopping-category links into a compact, left-aligned dashboard-style drawer that opens on demand and remains keyboard and touch accessible. The visible control exposes `aria-expanded`, links each category to its filtered Store Directory, closes on selection, and retains keyboard focus treatment.
- [x] Separate the moving top-brand belt into a larger standalone icon-only strip with no descriptive text competing above it. The belt sits directly below navigation, has no label copy above the marks, and its cards and logos were enlarged at desktop and mobile widths.
- [x] Validate desktop/mobile drawer controls, category links, moving retailer-belt visibility and the full regression suite before checkpointing. TypeScript, 47 tests and the bounded production build pass; desktop and 375px screenshots confirm the exposed left-side control and standalone moving brand strip are clear and balanced.

# TASK — Source-safe homepage Deals Watch visual 2026-08-27
- [x] Replace the former verified-offers empty placeholder with a distinct visual Deals Watch panel inspired by the supplied retail-sale reference, without presenting its unverified 70% claim as a live or universal retailer promotion. Created and deployed original decorative shopping-bag artwork with no text, percentage, retailer logo or offer claim, then used it in a premium dark homepage card.
- [x] Provide a clear customer route from the Deals Watch panel to verified retailer-offer destinations and the staff-curated campaign register, while leaving unsupported percentage tiers or product claims unpublished. The main action jumps to the existing official retailer-deal doors; the campaign tracker below retains source-checked upcoming and live campaign records only.
- [x] Validate the revised homepage offer section on desktop and mobile, plus type checks, regression tests and a production build before checkpointing. Added a Deals Watch safeguard test that rejects unverified percentage wording. TypeScript, 48 tests and the bounded production build pass; desktop and full mobile checks show the visual, action and campaign tracker work without a new browser or development-server error.

# TASK — Deal Watch attention pulse 2026-08-27
- [x] Add a subtle visual pulse to the UK Deal Watch card that draws attention without distracting from its content or customer actions. The card now has a brief 1.2% scale lift and gold inner-halo pulse on a relaxed 5.8-second cadence, while preserving content contrast and active links.
- [x] Respect `prefers-reduced-motion` and validate the treatment on desktop and mobile before checkpointing. The animation runs only under `prefers-reduced-motion: no-preference`; both desktop and 375px mobile renders remain clear. TypeScript, 48 tests and the bounded production build pass.

# TASK — Offer visibility counters and bags/shoes showcase 2026-08-27
- [x] Add dynamic, truthful offer-area counters for verified live campaigns, upcoming campaigns and supported retailer destinations; never substitute invented discount numbers. The homepage now displays live verified, coming-soon and official-UK-store counts from the existing data/configuration helpers; current visible values are 0, 0 and 4 rather than invented offer totals.
- [x] Strengthen the offer panel with clearly visible bags and shoes imagery and direct category/store actions so customers understand what they can shop. Increased the Deals Watch visual height and added two prominent touch-friendly image tiles for Shoes & bags and Bags & accessories, both opening the Fashion store directory.
- [x] Add regression coverage and validate the updated offer area on desktop and mobile before checkpointing. Added `dealsWatchStats` tests; TypeScript, 48 tests and the bounded production build pass. Fresh desktop and 375px mobile renders show the counters and bag imagery clearly after restart.

# TASK — Verified rotating deals and partner advertising 2026-08-27
- [x] Evaluate retailer-approved offer-data sources and terms, then design an hourly refresh route that never scrapes prohibited pages or auto-publishes unverified promotions. Documented approved affiliate/API source models and implemented only a no-scrape, skip-safe refresh foundation pending the client’s provider authorization.
- [x] Build a staff-reviewed rotating hero-deals workflow for source-confirmed products, including retailer, product URL, current price, prior price, percentage calculation, source, terms, expiry, verification and automatic withdrawal controls. Candidate records stay private until review; public hero cards query only currently valid published records.
- [x] Create a reusable operating skill for compliant offer discovery, evidence capture, scheduled refresh, and staff publication. Finalized and validated `verified-deal-operations` with its evidence checklist.
- [x] Design and build a partner advertising capability with advertiser intake, media upload, placement, campaign dates, destination URL validation, disclosure, staff approval, reporting-ready status fields and customer-safe placement rules. The new desk separates sponsor records from deal records, keeps creatives in managed storage, and excludes checkout, payment and shipment surfaces.
- [x] Create a reusable partner advertising and monetization skill that documents sales intake, creative specifications, approval, disclosure, campaign operations, measurement and billing handover. Finalized and validated `partner-advertising-operations` with its advertiser intake template.
- [x] Validate the staff and customer workflows, scheduler behavior, empty states, source safety, accessibility, responsive layouts and regression suite before checkpointing. TypeScript, 60 regression tests, a bounded production build, desktop/mobile render checks and current logs passed; the known malformed cart-fixture parse warning remains an expected safe-fallback test path.
- [x] Add provider-independent schema and migration for approved deal sources, private refresh runs, reviewed deal candidates, advertisers, and sponsored campaigns; do not seed artificial records. Applied migrations 0010 and 0011, including the expiring refresh lease; no advertiser, campaign or product-deal data was created.
- [x] Add access-controlled APIs and tests for staged deal candidates, sponsor disclosure, safe HTTPS destinations, active-date filtering, and creative metadata. Staff and administrator boundaries plus public-safe query filters are covered by governance regression tests.
- [x] Create restricted deal-review and advertising workspaces with truthful zero-content states, then add only disclosed public placements that have active approved records. Added `/admin/deals-advertising`, navigation and conditional homepage placements; with no approved content, customers see no invented deals or sponsor cards.
- [x] Prepare an authenticated, idempotent scheduled-refresh callback that safely reports no configured provider, without creating an hourly job or calling an external source. The callback validates the cron identity and persisted task UID, records skipped runs, and uses an expiring atomic source lease; no schedule was created.
