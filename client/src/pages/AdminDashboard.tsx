/* UK Shoppers Africa — restricted operations queue for approved staff. */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { BellRing, Camera, CheckCircle2, Clock, ImagePlus, Megaphone, Package, Search, ShieldAlert, Sparkles, Truck, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const STATUS_OPTIONS = ["pending_purchase", "purchased", "in_warehouse", "shipped", "arrived", "local_dispatch", "delivered"] as const;
const STATUS_LABEL: Record<string, string> = {
  pending_purchase: "Awaiting purchase", purchased: "Purchased at store", in_warehouse: "At London warehouse",
  shipped: "Shipped by air freight", arrived: "Arrived / customs", local_dispatch: "Out for local delivery", delivered: "Delivered",
};

type QueueOrder = {
  id: number;
  ref: string;
  customerName: string | null;
  destination: string | null;
  store: string;
  item: string;
  amountGbp: string | null;
  requestType: string;
  screenshotKey: string | null;
  screenshotFileName: string | null;
  status: string;
  createdAt: Date;
};

type ScreenshotAlert = { id: number; title: string; body: string; createdAt: Date; read: "no" | "yes" };

function amount(value: string | null) {
  const parsed = Number.parseFloat(String(value ?? "0").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function nextStatus(status: string) {
  const index = STATUS_OPTIONS.indexOf(status as (typeof STATUS_OPTIONS)[number]);
  return index >= 0 ? STATUS_OPTIONS[index + 1] : undefined;
}

function alertTime(value: Date | string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Just now" : date.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();
  const isOperator = isAuthenticated && (user?.role === "staff" || user?.role === "admin");
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [alertsOpen, setAlertsOpen] = useState(false);
  const input = useMemo(() => ({ status: status === "all" ? undefined : status as (typeof STATUS_OPTIONS)[number], search: search.trim() || undefined, limit: 50 }), [search, status]);
  const queue = trpc.operations.queue.useQuery(input, { enabled: isOperator, retry: false, refetchInterval: isOperator ? 15000 : false });
  const screenshotAlertQuery = trpc.operations.screenshotAlerts.useQuery(undefined, { enabled: isOperator, retry: false, refetchInterval: isOperator ? 10000 : false });
  const markScreenshotAlertsRead = trpc.operations.markScreenshotAlertsRead.useMutation({
    onSuccess: () => { setAlertsOpen(false); void screenshotAlertQuery.refetch(); toast.success("Screenshot alerts marked as reviewed."); },
    onError: (error) => toast.error(error.message || "Could not update screenshot alerts."),
  });
  const mutation = trpc.operations.advanceStatus.useMutation({
    onSuccess: () => { void queue.refetch(); toast.success("Milestone recorded. The customer is notified in the portal and by email."); },
    onError: (error) => toast.error(error.message || "This order cannot be advanced from its current milestone."),
  });
  const screenshotAlerts = (screenshotAlertQuery.data ?? []) as ScreenshotAlert[];
  const orders = (queue.data ?? []) as QueueOrder[];
  const active = orders.filter((order) => order.status !== "delivered").length;
  const warehouse = orders.filter((order) => order.status === "in_warehouse").length;
  const delivered = orders.filter((order) => order.status === "delivered").length;

  const advance = (order: QueueOrder, next: string) => mutation.mutate({
    orderId: order.id, status: next,
    note: `Updated by ${user?.name ?? "operations staff"} from the secure operations queue.`,
  });

  return <div className="min-h-screen bg-[#F2F4F7] font-sans">
    <header className="sticky top-0 z-50 bg-[#111418] text-white shadow-md"><div className="container flex h-20 items-center justify-between gap-4 px-4 lg:px-8">
      <div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] font-bold text-lg text-[#111418]">EA</div><div className="min-w-0"><h1 className="truncate font-bold text-lg leading-none">UK Shoppers <span className="text-[#D4AF37]">Africa</span> — Operations Queue</h1><p className="mt-1 text-xs text-white/70">Restricted fulfilment workspace for approved staff</p></div></div>
      <div className="flex shrink-0 items-center gap-2">
        <Link href="/" className="hidden px-2 py-2 text-xs font-semibold text-[#D4AF37] hover:underline sm:inline">Public site</Link>
        {user?.role === "admin" && <Link href="/admin/invitations" className="hidden rounded-full bg-[#D4AF37] px-3 py-2 text-xs font-bold text-[#111418] hover:bg-[#f0cc54] sm:inline-flex"><UserPlus className="mr-1.5 h-3.5 w-3.5" />Invite staff</Link>}
        <Link href="/portal" className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20">Client portal</Link>
        <Link href="/admin/offers" className="hidden rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20 md:inline-flex"><Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#D4AF37]" />Offers</Link>
        <Link href="/admin/deals-advertising" className="hidden rounded-full bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20 lg:inline-flex"><Megaphone className="mr-1.5 h-3.5 w-3.5 text-[#D4AF37]" />Deals &amp; ads</Link>
        <div className="relative">
          <button type="button" aria-label={screenshotAlerts.length ? `${screenshotAlerts.length} new cart screenshot uploads` : "Cart screenshot notifications"} onClick={() => setAlertsOpen((open) => !open)} className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${screenshotAlerts.length ? "bg-[#D4AF37] text-[#111418]" : "bg-white/10 text-white hover:bg-white/20"}`}>
            <BellRing className="h-5 w-5" />
            {screenshotAlerts.length > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#111418]">{screenshotAlerts.length > 9 ? "9+" : screenshotAlerts.length}</span>}
          </button>
          {alertsOpen && <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-white text-foreground shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3"><div><p className="text-sm font-bold">Cart screenshot uploads</p><p className="text-xs text-muted-foreground">Shared staff alerts</p></div><button type="button" onClick={() => setAlertsOpen(false)} aria-label="Close notifications" className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button></div>
            {screenshotAlerts.length === 0 ? <div className="px-4 py-8 text-center"><CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600" /><p className="mt-2 text-sm font-semibold">You are all caught up</p><p className="mt-1 text-xs text-muted-foreground">New cart screenshots will appear here.</p></div> : <>
              <div className="max-h-64 divide-y divide-border overflow-y-auto">{screenshotAlerts.map((alert) => <div key={alert.id} className="flex gap-3 px-4 py-3"><div className="mt-0.5 rounded-lg bg-amber-100 p-2 text-amber-800"><ImagePlus className="h-4 w-4" /></div><div className="min-w-0"><p className="font-semibold text-xs">{alert.title}</p><p className="mt-1 text-xs leading-4 text-muted-foreground">{alert.body}</p><p className="mt-1 text-[11px] text-muted-foreground">{alertTime(alert.createdAt)}</p></div></div>)}</div>
              <div className="border-t border-border p-3"><button type="button" disabled={markScreenshotAlertsRead.isPending} onClick={() => markScreenshotAlertsRead.mutate()} className="w-full rounded-xl bg-[#111418] px-3 py-2 text-xs font-semibold text-white hover:bg-[#252a30] disabled:opacity-60">{markScreenshotAlertsRead.isPending ? "Updating…" : "Mark screenshot alerts as reviewed"}</button></div>
            </>}
          </div>}
        </div>
      </div>
    </div></header>
    <main className="container space-y-7 py-7">
      {!isOperator ? <section className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm"><ShieldAlert className="mx-auto mb-4 h-10 w-10 text-amber-600" /><h2 className="text-xl font-bold text-[#111418]">Staff access required</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">This queue contains limited customer fulfilment information and is available only to users assigned the <strong>staff</strong> or <strong>admin</strong> role.</p><Link href="/portal" className="mt-6 inline-flex rounded-xl bg-[#111418] px-4 py-2 text-sm font-semibold text-white">Return to your portal</Link></section> : <>
        {screenshotAlerts.length > 0 && <section className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className="rounded-xl bg-amber-200 p-2"><Camera className="h-5 w-5" /></div><div><p className="text-sm font-bold">{screenshotAlerts.length} new cart screenshot{screenshotAlerts.length === 1 ? "" : "s"} need review</p><p className="mt-1 text-xs text-amber-900/75">Open the request queue and prepare a manual quote for the customer.</p></div></div><button type="button" onClick={() => setAlertsOpen(true)} className="shrink-0 rounded-full bg-amber-900 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-950">Review alert{screenshotAlerts.length === 1 ? "" : "s"}</button></section>}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Metric icon={Package} label="Open orders" value={String(active)} detail="Visible in this filtered queue" /><Metric icon={Truck} label="London warehouse" value={String(warehouse)} detail="Awaiting onward air freight" accent="gold" /><Metric icon={CheckCircle2} label="Delivered" value={String(delivered)} detail="In this filtered queue" accent="green" /></section>
        <section className="space-y-5 rounded-3xl border border-border bg-white p-5 shadow-sm lg:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#A07C28]">Live database queue</p><h2 className="mt-1 text-xl font-bold text-[#111418]">Customer purchase requests and shipments</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">Search and status filters run on the server. Staff can only move an order one milestone forward; final delivery remains an administrator action.</p></div><label className="relative w-full md:w-72"><span className="sr-only">Search orders</span><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Order ID, customer, store..." className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#111418]" /></label></div>
          <div className="flex flex-wrap gap-2"><Button size="sm" variant={status === "all" ? "default" : "outline"} onClick={() => setStatus("all")}>All</Button>{STATUS_OPTIONS.map((item) => <Button key={item} size="sm" variant={status === item ? "default" : "outline"} onClick={() => setStatus(item)}>{STATUS_LABEL[item]}</Button>)}</div>
          {queue.isLoading ? <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4 animate-spin" /> Loading queue…</div> : orders.length === 0 ? <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center"><Package className="mx-auto h-9 w-9 text-[#A07C28]" /><h3 className="mt-3 font-semibold text-[#111418]">No matching orders</h3><p className="mt-1 text-sm text-muted-foreground">Adjust the search or filter, or wait for a customer to submit a purchase request.</p></div> : <div className="overflow-x-auto rounded-2xl border border-border"><table className="w-full min-w-[940px] border-collapse text-left text-sm"><thead className="bg-[#F7F7F4] text-xs font-bold uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer & destination</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Milestone</th><th className="px-4 py-3 text-right">Controlled action</th></tr></thead><tbody className="divide-y divide-border">{orders.map((order) => { const next = nextStatus(order.status); const canAdvance = Boolean(next) && !(user?.role === "staff" && next === "delivered"); const screenshot = order.requestType === "cart_screenshot"; return <tr key={order.id} className="hover:bg-muted/30"><td className="px-4 py-4"><div className="font-mono font-bold text-[#111418]">{order.ref}</div><div className="mt-1 text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div></td><td className="px-4 py-4"><div className="font-semibold">{order.customerName || "Customer"}</div><div className="text-xs text-muted-foreground">{order.destination || "Destination pending"}</div></td><td className="px-4 py-4"><div className="flex items-center gap-2"><div className="max-w-56 truncate font-medium">{order.item}</div>{screenshot && <span title="Cart screenshot request" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-900"><ImagePlus className="h-3 w-3" /> Screenshot</span>}</div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span>{order.store}</span>{screenshot && order.screenshotKey && <a href={`/manus-storage/${order.screenshotKey}`} target="_blank" rel="noreferrer" className="font-semibold text-[#A07C28] underline-offset-2 hover:underline">View upload</a>}</div></td><td className="px-4 py-4 font-bold">£{amount(order.amountGbp).toFixed(2)}</td><td className="px-4 py-4"><span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">{STATUS_LABEL[order.status] || order.status}</span></td><td className="px-4 py-4 text-right">{canAdvance && next ? <Button size="sm" disabled={mutation.isPending} onClick={() => advance(order, next)}>Advance to {STATUS_LABEL[next]}</Button> : <span className="text-xs font-medium text-muted-foreground">{order.status === "delivered" ? "Completed" : "Admin delivery confirmation required"}</span>}</td></tr>; })}</tbody></table></div>}
        </section>
      </>}
    </main>
  </div>;
}

function Metric({ icon: Icon, label, value, detail, accent = "ink" }: { icon: typeof Package; label: string; value: string; detail: string; accent?: "ink" | "gold" | "green" }) {
  const colors = { ink: "text-[#111418]", gold: "text-[#A07C28]", green: "text-emerald-700" };
  return <div className="rounded-2xl border border-border bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-sm font-medium text-muted-foreground"><span>{label}</span><Icon className={`h-5 w-5 ${colors[accent]}`} /></div><div className={`mt-2 text-3xl font-bold ${colors[accent]}`}>{value}</div><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}
