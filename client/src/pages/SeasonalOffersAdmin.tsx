import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, Clock3, Plus, ShieldAlert, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

type OfferStatus = "draft" | "upcoming" | "published" | "expired";
type ManagedOffer = {
  id: number;
  storeName: string;
  title: string;
  details: string;
  sourceType: "official_retailer" | "approved_partner" | "manual_verification" | null;
  sourceUrl: string | null;
  termsSummary: string | null;
  linkType: "direct" | "affiliate";
  offerUrl: string | null;
  couponCode: string | null;
  validFrom: Date | string | null;
  validUntil: Date | string | null;
  status: OfferStatus;
  verifiedAt: Date | string | null;
  updatedAt: Date | string;
};

const initialForm = {
  storeName: "", title: "", details: "", sourceType: "official_retailer" as const,
  sourceUrl: "", termsSummary: "", linkType: "direct" as const, offerUrl: "", couponCode: "",
  validFrom: "", validUntil: "", status: "draft" as OfferStatus,
};

function dateInputToEpoch(value: string, boundary: "start" | "end" = "end") {
  if (!value) return null;
  const timestamp = Date.parse(`${value}T${boundary === "start" ? "00:00:00" : "23:59:59"}Z`);
  return Number.isNaN(timestamp) ? null : timestamp;
}

