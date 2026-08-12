# UK Shoppers Africa — Cross-Border Shopping & Parcel Forwarding Platform

**Shop the UK. Delivered to East Africa.** A full-stack web platform enabling customers in Tanzania, Kenya, Uganda, and Rwanda to shop from UK stores (Amazon UK, ASOS, Zara, Boots, Nike, and 24+ others) with a personal London warehouse address, express air freight, and customs-cleared delivery to their doorstep.

Powered by INM LTD · Built with React 19, Tailwind 4, tRPC, Drizzle ORM, and Manus built-in auth, database, and AI.

---

## What the Platform Does

UK Shoppers Africa gives every East African customer a **personal UK warehouse address** (12 Heathrow Cargo Way, London TW6 2GE). They shop from any UK store, ship to that address, and the platform handles consolidation, express air freight, customs clearance, and local delivery — with tracking at every milestone.

Core customer journey: **Paste a UK product link → get an instant quote in local currency → pay with M-Pesa, Paystack, Flutterwave, or bank transfer → receive a PDF receipt → track the parcel through six milestones to their doorstep.**

## Key Features

### Public Site
| Feature | Description |
|---|---|
| Cinematic hero | Gold/black/faint-blue brand theme, East African city skyline backdrop, Ken Burns animations |
| Instant pricing calculator | Live shipping + service fee estimates for Tanzania, Kenya, Uganda, Rwanda |
| 24-store brand wall | Real store logos, clickable → pre-fills calculator with store |
| Journey timeline | 6-stop parcel journey: London warehouse → inspection → air freight → customs → last-mile → doorstep |
| Interactive FAQ | 14 questions on customs, delivery times, payments, consolidation, returns |
| Multilingual | English, Kiswahili, Kinyarwanda, and Luganda with live language switcher |
| Dark mode | Full-site toggle with adaptive cinematic hero lighting |
| WhatsApp support | Floating widget with prefilled quote message and quick-question buttons |
| Pricing tiers | Clear plan structure for personal and business shoppers |

### Customer Portal (authenticated)
| Feature | Description |
|---|---|
| Real database orders | Every customer sees only their own orders, scoped server-side by auth session |
| 7-milestone tracking | pending_purchase → purchased → in_warehouse → shipped → arrived → local_dispatch → delivered |
| Payment history | Real transactions with gateway, local currency, status; PDF/CSV export |
| PDF receipts | Downloadable branded A4 receipt after every completed payment |
| Automatic currency conversion | Checkout totals display in TZS, KSh, UGX, RWF |
| Wallet | Balance computed from completed payments; deposit flow ready for live gateway keys |
| Referrals | Real referral code derived from user account id (UKS-\<id\>), WhatsApp share link |
| Queen AI assistant | Multilingual shopping assistant trained on the business; quick actions, conversation persistence, personalized order/payment context, real unread-notification badge |
| Notifications | Real in-app bell updates on order milestones, plus optional email updates |
| Settings | Email update preferences persisted to the database |

### Operations Hub (admin)
| Feature | Description |
|---|---|
| Live order table | All real customer orders with search and status filters |
| Milestone advancement | One click advances a shipment stage; customer is notified via Queen badge + email |
| Owner ops alerts | Admin receives an ops notification on every milestone change |
| Role-based access | `adminProcedure` guards; non-admins see an access message |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Tailwind CSS 4, Vite 7, shadcn/ui, Framer Motion, wouter, jsPDF |
| API | tRPC 11 with superjson (end-to-end types, no REST glue) |
| Auth | Manus OAuth (session cookie, nonce binding, `protectedProcedure`) |
| Database | MySQL via Drizzle ORM; migrations through `drizzle-kit` |
| Storage | S3-backed file storage (receipts, uploads) |
| AI | Manus built-in LLM for Queen assistant (multilingual business Q&A) |
| Testing | Vitest against a real test database |
| Deployment | Manus built-in hosting (autoscale), custom domain support |

## Project Structure

