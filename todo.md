# Full Site Review & Improvement — Todo

## Phase 1 findings (reviewed via screenshots + console)
All core pages render cleanly: landing (hero, store wall, journey, FAQ, trust), /portal dashboard, /add, /checkout, /orders, /tracking, /wallet, /admin. Console errors: 0.
Gaps found:
1. FAQ only covers 7 questions — missing payment security, out-of-stock handling, returns, rural delivery/pickup, minimum order, business/bulk orders
2. Landing hero image is generic delivery photo — needs one-of-a-kind premium UK retail + Africa delivery hero
3. Portal /add has no onboarding guidance for first-time users
4. WhatsApp floating widget doesn't prefill quote details
5. No visible "questions we get asked" quick answers in portal


## Identified gaps (from review) — to fill
- [ ] FAQ gaps: "Is my payment secure?", "What if a store is out of stock?", "Can I return an item?", "Do you ship to rural areas / pickup points?", "Minimum order?", "Bulk/business orders?"
- [ ] Add FAQ items to landing FAQ accordion
- [ ] Portal onboarding hints / empty states
- [ ] WhatsApp widget prefill with quote details

## Hero image (GENERATED)
- [x] New hero: /manus-storage/hero-premium-uk-africa_2b38b877.png
- [ ] Swap HERO_DELIVERY_IMG in Landing.tsx hero backdrop to the new image: premium UK retail feel — luxurious shopping scene evoking the linked stores (Amazon/ASOS/Zara/Nike premium storefront vibe), gold & black tones, African delivery destination hint

## Phase 4
- [ ] Verify desktop + mobile
- [ ] Checkpoint + deliver

## PROGRESS UPDATE (Phase 3 in progress)
- [x] Hero image swapped: HERO_DELIVERY_IMG now points to /manus-storage/hero-premium-uk-africa_2b38b877.png
- [x] FAQ expanded from 7 to 14 questions (added: payment security, out-of-stock, returns, rural delivery, minimum order, business/bulk orders, tracking/updates)
- [x] WhatsApp widget now has prefilled quote-request message + 3 quick-question buttons
- [ ] Remaining: verify desktop+mobile; checkpoint; deliver

WhatsApp widget lives in client/src/components/WhatsAppWidget.tsx — has a chat popup with msg state; the prefilled default msg is "" — should default to "Hi UK Shoppers Africa! I'd like a quote for an order from a UK store. My destination is ___." so users get a helpful starting message.
PortalShell.tsx sidebar "Chat on WhatsApp" at line ~175 uses https://wa.me/255763173629 without prefill — add text param.
Landing FAQ "Still have questions?" WhatsApp hint at line ~772 in Landing.tsx.