function toDateInput(value: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function displayDate(value: Date | string | null, fallback = "Not supplied") {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function statusClasses(status: OfferStatus) {
  if (status === "published") return "bg-emerald-100 text-emerald-800";
  if (status === "upcoming") return "bg-sky-100 text-sky-800";
  if (status === "expired") return "bg-slate-100 text-slate-700";
  return "bg-amber-100 text-amber-900";
}

export default function SeasonalOffersAdmin() {
  const { isAuthenticated, user } = useAuth();
  const canManage = isAuthenticated && (user?.role === "staff" || user?.role === "admin");
  const [form, setForm] = useState(initialForm);
  const [activationEnds, setActivationEnds] = useState<Record<number, string>>({});
  const offersQuery = trpc.offers.listForOperations.useQuery(undefined, { enabled: canManage, retry: false });
  const utils = trpc.useUtils();
  const refresh = () => {
    void utils.offers.listForOperations.invalidate();
    void utils.offers.listPublic.invalidate();
  };
  const create = trpc.offers.create.useMutation({
    onSuccess: () => { setForm(initialForm); refresh(); toast.success("Campaign saved. Keep it private until the evidence is complete."); },
    onError: (error) => toast.error(error.message || "Could not save this campaign."),
  });
  const update = trpc.offers.update.useMutation({
    onSuccess: () => { refresh(); toast.success("Campaign visibility updated."); },
    onError: (error) => toast.error(error.message || "Could not update this campaign."),
  });
  const remove = trpc.offers.delete.useMutation({
    onSuccess: () => { refresh(); toast.success("Campaign removed from the register."); },
    onError: (error) => toast.error(error.message || "Could not remove this campaign."),
  });
  const offers = (offersQuery.data ?? []) as ManagedOffer[];
  const isPublicForm = form.status === "published" || form.status === "upcoming";

  const makeOfferInput = (offer: ManagedOffer, status: OfferStatus, validUntil = offer.validUntil ? new Date(offer.validUntil).getTime() : null) => ({
    storeName: offer.storeName,
    title: offer.title,
    details: offer.details,
    status,
    sourceType: offer.sourceType,
    sourceUrl: offer.sourceUrl,
    termsSummary: offer.termsSummary,
    linkType: offer.linkType,
    offerUrl: offer.offerUrl,
    couponCode: offer.couponCode,
    validFrom: offer.validFrom ? new Date(offer.validFrom).getTime() : null,
    validUntil,
  });

  const setStatus = (offer: ManagedOffer, status: OfferStatus) => update.mutate({ id: offer.id, offer: makeOfferInput(offer, status) });

  const activateUpcoming = (offer: ManagedOffer) => {
    const endDate = activationEnds[offer.id] || toDateInput(offer.validUntil);
    const validUntil = dateInputToEpoch(endDate);
    if (!validUntil) {
      toast.error("Enter the retailer-confirmed end date before making this campaign live.");
      return;
    }
    update.mutate({ id: offer.id, offer: makeOfferInput(offer, "published", validUntil) });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    create.mutate({
      storeName: form.storeName.trim(),
      title: form.title.trim(),
      details: form.details.trim(),
      status: form.status,
      sourceType: form.sourceType,
      sourceUrl: form.sourceUrl.trim() || null,
      termsSummary: form.termsSummary.trim() || null,
      linkType: form.linkType,
      offerUrl: form.offerUrl.trim() || null,
      couponCode: form.couponCode.trim() || null,
      validFrom: dateInputToEpoch(form.validFrom, "start"),
      validUntil: dateInputToEpoch(form.validUntil),
    });
  };

  if (!canManage) {
    return <main className="min-h-screen bg-[#F2F4F7] px-4 py-16"><section className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm"><ShieldAlert className="mx-auto h-10 w-10 text-amber-600" /><h1 className="mt-4 text-xl font-bold text-[#111418]">Staff access required</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Only approved operations staff can create or publish public seasonal offers.</p><Link href="/admin" className="mt-6 inline-flex rounded-xl bg-[#111418] px-4 py-2 text-sm font-semibold text-white">Return to operations</Link></section></main>;
  }

  return <main className="min-h-screen bg-[#F2F4F7] py-7"><div className="container max-w-6xl space-y-7">
    <header className="flex flex-col justify-between gap-4 rounded-3xl bg-[#111418] p-6 text-white shadow-lg sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D4AF37]">Operations content control</p><h1 className="mt-1 text-2xl font-bold">Verified seasonal offers</h1><p className="mt-2 max-w-2xl text-sm text-white/70">Announce a coming campaign only when its official source, terms and future start date are confirmed. Never estimate a discount, code or launch date.</p></div><Link href="/admin" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">Back to queue</Link></header>

    <section className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr]">
      <form onSubmit={submit} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3"><div className="rounded-xl bg-[#C9A227]/15 p-2 text-[#A67C00]"><Plus className="h-5 w-5" /></div><div><h2 className="font-bold text-[#111418]">Add retailer campaign</h2><p className="text-xs text-muted-foreground">A draft is private. Public campaign records must include evidence, terms and the relevant confirmed date.</p></div></div>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">UK retailer<input required value={form.storeName} onChange={(event) => setForm({ ...form, storeName: event.target.value })} placeholder="e.g. ASOS" className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label>
          <label className="block text-sm font-semibold">Campaign headline<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Use the retailer's own campaign title" className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label>
          <label className="block text-sm font-semibold">Verified details<textarea required value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} placeholder="State only the terms customers need to know." className="mt-1.5 min-h-28 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Evidence source<select value={form.sourceType} onChange={(event) => setForm({ ...form, sourceType: event.target.value as typeof form.sourceType })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]"><option value="official_retailer">Official retailer</option><option value="approved_partner">Approved partner feed</option><option value="manual_verification">Manual verification</option></select></label><label className="block text-sm font-semibold">Evidence URL<input type="url" required={isPublicForm} value={form.sourceUrl} onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })} placeholder="Official source or partner record" className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label></div>
          <label className="block text-sm font-semibold">Customer-facing terms summary<textarea required={isPublicForm} value={form.termsSummary} onChange={(event) => setForm({ ...form, termsSummary: event.target.value })} placeholder="Eligibility, exclusions and stock or end-date conditions." className="mt-1.5 min-h-20 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Customer destination URL<input type="url" required={isPublicForm} value={form.offerUrl} onChange={(event) => setForm({ ...form, offerUrl: event.target.value })} placeholder="https://…" className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label><label className="block text-sm font-semibold">Link disclosure<select value={form.linkType} onChange={(event) => setForm({ ...form, linkType: event.target.value as typeof form.linkType })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]"><option value="direct">Direct retailer link</option><option value="affiliate">Partner / affiliate link</option></select></label></div>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Confirmed starts<input required={form.status === "upcoming"} type="date" value={form.validFrom} onChange={(event) => setForm({ ...form, validFrom: event.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label><label className="block text-sm font-semibold">Confirmed ends<input required={form.status === "published"} type="date" value={form.validUntil} onChange={(event) => setForm({ ...form, validUntil: event.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label></div>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Public code, if verified<input value={form.couponCode} onChange={(event) => setForm({ ...form, couponCode: event.target.value })} placeholder="Optional" className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]" /></label><label className="block text-sm font-semibold">Visibility<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as OfferStatus })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C9A227]"><option value="draft">Draft — private</option><option value="upcoming">Upcoming — public, confirmed start</option><option value="published">Live — public, confirmed end</option><option value="expired">Expired — private</option></select></label></div>
        </div>
        <Button type="submit" disabled={create.isPending} className="mt-6 w-full bg-[#111418] text-[#D4AF37] hover:bg-black">{create.isPending ? "Saving…" : "Save retailer campaign"}</Button>
      </form>

      <div className="space-y-5">
        <section className="rounded-3xl border border-[#C9A227]/35 bg-[#FFFCF0] p-6 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2 text-[#8A6500]"><CheckCircle2 className="h-4 w-4" /><p className="text-[11px] font-bold uppercase tracking-[0.13em]">Daily publication gate</p></div><h2 className="mt-2 font-bold text-[#111418]">Women-first Verified Store Desk</h2><p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">Review official retailer sources first. To announce a campaign before it opens, capture its confirmed future start date as well as source, terms and customer destination.</p></div><div className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#7D5A00] ring-1 ring-[#C9A227]/25"><Clock3 className="h-3.5 w-3.5" />Six or fewer live cards</div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-white/80 p-4"><p className="text-xs font-bold text-[#111418]">Morning priority</p><p className="mt-1 text-xs leading-5 text-muted-foreground">ASOS, LOOKFANTASTIC, Boots, and Superdrug. Review Zara, Next, and M&amp;S three times each week.</p></div><div className="rounded-2xl bg-white/80 p-4"><p className="text-xs font-bold text-[#111418]">Remove, don’t guess</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Unpublish immediately if a source changes, an offer expires, terms are unclear, or a customer reports a mismatch.</p></div></div></section>

        <section className="rounded-3xl border border-border bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><div><h2 className="font-bold text-[#111418]">Campaign register</h2><p className="mt-1 text-xs text-muted-foreground">Upcoming cards require confirmed starts; live cards require confirmed ends. Both require customer-visible evidence and terms.</p></div><div className="rounded-full bg-[#C9A227]/15 px-3 py-1 text-xs font-bold text-[#7D5A00]">{offers.length} saved</div></div>{offersQuery.isLoading ? <div className="py-16 text-center text-sm text-muted-foreground">Loading campaign register…</div> : offers.length === 0 ? <div className="py-16 text-center"><Sparkles className="mx-auto h-8 w-8 text-[#A67C00]" /><h3 className="mt-3 font-bold text-[#111418]">No campaigns saved yet</h3><p className="mt-1 text-sm text-muted-foreground">The homepage will present an honest planning state until the first campaign is source-confirmed.</p></div> : <div className="mt-5 space-y-3">{offers.map((offer) => <article key={offer.id} className="rounded-2xl border border-border p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A67C00]">{offer.storeName}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClasses(offer.status)}`}>{offer.status}</span></div><h3 className="mt-1 font-bold text-[#111418]">{offer.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{offer.details}</p><p className="mt-2 text-[11px] text-muted-foreground">Source: {offer.sourceType ? offer.sourceType.replace(/_/g, " ") : "not supplied"} · checked {offer.verifiedAt ? displayDate(offer.verifiedAt) : "not yet"}</p><p className="mt-1 text-[11px] text-muted-foreground">Starts: {displayDate(offer.validFrom, "not recorded")} · Ends: {displayDate(offer.validUntil, "not recorded")}</p></div><div className="flex max-w-xs flex-wrap gap-2">{offer.status === "draft" ? <><button type="button" disabled={update.isPending} onClick={() => setStatus(offer, "upcoming")} className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-[#111418] hover:border-[#C9A227]">Announce upcoming</button><button type="button" disabled={update.isPending} onClick={() => setStatus(offer, "published")} className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-[#111418] hover:border-[#C9A227]">Publish live</button></> : null}{offer.status === "upcoming" ? <><input aria-label={`Confirmed end date for ${offer.title}`} type="date" value={activationEnds[offer.id] ?? toDateInput(offer.validUntil)} onChange={(event) => setActivationEnds({ ...activationEnds, [offer.id]: event.target.value })} className="h-8 rounded-full border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-[#C9A227]" /><button type="button" disabled={update.isPending} onClick={() => activateUpcoming(offer)} className="rounded-full border border-[#C9A227] px-3 py-1.5 text-xs font-bold text-[#7D5A00] hover:bg-[#FFFCF0]">Go live</button><button type="button" disabled={update.isPending} onClick={() => setStatus(offer, "draft")} className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-[#111418] hover:border-[#C9A227]">Return to draft</button></> : null}{offer.status === "published" ? <button type="button" disabled={update.isPending} onClick={() => setStatus(offer, "draft")} className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-[#111418] hover:border-[#C9A227]">Unpublish</button> : null}<button type="button" disabled={update.isPending} onClick={() => setStatus(offer, "expired")} className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-[#111418] hover:border-[#C9A227]">Expire</button>{user?.role === "admin" ? <button type="button" aria-label={`Delete ${offer.title}`} disabled={remove.isPending} onClick={() => remove.mutate({ id: offer.id })} className="rounded-full border border-red-200 p-1.5 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button> : null}</div></div></article>)}</div>}</section>
      </div>
    </section>
  </div></main>;
}
