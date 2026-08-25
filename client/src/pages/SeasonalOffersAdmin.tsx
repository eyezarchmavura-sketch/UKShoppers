import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, Plus, ShieldAlert, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

type OfferStatus = "draft" | "published" | "expired";
type ManagedOffer = {
  id: number;
  storeName: string;
  title: string;
  details: string;
  offerUrl: string | null;
  couponCode: string | null;
  validFrom: Date | string | null;
  validUntil: Date | string | null;
  status: OfferStatus;
  updatedAt: Date | string;
};

const initialForm = { storeName: "", title: "", details: "", offerUrl: "", couponCode: "", validUntil: "", status: "draft" as OfferStatus };

function dateInputToEpoch(value: string) {
  if (!value) return null;
  const timestamp = Date.parse(`${value}T23:59:59Z`);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function displayDate(value: Date | string | null) {
  if (!value) return "No end date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "No end date" : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function SeasonalOffersAdmin() {
  const { isAuthenticated, user } = useAuth();
  const canManage = isAuthenticated && (user?.role === "staff" || user?.role === "admin");
  const [form, setForm] = useState(initialForm);
  const offersQuery = trpc.offers.listForOperations.useQuery(undefined, { enabled: canManage, retry: false });
  const utils = trpc.useUtils();
  const refresh = () => void utils.offers.listForOperations.invalidate();
  const create = trpc.offers.create.useMutation({ onSuccess: () => { setForm(initialForm); refresh(); toast.success("Offer saved. Publish it only after verifying the retailer terms."); }, onError: (error) => toast.error(error.message || "Could not save this offer.") });
  const update = trpc.offers.update.useMutation({ onSuccess: () => { refresh(); toast.success("Offer status updated."); }, onError: (error) => toast.error(error.message || "Could not update this offer.") });
  const remove = trpc.offers.delete.useMutation({ onSuccess: () => { refresh(); toast.success("Offer removed from the register."); }, onError: (error) => toast.error(error.message || "Could not remove this offer.") });
  const offers = (offersQuery.data ?? []) as ManagedOffer[];

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    create.mutate({
      storeName: form.storeName.trim(), title: form.title.trim(), details: form.details.trim(), status: form.status,
      offerUrl: form.offerUrl.trim() || null, couponCode: form.couponCode.trim() || null,
      validUntil: dateInputToEpoch(form.validUntil), validFrom: null,
    });
  };

  const setStatus = (offer: ManagedOffer, status: OfferStatus) => update.mutate({
    id: offer.id,
    offer: {
      storeName: offer.storeName, title: offer.title, details: offer.details, status,
      offerUrl: offer.offerUrl, couponCode: offer.couponCode,
      validFrom: offer.validFrom ? new Date(offer.validFrom).getTime() : null,
      validUntil: offer.validUntil ? new Date(offer.validUntil).getTime() : null,
    },
  });

  if (!canManage) return <main className="min-h-screen bg-[#F2F4F7] px-4 py-16"><section className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm"><ShieldAlert className="mx-auto h-10 w-10 text-amber-600" /><h1 className="mt-4 text-xl font-bold text-[#111418]">Staff access required</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Only approved operations staff can create or publish public seasonal offers.</p><Link href="/admin" className="mt-6 inline-flex rounded-xl bg-[#111418] px-4 py-2 text-sm font-semibold text-white">Return to operations</Link></section></main>;

  return <main className="min-h-screen bg-[#F2F4F7] py-7"><div className="container max-w-6xl space-y-7"><header className="flex flex-col justify-between gap-4 rounded-3xl bg-[#111418] p-6 text-white shadow-lg sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D4AF37]">Operations content control</p><h1 className="mt-1 text-2xl font-bold">Verified seasonal offers</h1><p className="mt-2 max-w-2xl text-sm text-white/70">Publish only promotions confirmed from the retailer’s official page. No estimates, expired offers, or unverified codes.</p></div><Link href="/admin" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">Back to queue</Link></header>

    <section className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr]"><form onSubmit={submit} className="rounded-3xl border border-border bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div className="rounded-xl bg-[#C9A227]/15 p-2 text-[#A67C00]"><Plus className="h-5 w-5" /></div><div><h2 className="font-bold text-[#111418]">Add verified offer</h2><p className="text-xs text-muted-foreground">Drafts remain private until you publish them.</p></div></div><div className="mt-6 space-y-4"><label className="block text-sm font-semibold">UK retailer<input required value={form.storeName} onChange={(event) => setForm({ ...form, storeName: event.target.value })} placeholder="e.g. ASOS" className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label><label className="block text-sm font-semibold">Offer headline<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Use the retailer's own promotion title" className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label><label className="block text-sm font-semibold">Verified details<textarea required value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} placeholder="State the terms customers need to know; do not add claims you cannot verify." className="mt-1.5 min-h-28 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Official offer URL<input type="url" value={form.offerUrl} onChange={(event) => setForm({ ...form, offerUrl: event.target.value })} placeholder="https://…" className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label><label className="block text-sm font-semibold">Public code, if verified<input value={form.couponCode} onChange={(event) => setForm({ ...form, couponCode: event.target.value })} placeholder="Optional" className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Valid until<input type="date" value={form.validUntil} onChange={(event) => setForm({ ...form, validUntil: event.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label><label className="block text-sm font-semibold">Visibility<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as OfferStatus })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]"><option value="draft">Draft — private</option><option value="published">Published — public</option><option value="expired">Expired — private</option></select></label></div></div><Button type="submit" disabled={create.isPending} className="mt-6 w-full bg-[#111418] text-[#D4AF37] hover:bg-black">{create.isPending ? "Saving…" : "Save verified offer"}</Button></form>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><div><h2 className="font-bold text-[#111418]">Offer register</h2><p className="mt-1 text-xs text-muted-foreground">Published offers are visible on the hero section. Expired and draft offers stay private.</p></div><div className="rounded-full bg-[#C9A227]/15 px-3 py-1 text-xs font-bold text-[#7D5A00]">{offers.length} saved</div></div>{offersQuery.isLoading ? <div className="py-16 text-center text-sm text-muted-foreground">Loading offer register…</div> : offers.length === 0 ? <div className="py-16 text-center"><Sparkles className="mx-auto h-8 w-8 text-[#A67C00]" /><h3 className="mt-3 font-bold text-[#111418]">No offers saved yet</h3><p className="mt-1 text-sm text-muted-foreground">The public site will show an honest empty state until a verified offer is published.</p></div> : <div className="mt-5 space-y-3">{offers.map((offer) => <article key={offer.id} className="rounded-2xl border border-border p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A67C00]">{offer.storeName}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${offer.status === "published" ? "bg-emerald-100 text-emerald-800" : offer.status === "expired" ? "bg-slate-100 text-slate-700" : "bg-amber-100 text-amber-900"}`}>{offer.status}</span></div><h3 className="mt-1 font-bold text-[#111418]">{offer.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{offer.details}</p><p className="mt-2 text-[11px] text-muted-foreground">Valid until: {displayDate(offer.validUntil)}</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={update.isPending} onClick={() => setStatus(offer, offer.status === "published" ? "draft" : "published")} className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-[#111418] hover:border-[#C9A227]">{offer.status === "published" ? "Unpublish" : "Publish"}</button><button type="button" disabled={update.isPending} onClick={() => setStatus(offer, "expired")} className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-[#111418] hover:border-[#C9A227]">Expire</button>{user?.role === "admin" && <button type="button" aria-label={`Delete ${offer.title}`} disabled={remove.isPending} onClick={() => remove.mutate({ id: offer.id })} className="rounded-full border border-red-200 p-1.5 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>}</div></div></article>)}</div>}</section></section>
  </div></main>;
}
