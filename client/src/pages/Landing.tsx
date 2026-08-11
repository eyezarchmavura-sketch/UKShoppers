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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

function scrollToCalculator() {
  document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
}

const LOGO_IMG = "/manus-storage/logo-mark_edee000e.png";
const HERO_DELIVERY_IMG = "/manus-storage/hero-delivery-dar_77b8be1d.png";
const WAREHOUSE_IMG = "/manus-storage/warehouse-london_64a80d77.png";
const LIFESTYLE_FASHION_IMG = "/manus-storage/lifestyle-fashion_e2409cf2.png";
const LIFESTYLE_ELECTRONICS_IMG = "/manus-storage/lifestyle-electronics_ba252c3d.png";
const LIFESTYLE_BEAUTY_IMG = "/manus-storage/lifestyle-beauty_28758d01.png";

interface Store {
  name: string;
  category: string;
  domain: string;
  note: string;
}

const stores: Store[] = [
  { name: "Amazon UK", category: "Marketplace", domain: "amazon.co.uk", note: "Everything under one roof" },
  { name: "eBay UK", category: "Marketplace", domain: "ebay.co.uk", note: "Auctions & direct buys" },
  { name: "ASOS", category: "Fashion", domain: "asos.com", note: "Trend-led fashion & beauty" },
  { name: "Nike UK", category: "Fashion", domain: "nike.com/gb", note: "Sneakers & sportswear" },
  { name: "Adidas UK", category: "Fashion", domain: "adidas.co.uk", note: "Sportswear & originals" },
  { name: "Zara UK", category: "Fashion", domain: "zara.com/uk", note: "Contemporary fashion" },
  { name: "Next UK", category: "Fashion", domain: "next.co.uk", note: "Family fashion & home" },
  { name: "Marks & Spencer", category: "Fashion", domain: "marksandspencer.com", note: "British quality classics" },
  { name: "Primark Online", category: "Fashion", domain: "primark.com", note: "Budget-friendly fashion" },
  { name: "Boots", category: "Beauty & Health", domain: "boots.com", note: "Pharmacy & skincare" },
  { name: "Superdrug", category: "Beauty & Health", domain: "superdrug.com", note: "Health & beauty deals" },
  { name: "Apple UK", category: "Electronics", domain: "apple.com/uk", note: "iPhone, Mac & more" },
  { name: "Argos", category: "Electronics", domain: "argos.co.uk", note: "Home, tech & toys" },
  { name: "Currys", category: "Electronics", domain: "currys.co.uk", note: "Electronics & appliances" },
  { name: "John Lewis", category: "Electronics", domain: "johnlewis.com", note: "Premium home & tech" },
  { name: "Sports Direct", category: "Sport & Outdoors", domain: "sportsdirect.com", note: "Big sports brands" },
  { name: "JD Sports", category: "Sport & Outdoors", domain: "jdsports.co.uk", note: "Trainers & kit" },
  { name: "Decathlon UK", category: "Sport & Outdoors", domain: "decathlon.co.uk", note: "Outdoor & fitness gear" },
  { name: "Lakeland", category: "Home & Kitchen", domain: "lakeland.co.uk", note: "Kitchen & home essentials" },
  { name: "IKEA UK", category: "Home & Kitchen", domain: "ikea.com/gb", note: "Furniture & homeware" },
  { name: "H&M UK", category: "Fashion", domain: "hm.com/gb", note: "Affordable everyday style" },
  { name: "The Body Shop", category: "Beauty & Health", domain: "thebodyshop.com", note: "Natural skincare" },
  { name: "Sephora UK", category: "Beauty & Health", domain: "sephora.co.uk", note: "Luxury cosmetics" },
  { name: "HMV", category: "Entertainment", domain: "hmv.com", note: "Music, games & collectibles" },
];

const storeCategories = [
  "All",
  ...Array.from(new Set(stores.map((s) => s.category))),
];

