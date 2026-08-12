/* GlobalCart Orders — real database orders for logged-in users, demo fallback. */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Package, Boxes, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import type { Order as DbOrder } from "../../../drizzle/schema";
import { statusMeta, type OrderStatus } from "@/lib/demoData";

type FilterId = "all" | "pending_purchase" | "purchased" | "in_warehouse" | "shipped" | "arrived" | "local_dispatch" | "delivered";

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending_purchase", label: "Pending purchase" },
  { id: "purchased", label: "Purchased" },
  { id: "in_warehouse", label: "In warehouse" },
  { id: "shipped", label: "Shipped" },
  { id: "arrived", label: "Arrived" },
  { id: "local_dispatch", label: "Local dispatch" },
  { id: "delivered", label: "Delivered" },
];

const STATUS_LABEL: Record<string, string> = {
  pending_purchase: "Awaiting purchase",
  purchased: "Purchased at store",
  in_warehouse: "At London warehouse",
  shipped: "Shipped by air freight",
  arrived: "Arrived in destination country",
  local_dispatch: "Out for local delivery",
  delivered: "Delivered",
};

function formatAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export default function Orders() {
  const [filter, setFilter] = useState<FilterId>("all");
  const { isAuthenticated } = useAuth();
  const { data: dbOrders, isLoading } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const orders = useMemo(() => {
    return (dbOrders ?? []).filter((o) => filter === "all" || o.status === filter);
  }, [filter, isAuthenticated, dbOrders]);

  const isReal = isAuthenticated && Boolean(dbOrders);

  return (
    <div className="p-4 lg:p-8 max-w-[1000px] mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? "Loading…" : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button asChild className="rounded-full active:scale-[0.97]">
          <Link href="/add">
            <Package className="w-4 h-4" /> Add Items
          </Link>
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors active:scale-[0.97] ${
              filter === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-white border border-border text-foreground/70 hover:bg-muted"
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Order cards */}
      <div className="space-y-3">
        {orders.length === 0 && (
          <p className="text-center text-sm text-muted-foreground bg-white rounded-xl border border-dashed py-10">
            {isAuthenticated
              ? "No orders match this filter yet. Add items on the Add Items page to create one."
              : "Sign in to view your purchase requests and shipment updates."}
          </p>
        )}
        {orders.map((o) => {
          const meta = statusMeta[o.status as OrderStatus] ?? statusMeta.pending_purchase;
          const order = o as DbOrder;
          const timeline = order.timeline ? (JSON.parse(order.timeline) as Array<{ at: string; status: string; note: string }>) : [];
          const last = timeline[timeline.length - 1];
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold">{order.store}</p>
                        <span className="text-xs text-muted-foreground font-mono">{order.ref}</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.tint} ${meta.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                      </div>
                    <p className="text-sm text-foreground/80 mt-1">{order.item}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Updated {last ? formatAt(last.at) : "recently"}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-primary">{order.amountGbp}</p>
                  <p className="text-xs text-muted-foreground">{order.amountLocal}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t flex flex-wrap items-center gap-2">
                {(order.status === "in_warehouse" || order.status === "purchased") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.success("Repack option: retail packaging removed — saves ~20% volumetric weight")}
                    className="rounded-full border-primary/40">
                    <Boxes className="w-3.5 h-3.5" /> Repack to save weight
                  </Button>
                )}
                {(order.status === "shipped" || order.status === "purchased") && (
                  <Button size="sm" variant="outline" asChild className="rounded-full border-primary/40">
                    <Link href={`/tracking?ref=${encodeURIComponent(order.ref)}`}>
                      <Truck className="w-3.5 h-3.5" /> Track shipment
                    </Link>
                  </Button>
                )}
                {order.status === "delivered" && (
                  <p className="text-xs text-muted-foreground">Delivered {last ? formatAt(last.at) : "recently"} — enjoy your items!</p>
                )}
                <span className="ml-auto text-xs text-muted-foreground">Destination: {order.destination}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
