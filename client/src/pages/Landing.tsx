/* GlobalCart public landing page — premium hero, how-it-works, store showcase,
   live pricing calculator, trust comparison, footer. Brand: deep green #0A3622 +
   warm yellow #F6E05E, Fraunces display + Inter body, soft shadows, pill CTAs. */
import { useState } from "react";
import { Link } from "wouter";
import {
  Link2,
  Search,
  Home,
  MapPin,
  ArrowRight,
  Check,
  X,
  Zap,
  ShieldCheck,
  Clock,
  Globe,
  Star,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const HERO_IMG = "/manus-storage/hero-parcels_0542a562.png";
const HOW_IMG = "/manus-storage/howitworks-laptop_e6c94ad7.png";
const MAP_IMG = "/manus-storage/world-map-boxes_7af8f9db.png";
const LOGO_IMG = "/manus-storage/logo-mark_edee000e.png";

const stores = [
  "Amazon UK",
  "ASOS",
  "Zara",
  "Nike",
  "Adidas",
  "Boots",
  "Superdrug",
  "Next",
  "eBay UK",
  "Apple Store",
  "Sports Direct",
  "Back Market",
];

const steps = [
  {
    num: "01",
    icon: Link2,
    title: "Send us a link — or shop yourself",
    body: "Paste a product URL from any supported store and we fetch an instant, all-in quote. Prefer full control? Use your personal UK warehouse address at checkout and we handle the rest.",
  },
  {
    num: "02",
    icon: Search,
    title: "We buy, receive & consolidate",
    body: "Our London team purchases your items, inspects them at the warehouse, and merges multiple parcels into one box — cutting your volumetric weight and shipping cost by up to 20%.",
  },
  {
    num: "03",
    icon: Home,
    title: "Track it home, doorstep delivery",
    body: "Follow your shipment on a live map from London to your door, with WhatsApp pings at every checkpoint. Duties are prepaid — nothing to pay on arrival.",
  },
];

function calc() {
  // Demo rates: UK -> destination, per kg base + handling
  return [
    { code: "NG", name: "Nigeria (Lagos)", flag: "🇳🇬", perKg: 9.8, handling: 4.5, days: "7–10" },
    { code: "GH", name: "Ghana (Accra)", flag: "🇬🇭", perKg: 10.4, handling: 4.5, days: "8–12" },
    { code: "KE", name: "Kenya (Nairobi)", flag: "🇰🇪", perKg: 11.2, handling: 4.5, days: "9–14" },
    { code: "ZA", name: "South Africa (JHB)", flag: "🇿🇦", perKg: 12.6, handling: 4.5, days: "10–14" },
    { code: "CI", name: "Côte d'Ivoire (Abidjan)", flag: "🇨🇮", perKg: 11.8, handling: 4.5, days: "10–15" },
  ];
}

const rates = calc();

export default function Landing() {
  const [dest, setDest] = useState(rates[0]);
  const [weight, setWeight] = useState(2);

  const shipping = weight * dest.perKg + dest.handling;
  const serviceFee = 4 + weight * 1.5;
  const subtotal = shipping + serviceFee;

  return (
    <div className="min-h-screen bg-background">
      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center gap-4 h-16">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img src={LOGO_IMG} alt="GlobalCart" className="w-9 h-9" />
            <span className="font-display font-bold text-xl text-primary tracking-tight">
              Global<span className="text-[#C9A227]">Cart</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 ml-10 text-sm font-medium text-foreground/75">
            <a href="#how" className="hover:text-primary transition-colors">How it works</a>
            <a href="#stores" className="hover:text-primary transition-colors">Stores</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </nav>
          <div className="flex-1" />
          <Link
            href="/add"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-all active:scale-[0.97]">
            Start shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <Button variant="outline" asChild className="hidden sm:inline-flex rounded-full">
            <Link href="/">Portal demo</Link>
          </Button>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#0d4630]" aria-hidden />
        <div
          className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #F6E05E 0%, transparent 40%), radial-gradient(circle at 85% 70%, #F6E05E 0%, transparent 35%)",
          }}
          aria-hidden
        />
        <div className="container relative grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center py-16 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-[#F6E05E] text-xs font-semibold px-3.5 py-1.5 border border-white/15">
              <Globe className="w-3.5 h-3.5" /> Shipping from the UK to all of Africa
            </span>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mt-5 leading-[1.08]">
              Shop UK stores.
              <br />
              Delivered like it's <span className="text-[#F6E05E]">your local market.</span>
            </h1>
            <p className="mt-5 text-lg text-white/75 max-w-xl">
              Paste any product link, get an instant all-in quote, and we buy, ship and clear customs
              — straight to your door. No hidden fees. No WhatsApp bargaining. No surprises at delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/add"
                className="inline-flex items-center gap-2 rounded-full bg-[#F6E05E] text-primary px-7 py-3.5 text-base font-bold hover:brightness-95 transition-all active:scale-[0.97] shadow-[0_8px_24px_rgba(246,224,94,0.25)]">
                Get an instant quote <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-7 py-3.5 text-base font-semibold hover:bg-white/10 transition-all active:scale-[0.97]">
                See how it works
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/70">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#F6E05E]" /> Genuine UK products</span>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-[#F6E05E]" /> 7–10 day delivery</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#F6E05E]" /> 24/7 order support</span>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 bg-[#F6E05E]/15 rounded-[2rem] rotate-2 blur-xl" aria-hidden />
            <img
              src={HERO_IMG}
              alt="Customer receiving a parcel at a London doorstep"
              className="relative rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.4)] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ============ STORE STRIP ============ */}
      <section className="border-b border-border bg-white py-10">
        <div className="container">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Shop from 100+ UK & international stores — including
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {stores.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border bg-muted/60 px-4 py-2 text-sm font-semibold text-foreground/80">
                {s}
              </span>
            ))}
            <span className="rounded-full bg-primary/5 border border-primary/20 px-4 py-2 text-sm font-semibold text-primary">
              + 90 more
            </span>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="py-20 bg-gradient-to-b from-background to-muted/60">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary mt-2">
              Three steps. Zero guesswork.
            </h2>
          </div>
          <div className="mt-12 grid lg:grid-cols-[1fr_1.15fr] gap-12 items-center">
            <div className="space-y-6">
              {steps.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.num} className="flex gap-5">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-[0_4px_16px_rgba(10,54,34,0.18)]">
                      <span className="text-[10px] font-bold text-[#F6E05E] leading-none">{s.num}</span>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">{s.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-[#F6E05E]/20 rounded-[2rem] -rotate-1 blur-lg" aria-hidden />
              <img
                src={HOW_IMG}
                alt="Shopping online with GlobalCart on laptop and phone"
                className="relative rounded-2xl shadow-[0_16px_48px_rgba(10,54,34,0.15)] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRICING CALCULATOR ============ */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Transparent pricing</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary mt-2">
              Know the real total — before you buy
            </h2>
            <p className="text-muted-foreground mt-3">
              Estimate your all-in shipping cost. Pick your destination, set your parcel weight,
              and see the exact breakdown. No hidden charges at delivery — duties can be prepaid too.
            </p>
          </div>

          <div className="mt-10 bg-white rounded-2xl shadow-[0_8px_32px_rgba(10,54,34,0.1)] p-6 lg:p-8 grid lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold mb-2.5">Destination</p>
                <div className="grid grid-cols-1 gap-2">
                  {rates.map((r) => (
                    <button
                      key={r.code}
                      onClick={() => setDest(r)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.99] ${
                        dest.code === r.code
                          ? "border-primary bg-primary/5 shadow-[0_2px_8px_rgba(10,54,34,0.08)]"
                          : "border-border hover:bg-muted/60"
                      }`}>
                      <span className="text-lg">{r.flag}</span>
                      <span className="flex-1">{r.name}</span>
                      <span className="text-xs text-muted-foreground">{r.days} days</span>
                      {dest.code === r.code && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-sm font-semibold">Parcel weight</p>
                  <span className="text-sm font-bold text-primary tabular-nums">{weight} kg</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={20}
                  step={0.5}
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="w-full accent-[#0A3622]"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>0.5 kg</span>
                  <span>20 kg</span>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 lg:p-8 flex flex-col">
              <p className="text-xs uppercase tracking-widest text-white/70">Estimated total</p>
              <p className="font-display text-5xl font-bold text-[#F6E05E] mt-2">£{subtotal.toFixed(2)}</p>
              <p className="text-sm text-white/70 mt-1">for {weight} kg to {dest.name.split("(")[0].trim()}</p>
              <div className="mt-6 space-y-2.5 text-sm border-t border-white/15 pt-5 flex-1">
                <div className="flex justify-between text-white/85">
                  <span>Shipping (£{dest.perKg.toFixed(2)}/kg + £{dest.handling.toFixed(2)} handling)</span>
                  <span className="font-semibold tabular-nums">£{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/85">
                  <span>Service fee</span>
                  <span className="font-semibold tabular-nums">£{serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/85">
                  <span>Customs duties</span>
                  <span className="font-semibold tabular-nums">calculated at checkout</span>
                </div>
              </div>
              <Link
                href="/add"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#F6E05E] text-primary px-6 py-3 font-bold hover:brightness-95 transition-all active:scale-[0.97]">
                Get a real-time quote <ChevronRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-white/50 mt-3">
                Indicative estimate only. Final price confirmed by instant quote.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST / COMPARISON ============ */}
      <section className="py-20 bg-muted/60">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Why GlobalCart</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary mt-2">
              Everything the old way got wrong — fixed.
            </h2>
          </div>
          <div className="mt-12 grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
              <p className="font-display font-bold text-red-700 flex items-center gap-2">
                <X className="w-5 h-5" /> Shopping the old way
              </p>
              <ul className="mt-4 space-y-3 text-sm text-foreground/80">
                <li className="flex gap-2.5"><X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> Send WhatsApp messages and wait hours for replies</li>
                <li className="flex gap-2.5"><X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> Hidden fees that appear only at delivery</li>
                <li className="flex gap-2.5"><X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> Manual tracking — you chase the status, not the other way around</li>
                <li className="flex gap-2.5"><X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> Retail packaging kept — paying to ship air</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl border-2 border-primary p-6 shadow-[0_8px_32px_rgba(10,54,34,0.1)] relative">
              <span className="absolute -top-3 left-6 rounded-full bg-[#F6E05E] text-primary text-[11px] font-bold px-3 py-1">
                WITH GLOBALCART
              </span>
              <p className="font-display font-bold text-primary flex items-center gap-2">
                <Check className="w-5 h-5" /> The new standard
              </p>
              <ul className="mt-4 space-y-3 text-sm text-foreground/80">
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> Paste a link, get an instant all-in quote</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> Duties estimated upfront, prepaid, nothing to pay on arrival</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> Live map tracking + WhatsApp pings at every checkpoint</li>
                <li className="flex gap-2.5"><Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> Free consolidation — parcels merged to cut shipping costs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GLOBAL REACH ============ */}
      <section className="py-20">
        <div className="container text-center">
          <img
            src={MAP_IMG}
            alt="GlobalCart ships from the UK and worldwide to customers across Africa"
            className="max-w-3xl w-full rounded-2xl mx-auto"
          />
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-primary mt-10 max-w-xl mx-auto">
            One UK address. Delivered across Africa — and growing.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
            US and EU warehouses are next on the map. Your account works everywhere.
          </p>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, #F6E05E 0%, transparent 45%), radial-gradient(circle at 85% 80%, #F6E05E 0%, transparent 40%)",
          }}
          aria-hidden
        />
        <div className="container relative text-center max-w-2xl">
          <Star className="w-10 h-10 text-[#F6E05E] mx-auto" />
          <h2 className="font-display text-3xl lg:text-4xl font-bold mt-4">
            Your first order is one link away
          </h2>
          <p className="text-white/75 mt-4">
            Sign up free, get your personal UK warehouse address instantly, and shop like a local.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/add"
              className="inline-flex items-center gap-2 rounded-full bg-[#F6E05E] text-primary px-8 py-4 text-base font-bold hover:brightness-95 transition-all active:scale-[0.97] shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
              Create free account <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-base font-semibold hover:bg-white/10 transition-all active:scale-[0.97]">
              <MessageCircle className="w-4 h-4" /> Chat with us
            </a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-[#072618] text-white/70 py-12">
        <div className="container grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={LOGO_IMG} alt="GlobalCart" className="w-9 h-9" />
              <span className="font-display font-bold text-xl text-white">
                Global<span className="text-[#F6E05E]">Cart</span>
              </span>
            </div>
            <p className="text-sm mt-4 leading-relaxed">
              Personal shopping and parcel forwarding from the UK to customers across Africa — with international standards.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white text-sm uppercase tracking-wide">Product</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li><Link href="/add" className="hover:text-[#F6E05E] transition-colors">Start shopping</Link></li>
              <li><Link href="/orders" className="hover:text-[#F6E05E] transition-colors">My orders</Link></li>
              <li><Link href="/tracking" className="hover:text-[#F6E05E] transition-colors">Track shipment</Link></li>
              <li><a href="#pricing" className="hover:text-[#F6E05E] transition-colors">Pricing calculator</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white text-sm uppercase tracking-wide">Company</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li><button onClick={() => toast("About page coming soon")} className="hover:text-[#F6E05E] transition-colors">About us</button></li>
              <li><button onClick={() => toast("Blog coming soon")} className="hover:text-[#F6E05E] transition-colors">Blog</button></li>
              <li><button onClick={() => toast("Careers coming soon")} className="hover:text-[#F6E05E] transition-colors">Careers</button></li>
              <li><button onClick={() => toast("Press coming soon")} className="hover:text-[#F6E05E] transition-colors">Press</button></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white text-sm uppercase tracking-wide">Support</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li><button onClick={() => toast("Help centre coming soon")} className="hover:text-[#F6E05E] transition-colors">Help centre</button></li>
              <li><button onClick={() => toast("Contact coming soon")} className="hover:text-[#F6E05E] transition-colors">Contact</button></li>
              <li><button onClick={() => toast("Privacy coming soon")} className="hover:text-[#F6E05E] transition-colors">Privacy policy</button></li>
              <li><button onClick={() => toast("Terms coming soon")} className="hover:text-[#F6E05E] transition-colors">Terms of service</button></li>
            </ul>
          </div>
        </div>
        <div className="container mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-3 text-xs">
          <p>© 2026 GlobalCart. All rights reserved.</p>
          <p>Prototype — pricing and availability are illustrative.</p>
        </div>
      </footer>
    </div>
  );
}
