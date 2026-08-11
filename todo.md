# TASK — Queen assistant upgrade 2026-08-11 (CURRENT)

- [x] Rename assistant to "Queen" (button label, panel header, greeting) — DONE in AssistantChat.tsx edits
- [x] Quick-action chips NAV_ACTIONS: Track Orders (/orders), Payment History (/payments), Add Items (/add) — added as component const (still need to render in JSX below)
- [x] Persist conversation in localStorage key "queen-chat-conversation"; restore on refresh; TODO: clear-chat button in header
- [ ] Pass user's orders + payment history into assistant.chat prompt for personalized answers (server side)
- [ ] Finish JSX: render NAV_ACTIONS bar above QUICK_ACTIONS (only when messages<=1, no pending); add clear button (Trash2) in header that clears localStorage + messages
- [ ] tsc clean, live test, checkpoint, deliver

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
