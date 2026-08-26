import { useState } from "react";
import { Link } from "wouter";
import {
  Link2,
  Search,
  Home,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Clock,
  Globe,
  Star,
  CheckCircle2,
  Package,
  Calculator,
  Truck,
  PhoneCall,
  Mail,
  ChevronRight,
  ChevronDown,
  Warehouse,
  FileCheck2,
  Plane,
  ClipboardCheck,
  Home as HomeIcon,
  Shield,
  BadgeCheck,
  CreditCard,
  Lock,
  Recycle,
  Quote,
  ExternalLink,
  Sparkles,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { tr, Lang } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AssistantChat from "@/components/AssistantChat";
import { getRetailerUrl } from "@/lib/retailerLinks";
import { stores, storeCategories, type Store } from "@/lib/stores";
import { buildStoreDirectoryHref } from "@/lib/storeDirectoryQuery";
import { trpc } from "@/lib/trpc";

function scrollToCalculator() {
  document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
}

const LOGO_IMG = "/manus-storage/logo-mark_edee000e.png";
const HERO_CITIES_IMG = "/manus-storage/hero-cities-skyline_75ee4947.png";
const WAREHOUSE_IMG = "/manus-storage/warehouse-london_64a80d77.png";
const LIFESTYLE_FASHION_IMG = "/manus-storage/lifestyle-fashion_e2409cf2.png";
const LIFESTYLE_ELECTRONICS_IMG = "/manus-storage/lifestyle-electronics_ba252c3d.png";
const LIFESTYLE_BEAUTY_IMG = "/manus-storage/lifestyle-beauty_28758d01.png";

const journeyStops = [
  {
    icon: Warehouse,
    title: "journey.warehouse",
    body: "Your items arrive at our London Heathrow fulfillment hub where each parcel is weighed, measured, and photographed.",
    time: "Day 1–2",
  },
  {
    icon: FileCheck2,
    title: "journey.inspection",
    body: "Our team inspects every item for quality, photos it to your portal, and repacks it to reduce shipping volume.",
    time: "Day 2–3",
  },
  {
    icon: Plane,
    title: "journey.consolidation",
    body: "Your consolidated shipment flies direct to East Africa on dedicated cargo routes with full insurance coverage.",
    time: "Day 3–5",
  },
  {
    icon: ClipboardCheck,
    title: "journey.customs",
    body: "We handle all customs documentation and duties on your behalf — no surprise fees at the border. 100% prepaid.",
    time: "Day 5–6",
  },
  {
    icon: Truck,
    title: "journey.dispatch",
    body: "Your parcel clears the destination hub and heads to your city with our vetted local delivery partners.",
    time: "Day 6–7",
  },
  {
    icon: HomeIcon,
    title: "journey.delivery",
    body: "Delivered safely to your door in Dar es Salaam, Nairobi, Kampala, or Kigali — with a WhatsApp photo confirmation.",
    time: "Day 7–8",
  },
];

const faqs = [
  {
    q: "How do customs duties work? Will I pay extra fees at the border?",
    a: "No — duties are 100% prepaid. When we give you a quote, it already includes estimated import duties and taxes for Tanzania, Kenya, Uganda, and Rwanda. You never pay anything extra at the border, and any duty difference is covered by us up to our declared estimate.",
  },
  {
    q: "How long does delivery take?",
    a: "Express air delivery takes 4–8 business days from the date your items arrive at our London warehouse: Tanzania 5–8 days, Kenya 4–7 days, Uganda 5–8 days, and Rwanda 6–9 days. You can follow every checkpoint in your portal, and we send WhatsApp updates at each stage.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept M-Pesa, Tigo Pesa, Airtel Money, mobile money, direct bank transfer, and debit/credit cards. All payments can be made in local currency — you never need a UK bank account or a card that works internationally.",
  },
  {
    q: "What is parcel consolidation and how does it save me money?",
    a: "If you order from multiple UK stores, we hold your items at our warehouse and repack them together into one box before shipping. Since shipping is charged by weight, combining 3–5 parcels into one shipment typically saves 20–30% compared to shipping each box separately.",
  },
  {
    q: "What happens if my item is damaged or wrong?",
    a: "Every parcel is inspected and photographed at our London warehouse before shipping, so issues are caught before your items leave the UK. If an item arrives damaged, our shipping insurance covers replacement or refund — contact support within 48 hours of delivery with a photo.",
  },
  {
    q: "Can I use my own UK delivery address instead of the link service?",
    a: "Yes. Sign up for your free personal UK warehouse address with a unique UNIT ID. Shop on any UK store as normal and use our address at checkout — we receive, consolidate, and forward your parcels to East Africa. This is perfect for stores we don't automatically parse.",
  },
  {
    q: "Are there size or weight limits for shipments?",
    a: "We handle parcels up to 30kg per shipment. For larger items (furniture, gym equipment), contact our team for a custom freight quote — we arrange sea freight for bulky orders at lower per-kg rates.",
  },
  {
    q: "Is my payment secure? How do I know my money is safe?",
    a: "Completely. We process card payments through encrypted, PCI-compliant gateways, and mobile money deposits are verified instantly. You can also load funds into your UK Shoppers Africa wallet and pay orders from your balance — with a full transaction history visible in your portal. We never ask for your card PIN or mobile money codes.",
  },
  {
    q: "What happens if the item is out of stock or discontinued?",
    a: "Our team checks availability before purchasing. If your item goes out of stock, we contact you immediately with options: a substitute in the same store, a refund of that item to your wallet, or waiting for restock. You are never charged for an item we couldn't source without your approval.",
  },
  {
    q: "Can I return an item I'm not happy with?",
    a: "Yes. UK stores' return policies apply during the 14–30 day UK return window. Because we inspect and photograph every item at our London warehouse before it ships, most issues are caught early. If you still want a return, our team re-ships the item back to the UK store and refunds you to your wallet or original payment method, minus a small return shipping fee.",
  },
  {
    q: "Do you deliver outside major cities — rural areas or pickup points?",
    a: "Yes. We deliver door-to-door across Tanzania, Kenya, Uganda, and Rwanda. For towns and rural areas, we work with trusted local courier partners, and you can also choose a pickup point in your city to avoid courier fees. Every location is covered — just enter your address and we'll confirm the delivery method.",
  },
  {
    q: "Is there a minimum order amount?",
    a: "No minimum. Order a single lipstick or a full furniture haul — the same process applies. That said, consolidation is where you save: combining multiple items into one shipment cuts your per-item shipping cost significantly, so ordering a few things together typically gets you the best rate.",
  },
  {
    q: "Do you handle business or bulk orders?",
    a: "Absolutely — many boutique owners, resellers, and offices use UK Shoppers Africa as their UK supply channel. For recurring bulk orders we offer business accounts with negotiated shipping rates, a dedicated account manager, monthly invoicing, and priority warehouse handling. WhatsApp our team to set up a business account.",
  },
  {
    q: "How do I track my parcel, and will I be updated?",
    a: "Every shipment gets a UKSA tracking number visible in your portal with six checkpoints from warehouse to doorstep. We also send automatic WhatsApp updates at each stage — you never have to ask. If a flight is delayed or customs takes longer, we notify you proactively with the new date.",
  },
];

const trustIndicators = [
  { icon: BadgeCheck, title: "trust.verified", body: "Every item inspected, photographed & confirmed before it ships from the UK" },
  { icon: Shield, title: "trust.insured", body: "All shipments covered end-to-end — London warehouse to your doorstep" },
  { icon: CreditCard, title: "trust.local", body: "M-Pesa, Tigo Pesa, Airtel Money, bank transfer & cards accepted" },
  { icon: Lock, title: "trust.duties", body: "No surprise border fees — customs handled and included in your quote" },
];

const reviewStructure = [
  { name: "", city: "", cityCode: "", rating: 5, quote: "" },
  { name: "", city: "", cityCode: "", rating: 5, quote: "" },
  { name: "", city: "", cityCode: "", rating: 5, quote: "" },
];

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-border/80 overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
        <span className="font-bold text-[#111418] text-sm sm:text-base">{faq.q}</span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-[#C9A227] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    num: "01",
    icon: Link2,
    title: "steps.link",
    body: "Paste any link from Amazon UK, ASOS, Zara, or upload a cart screenshot. Prefer full control? Use your personal UK warehouse address at checkout.",
  },
  {
    num: "02",
    icon: Search,
    title: "steps.consolidate",
    body: "Our London Heathrow team buys your items, inspects them for quality, and combines multiple parcels into one box to slash your shipping fees.",
  },
  {
    num: "03",
    icon: Truck,
    title: "steps.delivery",
    body: "Fly your items directly to Tanzania, Kenya, Uganda, or Rwanda with customs cleared and doorstep delivery included.",
  },
];

