# Visual Overhaul — Gold/Black/Faint Blue + Dark Mode + Logos + Animated Hero

## Current project state
- Project: /home/ubuntu/portal-prototype (web-static, React+Tailwind)
- Dev URL: https://3000-i90uxo770ubkxou4t9jw0-12361d72.us2.manus.computer
- Main landing page: client/src/pages/Landing.tsx (has hero, category visuals, store wall w/ filter chips, 3-step how-it-works, journey timeline, FAQ accordion, trust section, hubs/rates, footer)
- Last checkpoint: c47ccc65
- Existing generated images (already live): hero-delivery-dar_77b8be1d.png, warehouse-london_64a80d77.png, lifestyle-fashion_e2409cf2.png, lifestyle-electronics_ba252c3d.png, lifestyle-beauty_28758d01.png, logo-mark_edee000e.png
- Theme tokens: client/src/index.css, :root/.dark variables; fonts in client/index.html
- App.tsx routes: / landing, /portal, /add, /checkout, /orders, /tracking, /wallet, /referrals, /settings, /admin
- PortalShell.tsx header uses brand colors directly

## User's new requirements
1. Palette: gold (keep #C9A227/#F6E05E), black (deep), faint blue accent — replace green with black+gold, add faint blue
2. Dark mode toggle (theme switchable in ThemeProvider + .dark variables in index.css)
3. Real brand logos for 24 stores (small factual display)
4. Hero: cinematic animated/presentation-like (Ken Burns, animated gradients, parallax feel) but still professional
5. Visuals for EVERY section (journey timeline icons→maybe imagery, FAQ, trust, hubs)

## Todo
- [ ] Source real store logos (24): Amazon, eBay, ASOS, Nike, Adidas, Zara, Next, M&S, Primark, Boots, Superdrug, Apple, Argos, Currys, John Lewis, Sports Direct, JD Sports, Decathlon, Lakeland, IKEA, H&M, The Body Shop, Sephora, HMV
- [ ] Upload logos via manus-upload-file --webdev
- [ ] Generate new hero cinematic assets (gold/black/blue palette imagery)
- [ ] Generate section visuals (timeline stops, FAQ illustration, trust imagery)
- [ ] Update index.css tokens: --background, --foreground, primary=black, accent=gold, chart/motifs faint blue (sky-950/slate)
- [ ] Add ThemeProvider switchable in App.tsx + toggle button in landing nav (and PortalShell)
- [ ] Replace StoreWall initial badges with logo images (fallback to initial)
- [ ] Animate hero: CSS keyframes (Ken Burns bg, fade/rise entrance), animated gradient waves
- [ ] Update all hex #0A3622/#124a30 references to new palette
- [ ] Screenshot verify desktop+mobile both themes
- [ ] Checkpoint + deliver

## Brand notes
- Old palette: green #0A3622 primary, gold #C9A227/#F6E05E accent, sage #F4F7F6
- New palette plan: near-black #0B0B0F / #101014 primary; gold #C9A227/#E8C25A accent; faint blue #B9D3E8 / oklch sky-blue for secondary accents; light canvas white/slate

## Store logo storage paths (all uploaded, 23/24 — Sports Direct missing)
- amazon: /manus-storage/amazon_2a7347b3.png
- asos: /manus-storage/asos_054104bd.png
- adidas: /manus-storage/adidas_e76ffa5d.jpg
- apple: /manus-storage/apple_88777630.png
- argos: /manus-storage/argos_ce8e8ab5.png
- boots: /manus-storage/boots_a4a41643.png
- currys: /manus-storage/currys_8719af84.png
- decathlon: /manus-storage/decathlon_cd3874d7.png
- ebay: /manus-storage/ebay_86268e48.png
- hm: /manus-storage/hm_eda09649.png
- hmv: /manus-storage/hmv_de33faf9.png
- ikea: /manus-storage/ikea_5147cb5e.png
- jdsports: /manus-storage/jdsports_b38fa866.png
- johnlewis: /manus-storage/johnlewis_6fb5a2b7.png
- lakeland: /manus-storage/lakeland_ece68d7b.png
- ms: /manus-storage/ms_235f8386.png
- next: /manus-storage/next_e0017815.png
- nike: /manus-storage/nike_a2ad4d50.png
- primark: /manus-storage/primark_99111fca.png
- sephora: /manus-storage/sephora_ec8b3e69.jpg
- superdrug: /manus-storage/superdrug_3a35d1ad.png
- thebodyshop: /manus-storage/thebodyshop_9b025f1f.png
- zara: /manus-storage/zara_9dbaa816.png
- Sports Direct: TODO (fallback to initial badge or search logo)

## Existing generated image storage paths
- hero-delivery: /manus-storage/hero-delivery-dar_77b8be1d.png
- warehouse: /manus-storage/warehouse-london_64a80d77.png
- fashion/lifestyle: /manus-storage/lifestyle-fashion_e2409cf2.png
- electronics/lifestyle: /manus-storage/lifestyle-electronics_ba252c3d.png
- beauty/lifestyle: /manus-storage/lifestyle-beauty_28758d01.png
- logo mark: /manus-storage/logo-mark_edee000e.png

## PROGRESS (as of now)
- DONE: All 24 store logos sourced + uploaded (paths saved above; sportsdirect_3c993fe4.png)
- DONE: index.css rewritten with gold/black/faint-blue palette + dark mode .dark vars + cinematic hero animations (hero-kenburns, hero-rise-d1..d4, hero-wave, hero-shimmer, hero-float, drift-slow) + .text-gradient-gold utility
- New token names: --gold, --gold-soft, --faint-blue (use via text-[var(--gold)] or className gold:color classes; oklch gold≈0.78 0.13 85, faint-blue≈0.8 0.035 235 light / dark 0.72 0.05 240)
- primary is now near-black oklch(0.185 0.015 270) light; in .dark primary is gold text with black fg

## REMAINING
- App.tsx: make ThemeProvider switchable; add theme toggle button to Landing nav + PortalShell header
- Landing.tsx: rewrite hero (cinematic: Ken Burns bg image /manus-storage/hero-delivery-dar_77b8be1d.png overlay, hero-rise classes on headline/subtext/CTAs, hero-float on calculator card, shimmer gold on key headline words, faint-blue drift blobs)
- Landing.tsx store wall: replace initial badges with <img src={logo}> using logo map (23 logos + sportsdirect), object-contain, fixed 40px height, fallback to initial badge
- Replace #0A3622 hex refs in Landing.tsx/PortalShell with new palette (use oklch vars or tailwind colors). Grepping needed: #0A3622, #124a30, #F6E05E, #F4F7F6
- Sections needing visuals: journey timeline (maybe small icon circles stay), trust (keep cards), maybe add faint-blue gradient blobs to section bg alternations
- Footer/hubs section colors update
- Screenshot desktop + mobile (light and dark toggle check), checkpoint, deliver

## Logo map (name → storage path)
amazon_2a7347b3.png, asos_054104bd.png, adidas_e76ffa5d.jpg, apple_88777630.png, argos_ce8e8ab5.png, boots_a4a41643.png, currys_8719af84.png, decathlon_cd3874d7.png, ebay_86268e48.png, hm_eda09649.png, hmv_de33faf9.png, ikea_5147cb5e.png, jdsports_b38fa866.png, johnlewis_6fb5a2b7.png, lakeland_ece68d7b.png, ms_235f8386.png, next_e0017815.png, nike_a2ad4d50.png, primark_99111fca.png, sephora_ec8b3e69.jpg, superdrug_3a35d1ad.png, thebodyshop_9b025f1f.png, zara_9dbaa816.png, sportsdirect_3c993fe4.png

## UPDATE 2
- DONE: index.css palette rewrite (gold oklch 0.78 0.13 85, black oklch 0.185 0.015 270, faint-blue; dark mode tokens; hero animations hero-kenburns/hero-rise-d1..d4/hero-shimmer/hero-float/drift-slow; .text-gradient-gold)
- DONE: sed replace #0A3622→#111418, #F6E05E→#D4AF37, #F4F7F6→#F2F4F7 across all pages + PortalShell
- DONE: emerald→amber utility colors replaced
- DONE: ThemeProvider switchable in App.tsx
- DONE: PortalShell: theme toggle button (Moon/Sun), dark header/sidebar/bottom-bar/sidebar colors
- DONE: Landing.tsx: store logos map (24) + img badges in StoreWall; hero cinematic rewrite (blobs, kenburns bg, hero-rise, hero-shimmer, hero-float, dark variants); nav theme toggle
- REMAINING: verify screenshots (desktop/mobile, both themes); add visuals to remaining sections if time allows (journey timeline/FAQ already have cards); checkpoint + deliver
- Note: hero bg image at 35% opacity may need darker light overlay (from-background/95 works in dark)