```
portal-prototype/
├── client/
│   ├── public/              # favicon, robots.txt only
│   └── src/
│       ├── pages/           # Home, Dashboard, Orders, Tracking, Payments,
│       │                    # Wallet, Referrals, Settings, Checkout, Success,
│       │                    # Address, AddItems, AdminDashboard, Legal pages
│       ├── components/      # PortalShell, AssistantChat (Queen), WhatsAppWidget,
│       │                    # LanguageSwitcher, DashboardLayout, ui/*
│       ├── contexts/        # ThemeContext, LanguageContext
│       ├── lib/             # trpc.ts, i18n.ts, demoData.ts
│       └── _core/           # useAuth hook
├── server/
│   ├── routers.ts           # tRPC routers: auth, orders, payments, notifications, admin, profile
│   ├── db.ts                # Drizzle query helpers + first-login seeding
│   ├── storage.ts           # S3 upload/download helpers
│   ├── *.test.ts            # Vitest specs (real DB)
│   └── _core/               # framework plumbing (auth, LLM, notifications, env)
├── shared/                  # orderStatus.ts — client-safe milestone constants
├── drizzle/                 # schema.ts + migrations
└── vitest.config.ts
```

## Database Schema

| Table | Purpose | Key columns |
|---|---|---|
| `users` | Accounts (Manus OAuth) | id, openId, name, email, role (user\|admin), emailNotifications |
| `orders` | Customer shipments | ref (UKS-xxxxx), userId, store, item, destination, amountGbp, status enum, timeline JSON |
| `payments` | Transactions | ref (TXN-...), userId, orderId, gateway, amount, currencyCode, status (pending\|paid\|failed) |
| `notifications` | Milestone alerts | userId, orderId, type, title, body, statusFrom/To, read flag |

All queries are per-user scoped on the server — customers can only ever see their own rows.

## Development

```bash
pnpm install      # install dependencies
pnpm dev          # start dev server (Vite + Express/tRPC)
pnpm test         # run Vitest suite
pnpm db:push      # generate migration SQL from drizzle/schema.ts
npx tsc --noEmit  # type check
```

Schema changes: edit `drizzle/schema.ts` → `pnpm db:push` → read the generated `.sql` → apply via the database UI or `webdev_execute_sql`. Keep TypeScript schema and live database in sync.

## Milestone Pipeline

```
pending_purchase → purchased → in_warehouse → shipped →
arrived → local_dispatch → delivered
```

Advancing a milestone (admin hub) automatically creates a customer notification, triggers Queen's badge, and — when the customer has opted in — sends an email update plus an ops alert to the platform owner.

## Payment Gateways

The checkout integrates **M-Pesa (STK push), Paystack, Flutterwave, bank transfer, and wallet** with test-mode placeholders. Live credentials are injected via environment secrets; webhook handlers credit the wallet ledger once live keys are configured.

## Languages & Currencies

Supported locales: **English, Kiswahili, Kinyarwanda, Luganda** (i18n dictionary in `client/src/lib/i18n.ts`). Currencies: GBP display with automatic conversion to **TZS, KSh, UGX, RWF** by destination.

## Project Roadmap (progress)

- [x] Landing page with calculator, store wall, journey timeline, FAQ, trust section
- [x] Full multilingual support (EN/SW/RW/LG) + dark mode
- [x] Customer portal with real database (orders, payments, notifications)
- [x] Queen AI assistant with quick actions, persistence, personalization, badge
- [x] Email update preference + owner ops alerts on milestones
- [x] Payment receipts (PDF), history export (PDF/CSV)
- [x] Referrals with real account-derived codes, audit hardening
- [ ] Live Paystack/M-Pesa credentials + webhook wallet credits
- [ ] Staff role tier with limited ops permissions
- [ ] Automated multilingual email/SMS at each milestone
- [ ] Published custom domain (ukshoppersafrica.com)

## License

Proprietary — UK Shoppers Africa / INM LTD.