const destinations = [
  { code: "TZ", name: "Tanzania (Dar es Salaam / Arusha)", flag: "🇹🇿", currency: "TZS", perKg: 28000, handling: 12000, days: "5–8 Days" },
  { code: "KE", name: "Kenya (Nairobi / Mombasa)", flag: "🇰🇪", currency: "KES", perKg: 1450, handling: 600, days: "4–7 Days" },
  { code: "UG", name: "Uganda (Kampala / Entebbe)", flag: "🇺🇬", currency: "UGX", perKg: 42000, handling: 18000, days: "5–8 Days" },
  { code: "RW", name: "Rwanda (Kigali)", flag: "🇷🇼", currency: "RWF", perKg: 15000, handling: 6000, days: "6–9 Days" },
];

/* Official brand marks — factual supported-store reference per industry practice */
const storeLogos: Record<string, string> = {
  "Amazon UK": "/manus-storage/amazon_2a7347b3.png",
  "eBay UK": "/manus-storage/ebay_86268e48.png",
  ASOS: "/manus-storage/asos_054104bd.png",
  "Nike UK": "/manus-storage/nike_a2ad4d50.png",
  "Adidas UK": "/manus-storage/adidas_e76ffa5d.jpg",
  "Zara UK": "/manus-storage/zara_9dbaa816.png",
  "Next UK": "/manus-storage/next_e0017815.png",
  "Marks & Spencer": "/manus-storage/ms_235f8386.png",
  "Primark Online": "/manus-storage/primark_99111fca.png",
  Boots: "/manus-storage/boots_a4a41643.png",
  Superdrug: "/manus-storage/superdrug_3a35d1ad.png",
  "Apple UK": "/manus-storage/apple_88777630.png",
  Argos: "/manus-storage/argos_ce8e8ab5.png",
  Currys: "/manus-storage/currys_8719af84.png",
  "John Lewis": "/manus-storage/johnlewis_6fb5a2b7.png",
  "Sports Direct": "/manus-storage/sportsdirect_3c993fe4.png",
  "JD Sports": "/manus-storage/jdsports_b38fa866.png",
  "Decathlon UK": "/manus-storage/decathlon_cd3874d7.png",
  Lakeland: "/manus-storage/lakeland_ece68d7b.png",
  "IKEA UK": "/manus-storage/ikea_5147cb5e.png",
  "H&M UK": "/manus-storage/hm_eda09649.png",
  "The Body Shop": "/manus-storage/thebodyshop_9b025f1f.png",
  "Sephora UK": "/manus-storage/sephora_ec8b3e69.jpg",
  HMV: "/manus-storage/hmv_de33faf9.png",
};

