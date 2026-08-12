import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ORDER_STATUS_LABELS } from "@shared/orderStatus";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const [link, setLink] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { data: dbOrders } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const recent = (dbOrders ?? []).slice(0, 3);

  const firstName = user?.name
    ? String(user.name).split(" ")[0]
    : isAuthenticated
      ? "there"
      : "there";
  const warehouseOrders = (dbOrders ?? []).filter((order) =>
    ["purchased", "in_warehouse"].includes(order.status),
  );
  const shippedOrder = (dbOrders ?? []).find((order) => order.status === "shipped");

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      {/* Welcome row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Welcome back, {firstName}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAuthenticated
              ? `${dbOrders?.length ?? 0} order${(dbOrders?.length ?? 0) === 1 ? "" : "s"} in your account — track every step to your doorstep.`
              : "Sign in to create purchase requests and follow every shipment to your doorstep."}
          </p>
        </div>
        <Button asChild className="rounded-full px-5 active:scale-[0.97]">
          <Link href="/add">
            <Sparkles className="w-4 h-4" /> New Purchase Request
          </Link>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <MapPin className="w-4 h-4" /> My UK Warehouse Address
          </div>
          <p className="mt-3 font-mono text-sm text-foreground/80 leading-relaxed">
            {user?.name
              ? `${String(user.name).split(" ")[0][0]?.toUpperCase() ?? ""}${String(user.name).split(" ")[1]?.[0]?.toUpperCase() ?? ""} · UKSA-${user.id}`
              : "Your name · Your UKSA account code"}
            <br />
            12 Heathrow Cargo Way, London TW6 2GE
          </p>
          <button
            onClick={() => toast.success("Address copied — paste it at any UK store checkout")}
            className="mt-3 text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/70 flex items-center gap-1">
            <Copy className="w-3 h-3" /> Copy address
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Package className="w-4 h-4" /> In London Warehouse
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {warehouseOrders.length} order{warehouseOrders.length === 1 ? "" : "s"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {warehouseOrders.length > 0 ? "Awaiting consolidation or shipment" : "No purchases are at the warehouse yet"}
          </p>
          <Button variant="outline" size="sm" asChild className="mt-3 rounded-full border-primary/40">
            <Link href="/orders">
              Consolidate <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Truck className="w-4 h-4" /> Active Air Shipment
          </div>
          <p className="mt-3 text-lg font-bold text-foreground">
            {shippedOrder ? `${shippedOrder.ref} → ${shippedOrder.destination}` : "No active air shipment"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {shippedOrder ? "Express Air Cargo · EDD shown per shipment" : "Create a purchase request to start your delivery journey"}
          </p>
          {shippedOrder ? (
            <Button variant="outline" size="sm" asChild className="mt-3 rounded-full border-primary/40">
              <Link href={`/tracking?ref=${encodeURIComponent(shippedOrder.ref)}`}>
                Track on map <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild className="mt-3 rounded-full border-primary/40">
              <Link href="/add">Add Items <ArrowRight className="w-3.5 h-3.5" /></Link>
            </Button>
          )}
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
            <Zap className="w-5 h-5 text-[#D4AF37]" /> Paste a link, get an instant quote
          </h2>
          <p className="text-sm text-primary-foreground/70 mt-1">
            Works on Amazon UK, ASOS, Zara, Next, and all UK retail stores.
          </p>
          <form
            className="mt-4 flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (link.trim()) {
                toast.success("Opening quote flow — demo item loaded");
              } else {
                toast.error("Paste a product URL first");
              }
            }}>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.amazon.co.uk/dp/..."
              className="h-11 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-[#D4AF37]"
            />
            <Button
              type="submit"
              className="h-11 rounded-full bg-[#D4AF37] text-primary font-semibold hover:brightness-95 active:scale-[0.97]">
              Get Instant Quote
            </Button>
          </form>
          <p className="text-xs text-primary-foreground/50 mt-3">
            Supported: Amazon UK · ASOS · Zara · Next · John Lewis · Boots · eBay UK · Sports Direct
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
            {recent.length === 0 ? (
              <div className="py-8 text-center">
                <Package className="w-8 h-8 mx-auto text-muted-foreground/50" />
                <p className="mt-2 text-sm font-medium">Your purchase requests will appear here</p>
                <p className="mt-1 text-xs text-muted-foreground">Add a UK store item when you are ready to shop.</p>
              </div>
            ) : recent.map((ro) => {
                const amount =
                  typeof ro.amountGbp === "number"
                    ? ro.amountGbp
                    : parseFloat(String(ro.amountGbp ?? "0").replace(/[^0-9.\-]/g, "")) || 0;
                return (
                  <div key={ro.id} className="flex items-center gap-3 py-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Package className="w-4.5 h-4.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ro.item}</p>
                      <p className="text-xs text-muted-foreground">
                        {ro.store} · {new Date(ro.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {ORDER_STATUS_LABELS[ro.status] ?? ro.status}
                    </span>
                    <span className="text-sm font-semibold w-20 text-right">£{Number(amount).toFixed(2)}</span>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" /> Loyalty Points
            </h3>
            <p className="mt-2 text-2xl font-bold text-primary">2,840 pts</p>
            <p className="text-xs text-muted-foreground mt-1">
              160 pts to Gold Tier — free UK warehouse storage included
            </p>
            <Progress value={88} className="mt-3 h-2" />
          </div>

          <div className="relative overflow-hidden bg-primary text-primary-foreground rounded-xl p-5">
            <Gift className="w-8 h-8 text-[#D4AF37] absolute -right-2 -bottom-2 opacity-25" />
            <p className="text-sm font-semibold text-[#D4AF37]">Refer a friend</p>
            <p className="text-xs text-primary-foreground/70 mt-1">
              Earn £6.00 credit for every friend who completes their first order to East Africa.
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
