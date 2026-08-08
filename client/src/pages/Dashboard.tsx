/* GlobalCart Dashboard — asymmetric grid per wireframe:
   3 summary cards + paste-link demo + recent orders + loyalty/referral widgets. */
import { useState } from "react";
import { Link } from "wouter";
import {
  MapPin,
  Package,
  Truck,
  ArrowRight,
  Copy,
  Sparkles,
  Gift,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { demoOrders, statusMeta } from "@/lib/demoData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const [link, setLink] = useState("");

  const recent = demoOrders.slice(0, 3);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      {/* Welcome row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Welcome back, Ada</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            You have 3 items in warehouse · 1 shipment in transit
          </p>
        </div>
        <Button asChild className="rounded-full px-5 active:scale-[0.97]">
          <Link href="/add">
            <Sparkles className="w-4 h-4" /> New Purchase
          </Link>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <MapPin className="w-4 h-4" /> My UK Address
          </div>
          <p className="mt-3 font-mono text-sm text-foreground/80 leading-relaxed">
            Ada E. · UNIT-7X2
            <br />
            12 Fulfillment Road, London N17 6AB
          </p>
          <button
            onClick={() => toast.success("Address copied — paste it at any store checkout")}
            className="mt-3 text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/70 flex items-center gap-1">
            <Copy className="w-3 h-3" /> Copy address
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Package className="w-4 h-4" /> In Warehouse
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">3 items · 12 kg</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting consolidation</p>
          <Button variant="outline" size="sm" asChild className="mt-3 rounded-full border-primary/40">
            <Link href="/orders">
              Consolidate <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Truck className="w-4 h-4" /> Active Shipment
          </div>
          <p className="mt-3 text-lg font-bold text-foreground">GC-48201 → Lagos</p>
          <p className="text-xs text-muted-foreground mt-1">EDD Jul 22 · DHL Express</p>
          <Button variant="outline" size="sm" asChild className="mt-3 rounded-full border-primary/40">
            <Link href="/tracking">
              Track on map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Paste-a-link demo */}
      <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-6 lg:p-8">
        <div className="absolute top-0 right-0 opacity-10 grid grid-cols-8 gap-3 p-4 select-none pointer-events-none" aria-hidden>
          {Array.from({ length: 32 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
          ))}
        </div>
        <div className="relative">
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#F6E05E]" /> Paste a link, get a quote
          </h2>
          <p className="text-sm text-primary-foreground/70 mt-1">
            Works on any supported UK store — see your all-in price instantly.
          </p>
          <form
            className="mt-4 flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (link.trim()) {
                toast.success("Opening quote flow — this is a prototype, demo result loads next");
              } else {
                toast.error("Paste a product URL first");
              }
            }}>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.nike.com/gb/t/air-max-90-shoe-…"
              className="h-11 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-[#F6E05E]"
            />
            <Button
              type="submit"
              className="h-11 rounded-full bg-[#F6E05E] text-primary font-semibold hover:brightness-95 active:scale-[0.97]">
              Get Instant Quote
            </Button>
          </form>
          <p className="text-xs text-primary-foreground/50 mt-3">
            Supported: Amazon UK · ASOS · Zara · Nike · Adidas · Boots · eBay UK · Next · and more
          </p>
        </div>
      </div>

      {/* Recent orders + widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <Link href="/orders" className="text-sm text-primary font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recent.map((o) => {
              const meta = statusMeta[o.status];
              return (
                <div key={o.id} className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="w-4.5 h-4.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {o.items[0].name}
                      {o.items.length > 1 && (
                        <span className="text-muted-foreground font-normal"> +{o.items.length - 1} more</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {o.store} · {o.updatedAt}
                    </p>
                  </div>
                  <span
                    className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.tint} ${meta.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                  <span className="text-sm font-semibold w-16 text-right">{o.total}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F6E05E]" /> Loyalty Points
            </h3>
            <p className="mt-2 text-2xl font-bold text-primary">2,840 pts</p>
            <p className="text-xs text-muted-foreground mt-1">
              160 pts to Standard tier — free consolidation included
            </p>
            <Progress value={88} className="mt-3 h-2" />
          </div>

          <div className="relative overflow-hidden bg-primary text-primary-foreground rounded-xl p-5">
            <Gift className="w-8 h-8 text-[#F6E05E] absolute -right-2 -bottom-2 opacity-25" />
            <p className="text-sm font-semibold text-[#F6E05E]">Refer a friend</p>
            <p className="text-xs text-primary-foreground/70 mt-1">
              Earn ₦3,000 per friend who completes their first order.
            </p>
            <Link
              href="/referrals"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-full px-3.5 py-1.5 transition-colors active:scale-[0.97]">
              Get your link <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
