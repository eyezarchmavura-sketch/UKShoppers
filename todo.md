# TASK — AI shopping assistant 2026-08-11 (current)

- [x] Upgrade project to web-db-user (backend + LLM access) — done, jose installed, tsc clean, server running
- [x] Read builtin-llm-models skill (DONE — notes below)
- [x] Create assistant knowledge base: server/assistantKnowledge.ts (business model, site functionality, pricing, gateways, markets, FAQ)
- [x] Backend: assistant.chat tRPC procedure (publicProcedure) using invokeLLM, gpt-5-mini, knowledge system prompt + history + language-enforced, maxTokens 1200, failure fallback
- [x] Chat widget UI: AssistantChat.tsx — gold floating button (bottom-24 right-6, above WhatsApp widget), dark header panel, messages, input, en/sw/rw/lg toggles, Streamdown markdown, quick action chips, per-language greeting
- [x] Mount widget in PortalShell.tsx and Landing.tsx
- [x] Verified live: English pricing+payment answer and Kiswahili parcel-journey answer render correctly; tsc clean; pnpm test passes (1/1); old 18:47 vite HMR errors are stale from the full-stack upgrade, no new errors since — checkpoint & deliver

## LLM invocation notes (from builtin-llm-models skill)
- Webdev server: import { invokeLLM, listLLMModels } from "./_core/llm" (in server code)
- invokeLLM({ model, messages, maxTokens }) — OpenAI chat completions shape, auto retries; NO streaming
- Models snapshot: gpt-5-mini (default cheap/fast workhorse — USE THIS), gpt-5-nano, gpt-5, claude-haiku-4-5, claude-sonnet-4-6, gemini-3-flash-preview
- For GPT use max_completion_tokens to cap output; for Claude max_tokens > budget_tokens; for Gemini use max_tokens (NOT max_completion_tokens)
- Credentials BUILT_IN_FORGE_API_URL/BUILT_IN_FORGE_API_KEY injected to env; never call from client

## Prior completed work in project
- Payment history export (PDF report + CSV) DONE checkpoint b69c526a: PaymentHistory.tsx buttons Export PDF Report (pay.exportPdf) / Export CSV (pay.exportCsv), functions downloadTransactionsPdf/downloadTransactionsCsv in lib/receipts.ts, columns [16,46,88,124,140,162,182]
- Translations+legal pages checkpoint 2f67bab9; export checkpoint b69c526a
- Skill updated: /home/ubuntu/skills/competitor-platform-builder (payments-localization.md, audit-and-delivery.md references)

## Key facts about the site (for assistant knowledge base)
- Business: UK personal shopping + parcel forwarding to East Africa (Tanzania, Kenya, Uganda, Rwanda). Free UK warehouse address, paste product links or upload cart screenshot, consolidation, customs-cleared express air freight 4-8 days. London warehouse.
- Pricing: shipping £11/kg (min 0.5kg bands) + service & inspection fee £6 flat. Destinations TZS/KSh/UGX/RWF conversion via lib/currency.ts rates.
- Gateways: Paystack, Flutterwave, M-Pesa STK, bank transfer, wallet. Receipts PDF via lib/receipts.ts. Payment history /payments, success page /success with receipt download.
- Languages: English, Kiswahili, Kinyarwanda, Luganda (lib/i18n.ts, tr() via LanguageContext).
- Brand: gold/black/faint-blue, dark mode toggle. WhatsApp support +255 763 173 629. hello@ukshoppersafrica.com. UK Shoppers Africa, powered by INM LTD.
- Portal routes: / portal(dashboard), /address (UK warehouse), /orders, /tracking, /wallet, /payments, /referrals, /settings, /checkout, /success, /admin
- Landing: / instant calculator (destination × weight), 24 real UK stores wall, how-it-works 3-step, parcel journey 6 stops, 14-question FAQ, language switcher, WhatsApp widget