const marqueeStores = stores.slice(0, 14);

function StoreCard({ store, delay }: { store: Store; delay?: number }) {
  const retailerUrl = getRetailerUrl(store.domain);
  const requestUrl = `/add?productUrl=${encodeURIComponent(retailerUrl)}`;

  return (
    <article
      className="group bg-background dark:bg-card rounded-2xl p-4 border border-border/80 hover:border-[#C9A227] hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-start text-left w-full reveal-up"
      data-reveal-delay={String(delay)}>
      <a
        href={retailerUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`Open ${store.name} UK storefront in a new tab`}
        className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-lg">
        <div className="w-10 h-10 rounded-xl bg-white border border-border/70 flex items-center justify-center shadow-sm overflow-hidden">
          {storeLogos[store.name] ? (
            <img
              src={storeLogos[store.name]}
              alt={`${store.name} brand logo`}
              className="w-8 h-8 object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-[#111418] font-black text-sm">{store.name.charAt(0)}</span>
          )}
        </div>
        <h3 className="font-bold text-[#111418] dark:text-[#F7F4E8] text-sm mt-3 leading-tight flex items-center gap-1.5">
          {store.name} <ExternalLink className="w-3 h-3 shrink-0 text-[#C9A227]" aria-hidden="true" />
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{store.domain}</p>
        <p className="text-[11px] text-foreground/70 mt-2 leading-snug">{store.note}</p>
      </a>
      <div className="mt-3 pt-3 border-t border-border/60 flex flex-col gap-2 w-full">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 dark:text-[#E6C764]">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Supported UK retailer
        </span>
        <Link
          href={requestUrl}
          className="text-[11px] font-semibold text-[#111418] dark:text-[#F3E7AF] hover:text-[#A67C00] dark:hover:text-[#D4AF37] underline underline-offset-4">
          Request staff review
        </Link>
      </div>
    </article>
  );
}

function StoreWall({ lang }: { lang: Lang }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? stores
      : stores.filter((s) => s.category === activeCategory);

  return (
    <div className="container">
      <div className="max-w-2xl mb-10 text-left">
        <span className="inline-block text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
          100+ Supported Stores
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111418] mt-3">
              {tr("sec.storesTitle", lang)}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          If they sell it in the UK, we can buy it and deliver it to your doorstep in East Africa — pasting a single link is all it takes.
        </p>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap justify-start gap-2 mb-10">
        {storeCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4.5 py-2 text-sm font-semibold transition-all active:scale-[0.97] ${
              activeCategory === cat
                ? "bg-[#111418] text-[#D4AF37] shadow-md"
                : "bg-background text-foreground/70 border border-border hover:border-[#111418]/50 hover:text-[#111418]"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Store grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((store, idx) => (
          <StoreCard key={store.name} store={store} delay={(idx % 6) + 1} />
        ))}
      </div>

      <p className="text-left text-xs text-muted-foreground mt-8">
        Not on the list? We support virtually every UK retailer — paste any product link and we'll confirm instantly.
      </p>
    </div>
  );
}

type PublicSeasonalOffer = {
  id: number;
  storeName: string;
  title: string;
  details: string;
  sourceType: "official_retailer" | "approved_partner" | "manual_verification";
  sourceUrl: string;
  termsSummary: string;
  linkType: "direct" | "affiliate";
  offerUrl: string | null;
  couponCode: string | null;
  validFrom: Date | string | null;
  validUntil: Date | string | null;
  verifiedAt: Date | string | null;
  status: "upcoming" | "published";
};

function SeasonalOffersPanel() {
  const offersQuery = trpc.offers.listPublic.useQuery(undefined, { retry: false });
  const offers = (offersQuery.data ?? []) as PublicSeasonalOffer[];
  const liveOffers = offers.filter((offer) => offer.status === "published");
  const upcomingOffers = offers.filter((offer) => offer.status === "upcoming");

  return (
    <section id="seasonal-offers" aria-labelledby="seasonal-offers-title" className="hero-float rounded-3xl border border-border bg-white p-6 shadow-2xl dark:bg-card dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#C9A227]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7D5A00] dark:text-[#E6C764]"><Sparkles className="h-3.5 w-3.5" /> Savings watch</span>
          <h2 id="seasonal-offers-title" className="mt-3 text-2xl font-bold text-[#111418] dark:text-[#F7F4E8]">Prepare for verified UK offers</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">See confirmed upcoming retailer campaigns here before they start, then shop live offers directly. Every card is source-checked and dated by our operations team.</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#111418] text-[#D4AF37] dark:bg-[#D4AF37] dark:text-[#111418]"><Tag className="h-5 w-5" /></div>
      </div>

      {offersQuery.isLoading ? (
        <div className="mt-6 space-y-3" aria-label="Loading verified offers"><div className="h-24 animate-pulse rounded-2xl bg-muted" /><div className="h-24 animate-pulse rounded-2xl bg-muted" /></div>
      ) : offers.length === 0 ? (
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-dashed border-[#C9A227]/45 bg-[#C9A227]/[0.06] px-5 py-5 text-center dark:bg-[#D4AF37]/[0.07]">
            <Sparkles className="mx-auto h-7 w-7 text-[#A67C00] dark:text-[#E6C764]" />
            <h3 className="mt-3 text-sm font-bold text-[#111418] dark:text-[#F7F4E8]">Your early-shopping watch starts here</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">There is no retailer-specific campaign confirmed in the register today. Build your basket now; we will show each confirmed start date and official terms here before it goes live.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-background p-3 dark:bg-[#171a20]"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A67C00] dark:text-[#E6C764]">Plan ahead</p><p className="mt-1 text-xs font-bold text-[#111418] dark:text-[#F7F4E8]">Create your UK wish-list</p><p className="mt-1 text-[11px] leading-4 text-muted-foreground">Save product links now, ready for a confirmed drop.</p></div>
            <div className="rounded-2xl border border-border bg-background p-3 dark:bg-[#171a20]"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A67C00] dark:text-[#E6C764]">Next update</p><p className="mt-1 text-xs font-bold text-[#111418] dark:text-[#F7F4E8]">Official retailer release</p><p className="mt-1 text-[11px] leading-4 text-muted-foreground">We publish the source, terms and start date together.</p></div>
          </div>
          <Link href="/stores" className="inline-flex items-center gap-2 text-xs font-bold text-[#A67C00] hover:underline dark:text-[#E6C764]">Prepare your basket at UK stores <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {upcomingOffers.length > 0 ? <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#A67C00] dark:text-[#E6C764]">Confirmed upcoming</p> : null}
          {upcomingOffers.map((offer) => {
            const start = offer.validFrom ? new Date(offer.validFrom) : null;
            const verifiedAt = offer.verifiedAt ? new Date(offer.verifiedAt) : null;
            const logo = storeLogos[offer.storeName];
            return <article key={offer.id} className="rounded-2xl border border-[#C9A227]/40 bg-[#FFFDF5] p-4 dark:bg-[#272314]">
              <div className="flex gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white p-2">{logo ? <img src={logo} alt={`${offer.storeName} logo`} className="h-7 w-8 object-contain" loading="lazy" /> : <span className="text-xs font-black text-[#111418]">{offer.storeName.slice(0, 1)}</span>}</div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A67C00] dark:text-[#E6C764]">{offer.storeName} · Coming soon</p><h3 className="mt-0.5 text-sm font-bold text-[#111418] dark:text-[#F7F4E8]">{offer.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{offer.details}</p></div></div>
              <p className="mt-3 border-t border-[#C9A227]/20 pt-3 text-[10px] leading-4 text-muted-foreground">Terms: {offer.termsSummary}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#111418] px-2.5 py-1 text-[10px] font-bold text-[#D4AF37]">Starts {start && !Number.isNaN(start.getTime()) ? start.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "on confirmed retailer date"}</span>{verifiedAt && !Number.isNaN(verifiedAt.getTime()) ? <span className="text-[10px] font-semibold text-muted-foreground">Checked {verifiedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span> : null}{offer.linkType === "affiliate" ? <span className="text-[10px] font-semibold text-muted-foreground">Partner link — we may earn a commission</span> : <span className="text-[10px] font-semibold text-muted-foreground">Retailer source checked</span>}{offer.offerUrl ? <a href={offer.offerUrl} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-[#A67C00] hover:underline dark:text-[#E6C764]">Prepare your basket <ExternalLink className="h-3 w-3" /></a> : null}</div>
            </article>;
          })}
          {liveOffers.length > 0 ? <p className="pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A67C00] dark:text-[#E6C764]">Live verified offers</p> : null}
          {liveOffers.map((offer) => {
            const expiry = offer.validUntil ? new Date(offer.validUntil) : null;
            const verifiedAt = offer.verifiedAt ? new Date(offer.verifiedAt) : null;
            const logo = storeLogos[offer.storeName];
            return <article key={offer.id} className="rounded-2xl border border-border bg-background p-4 transition-colors hover:border-[#C9A227]/70 dark:bg-[#171a20]">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-white p-2">
                  {logo ? <img src={logo} alt={`${offer.storeName} logo`} className="h-7 w-8 object-contain" loading="lazy" /> : <span className="text-xs font-black text-[#111418]">{offer.storeName.slice(0, 1)}</span>}
                </div>
                <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A67C00] dark:text-[#E6C764]">{offer.storeName}</p><h3 className="mt-0.5 text-sm font-bold text-[#111418] dark:text-[#F7F4E8]">{offer.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{offer.details}</p></div>
              </div>
              <p className="mt-3 border-t border-border/70 pt-3 text-[10px] leading-4 text-muted-foreground">Terms: {offer.termsSummary}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {offer.couponCode ? <span className="rounded-full bg-[#111418] px-2.5 py-1 font-mono text-[10px] font-bold tracking-wide text-[#D4AF37]">Code: {offer.couponCode}</span> : null}
                {expiry && !Number.isNaN(expiry.getTime()) ? <span className="text-[10px] font-semibold text-muted-foreground">Ends {expiry.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span> : <span className="text-[10px] font-semibold text-muted-foreground">Check retailer terms</span>}
                {verifiedAt && !Number.isNaN(verifiedAt.getTime()) ? <span className="text-[10px] font-semibold text-muted-foreground">Verified {verifiedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span> : null}
                {offer.linkType === "affiliate" ? <span className="text-[10px] font-semibold text-muted-foreground">Partner link — we may earn a commission</span> : <span className="text-[10px] font-semibold text-muted-foreground">Retailer source checked</span>}
                {offer.offerUrl ? <a href={offer.offerUrl} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-[#A67C00] hover:underline dark:text-[#E6C764]">Open offer <ExternalLink className="h-3 w-3" /></a> : null}
              </div>
            </article>;
          })}
        </div>
      )}
    </section>
  );
}

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const { lang } = useLanguage();
  const revealRef = useReveal<HTMLDivElement>();
  const [storeSearch, setStoreSearch] = useState("");
  const [storeCategory, setStoreCategory] = useState("All");

  const handleStoreDiscovery = (event: React.FormEvent) => {
    event.preventDefault();
    window.location.assign(buildStoreDirectoryHref(storeSearch, storeCategory));
  };

  return (
    <div
      ref={revealRef}
      className="min-h-screen bg-background font-sans text-foreground selection:bg-[#111418] selection:text-[#D4AF37]">
      {/* ============ ANNOUNCE BAR ============ */}
      <div className="bg-[#111418] text-[#D4AF37] px-4 py-2 text-xs sm:text-sm font-medium text-center flex items-center justify-center gap-2">
        <span className="bg-[#D4AF37] text-[#111418] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
          East Africa Express
        </span>
        {tr("hero.badge", lang)}
      </div>

      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#1a1d23]/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="container flex h-20 items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex min-w-0 shrink items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111418] flex items-center justify-center text-[#D4AF37] font-bold text-xl shadow-md">
              UK
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-[#111418] dark:text-[#F7F4E8] tracking-tight block leading-none">
                UK Shoppers <span className="text-[#C9A227] dark:text-[#E6C764]">Africa</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
                Powered by INM LTD
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/80">
            <a href="#how-it-works" className="hover:text-[#111418] dark:hover:text-[#D4AF37] transition-colors">{tr("nav.howItWorks", lang)}</a>
            <a href="#seasonal-offers" className="hover:text-[#111418] dark:hover:text-[#D4AF37] transition-colors">Seasonal offers</a>
            <Link href="/stores" className="hover:text-[#111418] dark:hover:text-[#D4AF37] transition-colors">{tr("nav.stores", lang)}</Link>
            <Link href="/admin" className="text-[#111418] dark:text-[#F3E7AF] font-semibold hover:underline dark:hover:text-[#D4AF37]">{tr("nav.staffAdmin", lang)}</Link>
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            {/* Language switcher */}
            <LanguageSwitcher compact />

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-foreground/80" />
              ) : (
                <Sun className="w-5 h-5 text-[#D4AF37]" />
              )}
            </button>
            <Link
              href="/portal"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#111418] dark:text-foreground hover:text-[#111418]/80 px-4 py-2">
              Customer Login
            </Link>
            <Link
              href="/add"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#111418] px-3 py-2.5 text-xs font-semibold text-[#D4AF37] shadow-md transition-all hover:bg-[#111418]/90 active:scale-[0.98] sm:gap-2 sm:px-5 sm:text-sm">
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="border-t border-border/70 bg-white/80 dark:bg-[#15181d]/80">
          <div className="container flex h-11 items-center gap-3 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
            <span className="hidden md:inline text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Browse UK stores</span>
            <span className="hidden md:block h-4 w-px bg-border" aria-hidden="true" />
            {storeCategories.filter((category) => category !== "All").map((category) => (
              <Link
                key={category}
                href={buildStoreDirectoryHref("", category)}
                className="text-xs font-semibold text-foreground/75 hover:text-[#A67C00] dark:hover:text-[#E6C764] transition-colors">
                {category}
              </Link>
            ))}
            <Link href="/stores" className="ml-auto text-xs font-bold text-[#A67C00] dark:text-[#E6C764] hover:underline underline-offset-4">All stores</Link>
          </div>
        </div>
        <div className="retailer-belt border-t border-border/70 bg-[#111418] text-[#F7F4E8] dark:bg-black" aria-label="Supported UK retailer icons">
          <div className="container flex h-[72px] items-center gap-3 overflow-hidden">
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="retailer-belt-track gap-4 py-2">
                {[...marqueeStores, ...marqueeStores].map((store, index) => {
                  const retailerUrl = getRetailerUrl(store.domain);
                  return (
                    <a
                      key={`${store.name}-${index}`}
                      href={retailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${store.name} UK storefront`}
                      aria-hidden={index >= marqueeStores.length}
                      tabIndex={index >= marqueeStores.length ? -1 : undefined}
                      className="flex h-12 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white p-2.5 hover:border-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]">
                      {storeLogos[store.name] ? <img src={storeLogos[store.name]} alt="" className="h-8 w-12 object-contain" loading="lazy" /> : <span className="text-sm font-black text-[#111418]">{store.name.slice(0, 1)}</span>}
                    </a>
                  );
                })}
              </div>
            </div>
            <Link href="/stores" aria-label="View all UK stores" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/45 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111418]"><ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </header>

      {/* ============ HERO SECTION (cinematic) ============ */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* drifting faint-blue accent blobs */}
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-[#9db8dd]/25 dark:bg-[#3d5a8a]/20 blur-3xl pointer-events-none drift-slow" aria-hidden />
        <div className="absolute -bottom-32 right-0 w-[560px] h-[560px] rounded-full bg-[#D4AF37]/15 dark:bg-[#D4AF37]/10 blur-3xl pointer-events-none drift-slow" style={{ animationDelay: "-8s" }} aria-hidden />

        {/* Ken Burns backdrop */}
        <div className="absolute inset-0 pointer-events-none hero-kenburns" aria-hidden>
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${HERO_CITIES_IMG})`, backgroundPosition: "center 38%" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background pointer-events-none dark:from-[#1a1d23]/95 dark:via-[#1a1d23]/85 dark:to-[#1a1d23]" aria-hidden />

        {/* Dark-mode glowing accent lights */}
        <div className="hero-glow-gold dark:block hidden absolute top-10 right-[15%] w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none drift-slow" style={{ animationDelay: "-4s" }} aria-hidden />
        <div className="hero-glow-blue dark:block hidden absolute bottom-[-80px] left-[10%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none drift-slow" style={{ animationDelay: "-12s" }} aria-hidden />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="hero-rise inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111418]/10 dark:bg-[#111418]/60 text-[#111418] dark:text-[#D4AF37] text-xs font-semibold tracking-wide backdrop-blur-sm">
                <Globe className="w-4 h-4 text-[#C9A227]" />
                London Warehouse to Dar es Salaam, Nairobi, Kampala & Kigali
              </div>
              <h1 className="hero-rise hero-rise-d1 text-4xl sm:text-6xl font-bold tracking-tight text-[#111418] dark:text-foreground leading-[1.1]">
                {tr("hero.title1", lang)} <br />
                <span className="hero-shimmer font-display italic">{tr("hero.title2", lang)}</span>
              </h1>
              <p className="hero-rise hero-rise-d2 text-lg text-muted-foreground leading-relaxed max-w-xl bg-white/60 dark:bg-card/70 backdrop-blur-sm rounded-xl px-4 py-3">
                {tr("hero.body", lang)}
              </p>

              <div className="hero-rise hero-rise-d3 border-l-2 border-[#C9A227] pl-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#A67C00] dark:text-[#E6C764]">Shop departments</p>
                <div className="mt-2 flex flex-wrap justify-start gap-2">
                  {storeCategories.filter((category) => category !== "All").map((category) => (
                    <Link
                      key={category}
                      href={buildStoreDirectoryHref("", category)}
                      className="rounded-full border border-[#111418]/15 bg-white/75 px-3 py-1.5 text-xs font-semibold text-[#111418] backdrop-blur-sm transition-colors hover:border-[#C9A227] hover:text-[#A67C00] dark:border-[#D4AF37]/35 dark:bg-card/80 dark:text-[#F7F4E8] dark:hover:border-[#D4AF37] dark:hover:text-[#D4AF37]">
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="hero-rise hero-rise-d4 flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/add"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#111418] dark:bg-[#D4AF37] text-white dark:text-[#111418] px-8 py-4 text-base font-semibold shadow-lg hover:bg-[#111418]/90 dark:hover:brightness-95 transition-all active:scale-[0.97]">
                  <Link2 className="w-5 h-5 text-[#D4AF37] dark:text-[#111418]" /> {tr("hero.ctaLink", lang)}
                </Link>
                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#111418]/20 dark:border-[#D4AF37]/50 bg-white/80 dark:bg-card/80 text-[#111418] dark:text-foreground px-8 py-4 text-base font-semibold hover:border-[#111418] dark:hover:border-[#D4AF37] transition-all active:scale-[0.97]">
                  {tr("hero.ctaPortal", lang)}
                </Link>
              </div>

              <form onSubmit={handleStoreDiscovery} className="hero-rise hero-rise-d4 max-w-2xl rounded-2xl border border-border/80 bg-white/75 dark:bg-card/80 p-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3 px-1 pb-2">
                  <label htmlFor="hero-store-search" className="text-xs font-bold text-[#111418] dark:text-[#F7F4E8]">Find a UK store or department</label>
                  <Link href="/stores" className="text-xs font-semibold text-[#A67C00] dark:text-[#E6C764] hover:underline underline-offset-4">Browse all stores</Link>
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_164px_auto]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <input
                      id="hero-store-search"
                      value={storeSearch}
                      onChange={(event) => setStoreSearch(event.target.value)}
                      placeholder="Amazon, trainers, beauty, home…"
                      className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]/60"
                    />
                  </div>
                  <select
                    value={storeCategory}
                    onChange={(event) => setStoreCategory(event.target.value)}
                    aria-label="Filter stores by category"
                    className="h-11 rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#C9A227]/60">
                    {storeCategories.map((category) => <option key={category} value={category}>{category === "All" ? "All categories" : category}</option>)}
                  </select>
                  <Button type="submit" className="h-11 rounded-xl bg-[#111418] px-5 text-[#D4AF37] hover:bg-black">
                    Search stores <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <p className="px-1 pt-2 text-[11px] text-muted-foreground">We open the retailer’s UK site in a new tab; bring any product link back for staff review.</p>
              </form>

              <div className="hero-rise hero-rise-d4 grid grid-cols-3 gap-6 pt-6 border-t border-border/60">
                <div>
                  <div className="text-2xl font-bold text-[#111418] dark:text-foreground">4–8 Days</div>
                  <div className="text-xs text-muted-foreground font-medium">{tr("hero.fast", lang)}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#C9A227] dark:text-[#D4AF37]">100%</div>
                  <div className="text-xs text-muted-foreground font-medium">{tr("hero.duties", lang)}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#111418] dark:text-foreground">24/7</div>
                  <div className="text-xs text-muted-foreground font-medium">{tr("hero.whatsapp", lang)}</div>
                </div>
              </div>
            </div>

            {/* Verified seasonal offers in Hero */}
            <div id="calculator" className="lg:col-span-5">
              <SeasonalOffersPanel />
            </div>
          </div>
        </div>
      </section>

      {/* ============ SHOP BY CATEGORY VISUALS ============ */}
      <section className="py-16 sm:py-20 bg-[#F2F4F7]">
        <div className="container grid gap-10 lg:grid-cols-[15rem_1fr] lg:items-start">
          <div className="text-left lg:sticky lg:top-36">
            <span className="inline-block text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
              Shop by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111418] mt-3">
              {tr("sec.categories", lang)}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Browse trusted UK departments first, then bring the exact product link back for staff review.</p>
            <Link href="/stores" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#A67C00] hover:underline underline-offset-4">Explore every store <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer">
              <img src={LIFESTYLE_FASHION_IMG} alt="Fashion and accessories shopping haul" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111418]/90 via-[#111418]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-white font-bold text-xl">Fashion & Accessories</h3>
                <p className="text-white/80 text-xs mt-1">Nike · ASOS · Zara · Next · H&M · Primark</p>
              </div>
            </div>
            <div className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer">
              <img src={LIFESTYLE_ELECTRONICS_IMG} alt="Electronics and gadgets shopping haul" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111418]/90 via-[#111418]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-white font-bold text-xl">Electronics & Tech</h3>
                <p className="text-white/80 text-xs mt-1">Apple · Currys · Argos · John Lewis · Back Market</p>
              </div>
            </div>
            <div className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer">
              <img src={LIFESTYLE_BEAUTY_IMG} alt="Beauty and skincare shopping haul" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111418]/90 via-[#111418]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-white font-bold text-xl">Beauty & Health</h3>
                <p className="text-white/80 text-xs mt-1">Boots · Superdrug · Sephora · The Body Shop</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ POPULAR UK STORES ============ */}
      <section id="stores" className="py-16 sm:py-20 bg-white border-y border-border">
        <StoreWall lang={lang} />
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-24 bg-[#F2F4F7]">
        <div className="container">
          <div className="text-left max-w-2xl mb-16">
              <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
              {tr("sec.howBadge", lang)}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111418] mt-3">
              {tr("sec.howTitle", lang)}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {tr("sec.howSub", lang)}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, idx) => (
              <div
                key={idx}
                data-reveal-delay={String(idx + 1)}
                className="reveal-up bg-white rounded-3xl p-8 shadow-xl border border-border/60 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-6 right-6 text-4xl font-black text-[#111418]/10">
                  {s.num}
                </div>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#111418] text-[#D4AF37] flex items-center justify-center mb-6 shadow-md">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111418] mb-3">{tr(s.title, lang)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-border/40 flex items-center gap-2 text-xs font-semibold text-[#111418]">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" /> {tr("sec.insured", lang)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PARCEL JOURNEY TIMELINE ============ */}
      <section id="journey" className="py-24 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
              Track Every Mile
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111418] mt-3">
              {tr("sec.journeyTitle", lang)}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                {tr("sec.journeySub", lang)}
            </p>
          </div>

          <div className="relative">
            {/* Connection line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-[#111418]/20 via-[#C9A227]/60 to-[#111418]/20" aria-hidden />
            <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6">
              {journeyStops.map((stop, idx) => (
                <div key={idx} data-reveal-delay={String((idx % 6) + 1)} className="reveal-up relative flex flex-col items-center text-center">
                  <div className="relative z-10 w-20 h-20 rounded-full bg-white border-2 border-[#111418] shadow-lg flex items-center justify-center mb-5">
                    <div className="w-14 h-14 rounded-full bg-[#111418] text-[#D4AF37] flex items-center justify-center">
                      <stop.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider mb-1.5">{stop.time}</span>
                  <h3 className="font-bold text-[#111418] text-sm leading-tight">{tr(stop.title, lang)}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed max-w-[180px]">{stop.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ SECTION ============ */}
      <section id="faq" className="py-24 bg-[#F2F4F7]">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <span className="inline-block text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
                Questions & Answers
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111418] mt-3 leading-tight">
                {tr("sec.faqTitle", lang)}
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {tr("sec.faqSub", lang)}
              </p>
              <div className="mt-6 bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Recycle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#111418]">{tr("faq.stillQuestion", lang)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tr("faq.stillAnswer", lang)}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} data-reveal-delay={String((idx % 4) + 1)} className="reveal-up">
                  <FaqItem faq={faq} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST SECTION ============ */}
      <section className="py-24 bg-white border-t border-border">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
              Trust & Credibility
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111418] mt-3">
              {tr("sec.trustTitle", lang)}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {tr("sec.trustSub", lang)}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {trustIndicators.map((t, idx) => (
              <div key={idx} data-reveal-delay={String(idx + 1)} className="reveal-up bg-[#F2F4F7] rounded-3xl p-7 border border-border/80 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#111418] text-[#D4AF37] flex items-center justify-center mb-5 shadow-md">
                  <t.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#111418] mb-2">{t.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>

          {/* Review cards — structure awaiting real customer content */}
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-[#111418]">{tr("trust.reviews", lang)}</h3>
            <p className="text-xs text-muted-foreground mt-2 mb-10 max-w-lg mx-auto">
              Real reviews from verified customers will appear here once collected — we never publish fabricated testimonials.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {reviewStructure.map((_, idx) => (
              <div key={idx} className="relative bg-background rounded-3xl border-2 border-dashed border-[#111418]/30 p-7 flex flex-col items-center justify-center text-center min-h-[220px]">
                <Quote className="w-8 h-8 text-[#111418]/20 mb-4" />
                <p className="text-sm text-muted-foreground font-medium">
                  Verified customer review<br />#{idx + 1} — coming soon
                </p>
                <p className="text-[11px] text-muted-foreground/70 mt-3 max-w-[240px]">
                  Add your first real review card with customer name, city, photo, and quote.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EAST AFRICA HUBS & RATES ============ */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
                {tr("sec.hubsBadge", lang)}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111418] tracking-tight">
                {tr("sec.hubsTitle", lang)}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We maintain direct cargo partnerships connecting our London Heathrow hub with major economic centers in Tanzania, Kenya, Uganda, and Rwanda. Whether you are ordering personal fashion, electronics, or business equipment, we ensure safe arrival.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#111418]">{tr("sec.consolidation", lang)}</h4>
                    <p className="text-xs text-muted-foreground">{tr("sec.consolidationBody", lang)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#111418]">{tr("sec.mobileMoney", lang)}</h4>
                    <p className="text-xs text-muted-foreground">{tr("sec.mobileMoneyBody", lang)}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 rounded-full bg-[#111418] text-[#D4AF37] px-6 py-3 text-sm font-semibold shadow-md hover:bg-[#111418]/90">
                  {tr("sec.accessDashboard", lang)} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-full border border-[#111418]/30 text-[#111418] px-6 py-3 text-sm font-semibold hover:bg-muted">
                  {tr("sec.teamAdmin", lang)}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-6">
                <img src={WAREHOUSE_IMG} alt="UK Shoppers Africa London warehouse fulfillment operations" className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111418]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h4 className="text-white font-bold text-lg">London Heathrow Fulfillment Hub</h4>
                  <p className="text-white/80 text-xs mt-1">Inspection · Consolidation · Express Dispatch</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {destinations.map((d, i) => (
                  <div key={i} className="bg-[#F2F4F7] rounded-3xl p-6 border border-border/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{d.flag}</span>
                      <span className="text-xs font-bold bg-[#111418] text-[#D4AF37] px-2.5 py-1 rounded-full">
                        {d.days}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111418] text-base">{d.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Air Express Cargo</p>
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Rate from:</span>
                      <span className="font-bold text-[#111418]">£11 / kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#111418] text-white pt-16 pb-12 border-t border-[#111418]/20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center text-[#111418] font-bold text-lg">
                  UK
                </div>
                <span className="font-bold text-lg tracking-tight">
                  UK Shoppers <span className="text-[#D4AF37]">Africa</span>
                </span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Your premier UK personal shopping and parcel forwarding partner for East Africa. Powered by INM LTD.
              </p>
              <div className="text-xs text-[#D4AF37] font-semibold">
                Dar es Salaam • Nairobi • Kampala • Kigali
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-[#D4AF37]">{tr("foot.quickLinks", lang)}</h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li><Link href="/" className="hover:text-[#D4AF37]">{tr("foot.home", lang)}</Link></li>
                <li><Link href="/portal" className="hover:text-[#D4AF37]">{tr("foot.dashboard", lang)}</Link></li>
                <li><Link href="/add" className="hover:text-[#D4AF37]">{tr("foot.quote", lang)}</Link></li>
                <li><Link href="/admin" className="text-[#D4AF37] font-semibold hover:underline">{tr("foot.admin", lang)}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-[#D4AF37]">{tr("foot.services", lang)}</h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li><span className="hover:text-[#D4AF37] cursor-pointer">UK Warehouse Address</span></li>
                <li><span className="hover:text-[#D4AF37] cursor-pointer">Personal Shopping Assistance</span></li>
                <li><span className="hover:text-[#D4AF37] cursor-pointer">Parcel Consolidation</span></li>
                <li><span className="hover:text-[#D4AF37] cursor-pointer">Customs & Duty Clearance</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-[#D4AF37]">{tr("foot.contact", lang)}</h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li className="flex items-center gap-2"><PhoneCall className="w-4 h-4 text-[#D4AF37]" /> +255 763 173 629</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#D4AF37]" /> info@ukshoppersafrica.com</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D4AF37]" /> London Heathrow Hub & East Africa Offices</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60">
            <p>© 2026 UK Shoppers Africa (INM LTD). {tr("foot.rights", lang)}</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="/privacy" className="hover:text-white cursor-pointer">{tr("foot.privacy", lang)}</Link>
              <Link href="/terms" className="hover:text-white cursor-pointer">{tr("foot.terms", lang)}</Link>
              <Link href="/returns" className="hover:text-white cursor-pointer">{tr("foot.shipping", lang)}</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* AI shopping assistant */}
      <AssistantChat />
    </div>
  );
}
