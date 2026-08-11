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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0A3622] mt-3">
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
                ? "bg-[#0A3622] text-[#F6E05E] shadow-md"
                : "bg-background text-foreground/70 border border-border hover:border-[#0A3622]/50 hover:text-[#0A3622]"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Store grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((store) => (
          <div
            key={store.name}
            className="group bg-background rounded-2xl p-4 border border-border/80 hover:border-[#C9A227] hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A3622] to-[#124a30] text-[#F6E05E] flex items-center justify-center font-black text-sm shadow-sm">
              {store.name.charAt(0)}
            </div>
            <h3 className="font-bold text-[#0A3622] text-sm mt-3 leading-tight">
              {store.name}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{store.domain}</p>
            <p className="text-[11px] text-foreground/70 mt-2 leading-snug">{store.note}</p>
            <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 w-full">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Verified UK Store
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        Not on the list? We support virtually every UK retailer — paste any product link and we'll confirm instantly.
      </p>
    </div>
  );
}

export default function Landing() {
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
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-[#0A3622] selection:text-[#F6E05E]">
      {/* ============ ANNOUNCE BAR ============ */}
      <div className="bg-[#0A3622] text-[#F6E05E] px-4 py-2 text-xs sm:text-sm font-medium text-center flex items-center justify-center gap-2">
        <span className="bg-[#F6E05E] text-[#0A3622] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
          East Africa Express
        </span>
        Direct UK Personal Shopping & Parcel Forwarding for Tanzania, Kenya, Uganda & Rwanda
      </div>

      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="container flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A3622] flex items-center justify-center text-[#F6E05E] font-bold text-xl shadow-md">
              UK
            </div>
            <div>
              <span className="font-bold text-lg text-[#0A3622] tracking-tight block leading-none">
                UK Shoppers <span className="text-[#C9A227]">Africa</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
                Powered by INM LTD
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/80">
            <a href="#how-it-works" className="hover:text-[#0A3622] transition-colors">How It Works</a>
            <a href="#calculator" className="hover:text-[#0A3622] transition-colors">Instant Quote</a>
            <a href="#stores" className="hover:text-[#0A3622] transition-colors">Popular Stores</a>
            <Link href="/admin" className="text-[#0A3622] font-semibold hover:underline">Staff Admin</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#0A3622] hover:text-[#0A3622]/80 px-4 py-2">
              Customer Login
            </Link>
            <Link
              href="/add"
              className="inline-flex items-center gap-2 rounded-full bg-[#0A3622] text-[#F6E05E] px-5 py-2.5 text-sm font-semibold shadow-md hover:bg-[#0A3622]/90 transition-all active:scale-[0.98]">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ============ HERO SECTION ============ */}
      <section className="relative pt-16 pb-24 overflow-hidden bg-gradient-to-b from-[#0A3622]/5 via-background to-background">
        <div className="absolute inset-0 opacity-[0.35] bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url(${HERO_DELIVERY_IMG})`, backgroundPosition: "center 30%" }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white/70 pointer-events-none" aria-hidden />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A3622]/10 text-[#0A3622] text-xs font-semibold tracking-wide">
                <Globe className="w-4 h-4 text-[#C9A227]" />
                London Warehouse to Dar es Salaam, Nairobi, Kampala & Kigali
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#0A3622] leading-[1.1]" style={{ textShadow: "0 2px 20px rgba(255,255,255,0.7)" }}>
                Shop the UK. <br />
                <span className="text-[#C9A227]">Delivered to East Africa.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3">
                Get your favorite items from Amazon UK, ASOS, Zara, and top British stores. Paste any product link, upload a cart screenshot, or use your free UK address. We handle purchase, consolidation, and express air freight with customs cleared.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/add"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#0A3622] text-white px-8 py-4 text-base font-semibold shadow-lg hover:bg-[#0A3622]/90 transition-all">
                  <Link2 className="w-5 h-5 text-[#F6E05E]" /> Paste Link or Upload Cart
                </Link>
                <Link
                  href="/portal"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0A3622]/20 bg-white text-[#0A3622] px-8 py-4 text-base font-semibold hover:border-[#0A3622] transition-all">
                  Open Customer Portal
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/60">
                <div>
                  <div className="text-2xl font-bold text-[#0A3622]">4–8 Days</div>
                  <div className="text-xs text-muted-foreground font-medium">Fast Air Transit</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0A3622]">100%</div>
                  <div className="text-xs text-muted-foreground font-medium">Duties Prepaid</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0A3622]">24/7</div>
                  <div className="text-xs text-muted-foreground font-medium">WhatsApp & Portal Updates</div>
                </div>
              </div>
            </div>

            {/* Quick Quote Widget in Hero */}
            <div id="calculator" className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#C9A227]/20 text-[#0A3622] text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                  Instant Calculator
                </div>
                <h3 className="text-xl font-bold text-[#0A3622] mb-1 flex items-center gap-2">
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
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3622]">
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
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3622]"
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
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3622]"
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
                        className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3622]"
                      />
                    </div>
                  </div>

                  <div className="bg-[#0A3622]/5 rounded-2xl p-4 border border-[#0A3622]/10 space-y-2 mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Estimated UK Shipping ({weightKg}kg):</span>
                      <span>£{shippingCostGBP.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Service & Inspection Fee:</span>
                      <span>£{serviceFeeGBP.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between items-center">
                      <span className="text-sm font-bold text-[#0A3622]">Total Est. Cost:</span>
                      <div className="text-right">
                        <div className="text-base font-bold text-[#0A3622]">£{totalGBP.toFixed(2)}</div>
                        <div className="text-xs font-semibold text-[#C9A227]">{localTotal}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#0A3622] text-[#F6E05E] py-3.5 text-sm font-bold shadow-lg hover:bg-[#0A3622]/90 transition-all flex items-center justify-center gap-2">
                    Proceed with Order <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SHOP BY CATEGORY VISUALS ============ */}
      <section className="py-16 sm:py-20 bg-[#F4F7F6]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
              Shop by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A3622] mt-3">
              Everything You Love, One Link Away
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer">
              <img src={LIFESTYLE_FASHION_IMG} alt="Fashion and accessories shopping haul" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A3622]/90 via-[#0A3622]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-white font-bold text-xl">Fashion & Accessories</h3>
                <p className="text-white/80 text-xs mt-1">Nike · ASOS · Zara · Next · H&M · Primark</p>
              </div>
            </div>
            <div className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer">
              <img src={LIFESTYLE_ELECTRONICS_IMG} alt="Electronics and gadgets shopping haul" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A3622]/90 via-[#0A3622]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-white font-bold text-xl">Electronics & Tech</h3>
                <p className="text-white/80 text-xs mt-1">Apple · Currys · Argos · John Lewis · Back Market</p>
              </div>
            </div>
            <div className="group relative rounded-3xl overflow-hidden shadow-xl cursor-pointer">
              <img src={LIFESTYLE_BEAUTY_IMG} alt="Beauty and skincare shopping haul" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A3622]/90 via-[#0A3622]/30 to-transparent" />
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
      <section id="how-it-works" className="py-24 bg-[#F4F7F6]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-3 py-1 rounded-full">
              Seamless Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A3622] mt-3">
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
                className="bg-white rounded-3xl p-8 shadow-xl border border-border/60 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-6 right-6 text-4xl font-black text-[#0A3622]/10">
                  {s.num}
                </div>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#0A3622] text-[#F6E05E] flex items-center justify-center mb-6 shadow-md">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A3622] mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-border/40 flex items-center gap-2 text-xs font-semibold text-[#0A3622]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fully Insured & Tracked
                </div>
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
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0A3622] tracking-tight">
                Dedicated Express Routes Across East Africa
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We maintain direct cargo partnerships connecting our London Heathrow hub with major economic centers in Tanzania, Kenya, Uganda, and Rwanda. Whether you are ordering personal fashion, electronics, or business equipment, we ensure safe arrival.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0A3622]">Consolidation & Volumetric Savings</h4>
                    <p className="text-xs text-muted-foreground">Combine parcels from 5 different UK stores into one shipment and save up to 25% on shipping.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0A3622]">Local Currency & Mobile Money Payments</h4>
                    <p className="text-xs text-muted-foreground">Pay conveniently using M-Pesa, Tigo Pesa, Airtel Money, bank transfer, or debit/credit cards.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0A3622] text-[#F6E05E] px-6 py-3 text-sm font-semibold shadow-md hover:bg-[#0A3622]/90">
                  Access Client Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-full border border-[#0A3622]/30 text-[#0A3622] px-6 py-3 text-sm font-semibold hover:bg-muted">
                  Team Operations Admin
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-6">
                <img src={WAREHOUSE_IMG} alt="UK Shoppers Africa London warehouse fulfillment operations" className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A3622]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h4 className="text-white font-bold text-lg">London Heathrow Fulfillment Hub</h4>
                  <p className="text-white/80 text-xs mt-1">Inspection · Consolidation · Express Dispatch</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {destinations.map((d, i) => (
                  <div key={i} className="bg-[#F4F7F6] rounded-3xl p-6 border border-border/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{d.flag}</span>
                      <span className="text-xs font-bold bg-[#0A3622] text-[#F6E05E] px-2.5 py-1 rounded-full">
                        {d.days}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0A3622] text-base">{d.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Air Express Cargo</p>
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Rate from:</span>
                      <span className="font-bold text-[#0A3622]">£11 / kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#0A3622] text-white pt-16 pb-12 border-t border-[#0A3622]/20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F6E05E] flex items-center justify-center text-[#0A3622] font-bold text-lg">
                  UK
                </div>
                <span className="font-bold text-lg tracking-tight">
                  UK Shoppers <span className="text-[#F6E05E]">Africa</span>
                </span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Your premier UK personal shopping and parcel forwarding partner for East Africa. Powered by INM LTD.
              </p>
              <div className="text-xs text-[#F6E05E] font-semibold">
                Dar es Salaam • Nairobi • Kampala • Kigali
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-[#F6E05E]">Quick Links</h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li><Link href="/" className="hover:text-[#F6E05E]">Home</Link></li>
                <li><Link href="/portal" className="hover:text-[#F6E05E]">Customer Dashboard</Link></li>
                <li><Link href="/add" className="hover:text-[#F6E05E]">Instant Quote & Link</Link></li>
                <li><Link href="/admin" className="text-[#F6E05E] font-semibold hover:underline">Operations Staff Admin</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-[#F6E05E]">Services</h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li><span className="hover:text-[#F6E05E] cursor-pointer">UK Warehouse Address</span></li>
                <li><span className="hover:text-[#F6E05E] cursor-pointer">Personal Shopping Assistance</span></li>
                <li><span className="hover:text-[#F6E05E] cursor-pointer">Parcel Consolidation</span></li>
                <li><span className="hover:text-[#F6E05E] cursor-pointer">Customs & Duty Clearance</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-4 text-[#F6E05E]">Contact & Support</h4>
              <ul className="space-y-2.5 text-xs text-white/80">
                <li className="flex items-center gap-2"><PhoneCall className="w-4 h-4 text-[#F6E05E]" /> +255 763 173 629</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#F6E05E]" /> info@ukshoppersafrica.com</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#F6E05E]" /> London Heathrow Hub & East Africa Offices</li>
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
