# Build Notes — portal-prototype (internal progress tracker)

Project path: /home/ubuntu/portal-prototype (web-static, React 19 + Tailwind 4 + wouter + shadcn/ui + lucide-react + sonner)
Dev URL: https://3000-i90uxo770ubkxou4t9jw0-12361d72.us2.manus.computer

## Brand tokens (index.css already updated)
Primary oklch(0.32 0.07 160) ≈ #0A3622; yellow #F6E05E; canvas #F4F7F6; font-display = Fraunces; body = Inter.

## Done so far
- client/index.html: fonts (Inter, Fraunces), title "GlobalCart — Shop the World, Delivered"
- client/src/index.css: brand theme tokens, font-display utility
- client/src/lib/demoData.ts: demoOrders, statusMeta, demoTracking, demoTransactions, demoReferred
- client/src/components/PortalShell.tsx: header (logo, search, EN/GBP chips, wallet chip £42.30, bell w/ dropdown, avatar), sidebar nav (New Purchase button yellow), mobile bottom tab bar, support link, UNIT-7X2 copy
- ideas.md: design decisions

## Remaining pages to create (routes in App.tsx)
- / → Dashboard (Home.tsx replace): welcome, 3 stat cards (UK address, in warehouse 3 items 12kg [Consolidate→], active shipments GC-48201 → Lagos EDD Jul 22 [Track on map→]), paste-link demo block, recent orders table, loyalty bar + referral card widgets
- /add → AddItems: paste URL input, Fetch button, simulated 1.5s loading, result card (Nike Air Max 90, £109.99, fee £8, shipping £14.50, total £132.49, local toggle ₦168,400), Add to Cart / Buy Now; cart summary
- /checkout → Checkout: 3-step stepper Address → Payment (Card, M-Pesa, Bank, PayPal, Flutterwave) → Confirm; duties toggle ON default; summary £144.29; toast on pay
- /orders → Orders: filter chips (All/Pending/In warehouse/Shipped/Delivered), order cards w/ statusMeta chips, Repack/Choose shipping actions
- /tracking → Tracking: vertical stepper demoTracking, simplified route map visual (CSS), WhatsApp notify toggle
- /address → Address: UK warehouse card (Ada E. UNIT-7X2, 12 Fulfillment Road, London N17 6AB), Copy + QR placeholder, coming-soon US/EU cards, how-to-use note
- /wallet → Wallet: balance card, deposit button (toast), transaction list demoTransactions
- /referrals → Referrals: personal link + code GCL-ADA7X, share-to-WhatsApp button, rewards meter (₦6,000 earned / ₦15,000 goal), referred list demoReferred
- /settings → Settings: profile fields, notification channels (email/SMS/WhatsApp switches), 2FA switch; toast for saves

## Rules
- Use sonner toasts for placeholder actions; one checkpoint at end before delivery; screenshot verify before delivery.