const journeyStops = [
  {
    icon: Warehouse,
    title: "UK Warehouse Received",
    body: "Your items arrive at our London Heathrow fulfillment hub where each parcel is weighed, measured, and photographed.",
    time: "Day 1–2",
  },
  {
    icon: FileCheck2,
    title: "Quality Inspection",
    body: "Our team inspects every item for quality, photos it to your portal, and repacks it to reduce shipping volume.",
    time: "Day 2–3",
  },
  {
    icon: Plane,
    title: "Express Air Freight",
    body: "Your consolidated shipment flies direct to East Africa on dedicated cargo routes with full insurance coverage.",
    time: "Day 3–5",
  },
  {
    icon: ClipboardCheck,
    title: "Customs Cleared",
    body: "We handle all customs documentation and duties on your behalf — no surprise fees at the border. 100% prepaid.",
    time: "Day 5–6",
  },
  {
    icon: Truck,
    title: "Last-Mile Delivery",
    body: "Your parcel clears the destination hub and heads to your city with our vetted local delivery partners.",
    time: "Day 6–7",
  },
  {
    icon: HomeIcon,
    title: "Doorstep Delivery",
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
];

const trustIndicators = [
  { icon: BadgeCheck, title: "Verified Parcels", body: "Every item inspected, photographed & confirmed before it ships from the UK" },
  { icon: Shield, title: "Fully Insured", body: "All shipments covered end-to-end — London warehouse to your doorstep" },
  { icon: CreditCard, title: "Local Payments", body: "M-Pesa, Tigo Pesa, Airtel Money, bank transfer & cards accepted" },
  { icon: Lock, title: "Duties Prepaid", body: "No surprise border fees — customs handled and included in your quote" },
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
    title: "Send us a UK product link or cart screenshot",
    body: "Paste any link from Amazon UK, ASOS, Zara, or upload a cart screenshot. Prefer full control? Use your personal UK warehouse address at checkout.",
  },
  {
    num: "02",
    icon: Search,
    title: "We buy, inspect & consolidate",
    body: "Our London Heathrow team buys your items, inspects them for quality, and combines multiple parcels into one box to slash your shipping fees.",
  },
  {
    num: "03",
    icon: Truck,
    title: "Express Air Delivery to East Africa",
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

function StoreCard({ store, delay }: { store: Store; delay?: number }) {
  const handleStoreClick = () => {
    // Prefill the calculator with the store's URL pattern and scroll to it
    const input = document.querySelector<HTMLInputElement>(
      '#calculator input[type="text"]'
    );
    if (input) {
      input.value = `https://www.${store.domain}/`;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    }
    scrollToCalculator();
    toast.success(`${store.name} selected — estimate your order below`, {
      duration: 2500,
    });
  };

  return (
    <button
      onClick={handleStoreClick}
      title={`Estimate an order from ${store.name}`}
      className="group bg-background dark:bg-card rounded-2xl p-4 border border-border/80 hover:border-[#C9A227] hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-start text-left w-full reveal-up" data-reveal-delay={String(delay)}>
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-background border border-border/70 flex items-center justify-center shadow-sm overflow-hidden">
        {storeLogos[store.name] ? (
          <img
            src={storeLogos[store.name]}
            alt={`${store.name} brand logo`}
            className="w-8 h-8 object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-[#111418] dark:text-[#D4AF37] font-black text-sm">{store.name.charAt(0)}</span>
        )}
      </div>
      <h3 className="font-bold text-[#111418] text-sm mt-3 leading-tight">
        {store.name}
      </h3>
      <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{store.domain}</p>
      <p className="text-[11px] text-foreground/70 mt-2 leading-snug">{store.note}</p>
      <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 w-full">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Verified UK Store
      </div>
    </button>
  );
}

function StoreWall() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? stores
      : stores.filter((s) => s.category === activeCategory);

  return (
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
          100+ Supported Stores
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111418] mt-3">
          Shop From Any UK Retailer
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          If they sell it in the UK, we can buy it and deliver it to your doorstep in East Africa — pasting a single link is all it takes.
        </p>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
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

      <p className="text-center text-xs text-muted-foreground mt-8">
        Not on the list? We support virtually every UK retailer — paste any product link and we'll confirm instantly.
      </p>
    </div>
  );
}

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const revealRef = useReveal<HTMLDivElement>();
  const [selectedDest, setSelectedDest] = useState(destinations[0]);
  const [productUrl, setProductUrl] = useState("");
  const [itemPriceGBP, setItemPriceGBP] = useState(75);
  const [weightKg, setWeightKg] = useState(1.5);

  const shippingCostGBP = weightKg * 11;
  const serviceFeeGBP = Math.max(5, itemPriceGBP * 0.08);
  const totalGBP = itemPriceGBP + shippingCostGBP + serviceFeeGBP;

  let localTotal = "";
  if (selectedDest.code === "TZ") {
    localTotal = `TSh ${(totalGBP * 3400).toLocaleString()}`;
  } else if (selectedDest.code === "KE") {
    localTotal = `KSh ${(totalGBP * 168).toLocaleString()}`;
  } else if (selectedDest.code === "UG") {
    localTotal = `USh ${(totalGBP * 4900).toLocaleString()}`;
  } else {
    localTotal = `RF ${(totalGBP * 1700).toLocaleString()}`;
  }

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl && itemPriceGBP <= 0) {
      toast.error("Please enter a product link or price");
      return;
    }
    toast.success("Quote generated successfully! Redirecting to checkout portal...");
    setTimeout(() => {
      window.location.href = "/portal";
    }, 1000);
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
        Direct UK Personal Shopping & Parcel Forwarding for Tanzania, Kenya, Uganda & Rwanda
      </div>

      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#1a1d23]/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="container flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111418] flex items-center justify-center text-[#D4AF37] font-bold text-xl shadow-md">
              UK
            </div>
            <div>
              <span className="font-bold text-lg text-[#111418] tracking-tight block leading-none">
                UK Shoppers <span className="text-[#C9A227]">Africa</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
                Powered by INM LTD
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/80">
            <a href="#how-it-works" className="hover:text-[#111418] transition-colors">How It Works</a>
            <a href="#calculator" className="hover:text-[#111418] transition-colors">Instant Quote</a>
            <a href="#stores" className="hover:text-[#111418] transition-colors">Popular Stores</a>
            <Link href="/admin" className="text-[#111418] font-semibold hover:underline">Staff Admin</Link>
          </nav>

          <div className="flex items-center gap-3">
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
              className="inline-flex items-center gap-2 rounded-full bg-[#111418] text-[#D4AF37] px-5 py-2.5 text-sm font-semibold shadow-md hover:bg-[#111418]/90 transition-all active:scale-[0.98]">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
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
            style={{ backgroundImage: `url(${HERO_DELIVERY_IMG})`, backgroundPosition: "center 30%" }}
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
                Shop the UK. <br />
                <span className="hero-shimmer font-display italic">Delivered to East Africa.</span>
              </h1>
              <p className="hero-rise hero-rise-d2 text-lg text-muted-foreground leading-relaxed max-w-xl bg-white/60 dark:bg-card/70 backdrop-blur-sm rounded-xl px-4 py-3">
                Get your favorite items from Amazon UK, ASOS, Zara, and top British stores. Paste any product link, upload a cart screenshot, or use your free UK address. We handle purchase, consolidation, and express air freight with customs cleared.
              </p>

              <div className="hero-rise hero-rise-d3 flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/add"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#111418] dark:bg-[#D4AF37] text-white dark:text-[#111418] px-8 py-4 text-base font-semibold shadow-lg hover:bg-[#111418]/90 dark:hover:brightness-95 transition-all active:scale-[0.97]">
                  <Link2 className="w-5 h-5 text-[#D4AF37] dark:text-[#111418]" /> Paste Link or Upload Cart
                </Link>
                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#111418]/20 dark:border-[#D4AF37]/50 bg-white/80 dark:bg-card/80 text-[#111418] dark:text-foreground px-8 py-4 text-base font-semibold hover:border-[#111418] dark:hover:border-[#D4AF37] transition-all active:scale-[0.97]">
                  Open Customer Portal
                </Link>
              </div>

              <div className="hero-rise hero-rise-d4 grid grid-cols-3 gap-6 pt-6 border-t border-border/60">
                <div>
                  <div className="text-2xl font-bold text-[#111418] dark:text-foreground">4–8 Days</div>
                  <div className="text-xs text-muted-foreground font-medium">Fast Air Transit</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#C9A227] dark:text-[#D4AF37]">100%</div>
                  <div className="text-xs text-muted-foreground font-medium">Duties Prepaid</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#111418] dark:text-foreground">24/7</div>
                  <div className="text-xs text-muted-foreground font-medium">WhatsApp & Portal Updates</div>
                </div>
              </div>
            </div>

            {/* Quick Quote Widget in Hero */}
            <div id="calculator" className="lg:col-span-5">
              <div className="hero-float bg-white dark:bg-card rounded-3xl p-6 sm:p-8 shadow-2xl dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)] border border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#C9A227]/20 text-[#111418] text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                  Instant Calculator
                </div>
                <h3 className="text-xl font-bold text-[#111418] mb-1 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#C9A227]" /> Estimate Your Order
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Select your East African destination and item details for instant pricing.
                </p>

                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">
                      Destination Country
                    </label>
                    <select
                      value={selectedDest.code}
                      onChange={(e) => {
                        const found = destinations.find((d) => d.code === e.target.value);
                        if (found) setSelectedDest(found);
                      }}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#111418]">
                      {destinations.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.flag} {d.name} ({d.days})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">
                      Paste UK Product Link (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.amazon.co.uk/dp/..."
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111418]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">
                        Item Price (£ GBP)
                      </label>
                      <input
                        type="number"
                        min="5"
                        value={itemPriceGBP}
                        onChange={(e) => setItemPriceGBP(Number(e.target.value))}
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111418]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">
                        Approx. Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.2"
                        value={weightKg}
                        onChange={(e) => setWeightKg(Number(e.target.value))}
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111418]"
                      />
                    </div>
                  </div>

                  <div className="bg-[#111418]/5 rounded-2xl p-4 border border-[#111418]/10 space-y-2 mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Estimated UK Shipping ({weightKg}kg):</span>
                      <span>£{shippingCostGBP.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Service & Inspection Fee:</span>
                      <span>£{serviceFeeGBP.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between items-center">
                      <span className="text-sm font-bold text-[#111418]">Total Est. Cost:</span>
                      <div className="text-right">
                        <div className="text-base font-bold text-[#111418]">£{totalGBP.toFixed(2)}</div>
                        <div className="text-xs font-semibold text-[#C9A227]">{localTotal}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#111418] text-[#D4AF37] py-3.5 text-sm font-bold shadow-lg hover:bg-[#111418]/90 transition-all flex items-center justify-center gap-2">
                    Proceed with Order <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SHOP BY CATEGORY VISUALS ============ */}
      <section className="py-16 sm:py-20 bg-[#F2F4F7]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
              Shop by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111418] mt-3">
              Everything You Love, One Link Away
            </h2>
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
        <StoreWall />
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-24 bg-[#F2F4F7]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
              Seamless Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111418] mt-3">
              How UK Shoppers Africa Works
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Designed specifically to make UK online shopping effortless, transparent, and reliable for East Africa.
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
                  <h3 className="text-xl font-bold text-[#111418] mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-border/40 flex items-center gap-2 text-xs font-semibold text-[#111418]">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" /> Fully Insured & Tracked
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
              Your Parcel's Journey, Step by Step
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              From our London warehouse to your doorstep — six checkpoints, fully tracked and updated on WhatsApp.
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
                  <h3 className="font-bold text-[#111418] text-sm leading-tight">{stop.title}</h3>
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
                Everything You Need to Know
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                Can't find your answer? Our team is on WhatsApp 24/7 — tap the chat button or call +255 763 173 629.
              </p>
              <div className="mt-6 bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Recycle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#111418]">Still have questions?</p>
                  <p className="text-xs text-muted-foreground mt-0.5">We reply on WhatsApp in minutes, not days.</p>
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
              Built on Transparency, Backed by Guarantees
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Four promises that define every shipment we handle — because trust is earned one parcel at a time.
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
            <h3 className="text-xl sm:text-2xl font-bold text-[#111418]">What Our Customers Say</h3>
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
                Regional Hubs
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111418] tracking-tight">
                Dedicated Express Routes Across East Africa
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
                    <h4 className="font-bold text-sm text-[#111418]">Consolidation & Volumetric Savings</h4>
                    <p className="text-xs text-muted-foreground">Combine parcels from 5 different UK stores into one shipment and save up to 25% on shipping.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#111418]">Local Currency & Mobile Money Payments</h4>
                    <p className="text-xs text-muted-foreground">Pay conveniently using M-Pesa, Tigo Pesa, Airtel Money, bank transfer, or debit/credit cards.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 rounded-full bg-[#111418] text-[#D4AF37] px-6 py-3 text-sm font-semibold shadow-md hover:bg-[#111418]/90">
                  Access Client Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-full border border-[#111418]/30 text-[#111418] px-6 py-3 text-sm font-semibold hover:bg-muted">
                  Team Operations Admin
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
              <h4 className="font-bold text-sm mb-4 text-[#D4AF37]">Quick Links</h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li><Link href="/" className="hover:text-[#D4AF37]">Home</Link></li>
                <li><Link href="/portal" className="hover:text-[#D4AF37]">Customer Dashboard</Link></li>
                <li><Link href="/add" className="hover:text-[#D4AF37]">Instant Quote & Link</Link></li>
                <li><Link href="/admin" className="text-[#D4AF37] font-semibold hover:underline">Operations Staff Admin</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-[#D4AF37]">Services</h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li><span className="hover:text-[#D4AF37] cursor-pointer">UK Warehouse Address</span></li>
                <li><span className="hover:text-[#D4AF37] cursor-pointer">Personal Shopping Assistance</span></li>
                <li><span className="hover:text-[#D4AF37] cursor-pointer">Parcel Consolidation</span></li>
                <li><span className="hover:text-[#D4AF37] cursor-pointer">Customs & Duty Clearance</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-[#D4AF37]">Contact & Support</h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li className="flex items-center gap-2"><PhoneCall className="w-4 h-4 text-[#D4AF37]" /> +255 763 173 629</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#D4AF37]" /> info@ukshoppersafrica.com</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D4AF37]" /> London Heathrow Hub & East Africa Offices</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60">
            <p>© 2026 UK Shoppers Africa (INM LTD). All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
              <span className="hover:text-white cursor-pointer">Shipping Guidelines</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
