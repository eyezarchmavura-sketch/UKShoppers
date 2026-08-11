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
