# Portal Prototype — Design Ideas

## Ground Truth Spec
This prototype implements the approved wireframe document (`/home/ubuntu/project/uiux_wireframe_layout.md`) and design tokens from the project's existing presentation/design language. Fidelity to those wireframes OVERRIDES generic guidance.

## Design System (from approved wireframes)
- **Primary:** deep green #0A3622 — sidebar, buttons, headers, icons
- **Accent:** warm yellow #F6E05E — highlights, badges, loyalty, hover accents
- **Canvas:** light gray-green #F4F7F6 — page backgrounds
- **Text:** #1A202C headings, #4A5568 body
- **Status:** success #16A34A / warning #D97706 / error #DC2626
- Radius 8px cards, 24px buttons; soft shadow `0 2px 8px rgba(10,54,34,.08)`; 8px spacing grid
- Typography: Inter for UI; Fraunces (serif display) for brand headings to add craft
- Brand: "GlobalCart" placeholder name — "Shop the World, Delivered to Your Doorstep"

## Screens to Build
1. Portal shell: sticky header (logo, search, wallet £42.30, bell, user menu) + left sidebar nav; mobile bottom tab bar
2. `/` Dashboard — welcome, 3 stat cards (address, in warehouse 3 items, active shipments), paste-link demo, recent orders table, loyalty + referral widgets
3. `/address` My Address — UK warehouse address card with copy, QR placeholder, coming-soon US/EU
4. `/orders` My Orders — filter chips, order cards with status chips, actions
5. `/orders/:id/tracking` Tracking — vertical stepper + simplified map visual, WhatsApp notify toggle
6. `/add` Add Items — paste URL → simulated fetch loading → result card with quote → cart with local-currency toggle
7. `/checkout` Checkout — 3-step stepper (address, payment methods incl. M-Pesa, confirm), duties toggle ON by default
8. `/wallet` Wallet — balance card, deposit button, transaction list
9. `/referrals` Referrals — link, share-to-WhatsApp button, rewards meter, referred users
10. `/settings` Settings — profile, notifications channels, 2FA toggle

## Interaction Philosophy
- Fully client-side demo data (no API); toasts for "coming soon" items
- Snappy transitions < 300ms, ease-out cubic-bezier(0.23,1,0.32,1)
- Link parser flow simulated with 1.5s artificial delay + loading state
- Dot-matrix motif reused subtly as brand texture (matches slide deck)

## Style Decisions
- Asymmetric dashboard grid (unequal column widths) instead of centered cards
- Green sidebar with yellow active-state marker — signature motif
- Status chips as pill badges with soft tinted backgrounds
