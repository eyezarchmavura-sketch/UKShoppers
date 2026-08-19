import { type FormEvent, useState } from "react";
import { Link } from "wouter";
import { Ban, CheckCircle2, Copy, Link2, LoaderCircle, ShieldAlert, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

type StaffInvite = {
  id: number;
  name: string;
  email: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  revokedAt: Date | null;
};

function statusForInvite(invite: StaffInvite) {
  if (invite.revokedAt) return "Revoked";
  if (new Date(invite.expiresAt).getTime() <= Date.now()) return "Expired";
  if (invite.acceptedAt) return "Active";
  return "Awaiting acceptance";
}

export default function ExternalStaffInvites() {
  const { isAuthenticated, user } = useAuth({ redirectOnUnauthenticated: false });
  const isAdmin = isAuthenticated && user?.role === "admin";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  const invitations = trpc.externalStaffInvites.list.useQuery(undefined, { enabled: isAdmin, retry: false });
  const create = trpc.externalStaffInvites.create.useMutation({
    onSuccess: result => {
      setCreatedUrl(`${window.location.origin}/api/external-staff/accept/${result.token}`);
      setName("");
      setEmail("");
      void invitations.refetch();
      toast.success(`A 72-hour staff invitation was created for ${result.name}.`);
    },
    onError: error => toast.error(error.message || "The staff invitation could not be created."),
  });
  const revoke = trpc.externalStaffInvites.revoke.useMutation({
    onSuccess: () => {
      void invitations.refetch();
      toast.success("The staff invitation was revoked immediately.");
    },
    onError: error => toast.error(error.message || "The staff invitation could not be revoked."),
  });

  const createInvitation = (event: FormEvent) => {
    event.preventDefault();
    create.mutate({ name: name.trim(), email: email.trim().toLowerCase() });
  };

  const copyUrl = async () => {
    if (!createdUrl) return;
    try {
      await navigator.clipboard.writeText(createdUrl);
      toast.success("Invitation link copied. Send it only to the intended staff member.");
    } catch {
      toast.error("Copy failed. Select and copy the link manually.");
    }
  };

  if (!isAdmin) {
    return <main className="min-h-screen bg-[#F2F4F7] px-4 py-20 font-sans"><section className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm"><ShieldAlert className="mx-auto h-10 w-10 text-amber-600" /><h1 className="mt-4 text-xl font-bold text-[#111418]">Administrator access required</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Only the platform owner can create, copy, or revoke external staff invitations. Staff invitations never grant this access.</p><Link href="/admin" className="mt-6 inline-flex rounded-xl bg-[#111418] px-4 py-2 text-sm font-semibold text-white">Return to operations</Link></section></main>;
  }

  const rows = (invitations.data ?? []) as StaffInvite[];
  return <main className="min-h-screen bg-[#F2F4F7] font-sans"><header className="bg-[#111418] text-white"><div className="container flex min-h-20 items-center justify-between gap-4 px-4 py-4 lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D4AF37]">Owner-only access control</p><h1 className="mt-1 text-xl font-bold">External staff invitations</h1></div><Link href="/admin" className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20">Return to operations</Link></div></header><div className="container max-w-5xl space-y-6 py-8">
    <section className="rounded-3xl border border-[#D4AF37]/45 bg-[#fffdf5] p-5 shadow-sm lg:p-7"><div className="flex flex-col justify-between gap-3 md:flex-row md:items-start"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#A07C28]">Secure, browser-based access</p><h2 className="mt-1 flex items-center gap-2 text-2xl font-bold text-[#111418]"><UserPlus className="h-6 w-6 text-[#A07C28]" />Create a staff-only invitation</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Give an approved colleague a 72-hour link they can open in any browser. It allows order operations only, with no global settings, administrator management, or owner controls.</p></div><span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#111418] px-3 py-1.5 text-[11px] font-bold text-[#f7d66a]"><ShieldAlert className="h-3.5 w-3.5" /> Least-privilege staff access</span></div>
      <form onSubmit={createInvitation} className="mt-6 grid gap-4 md:grid-cols-[1fr_1.25fr_auto] md:items-end"><label className="block text-sm font-semibold text-[#111418]">Staff member’s name<input value={name} onChange={event => setName(event.target.value)} required minLength={2} maxLength={160} placeholder="e.g. Operations Manager" className="mt-2 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#A07C28]" /></label><label className="block text-sm font-semibold text-[#111418]">Staff member’s email<input value={email} onChange={event => setEmail(event.target.value)} required type="email" maxLength={320} placeholder="name@company.com" className="mt-2 w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#A07C28]" /></label><Button type="submit" disabled={create.isPending} className="h-10 bg-[#111418] px-5 hover:bg-[#252a30]"><Link2 className="mr-2 h-4 w-4" />{create.isPending ? "Creating…" : "Create 72-hour link"}</Button></form>
      {createdUrl && <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="flex items-center gap-2 text-sm font-bold text-emerald-950"><CheckCircle2 className="h-4 w-4" />Invitation ready — copy it before leaving this screen</p><p className="mt-2 break-all font-mono text-xs leading-5 text-emerald-900">{createdUrl}</p><p className="mt-2 text-xs leading-5 text-emerald-800">The raw access token is not stored in the database. You can revoke the invitation immediately below.</p></div><Button type="button" onClick={copyUrl} variant="outline" className="shrink-0 border-emerald-400 bg-white text-emerald-900 hover:bg-emerald-100"><Copy className="mr-2 h-4 w-4" />Copy link</Button></div></div>}
    </section>
    <section className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm"><div className="border-b border-border px-5 py-5 lg:px-7"><h2 className="text-lg font-bold text-[#111418]">Invitation register</h2><p className="mt-1 text-sm text-muted-foreground">Revoking a link immediately removes its staff access, including active sessions.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-[#F7F7F4] text-xs font-bold uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-3">Staff member</th><th className="px-5 py-3">Access status</th><th className="px-5 py-3">Expires</th><th className="px-5 py-3 text-right">Control</th></tr></thead><tbody className="divide-y divide-border">{invitations.isLoading ? <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground"><LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />Loading invitation register…</td></tr> : rows.length === 0 ? <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">No external staff invitations have been created.</td></tr> : rows.map(invite => { const state = statusForInvite(invite); const active = state === "Active" || state === "Awaiting acceptance"; return <tr key={invite.id}><td className="px-5 py-4"><p className="font-semibold text-[#111418]">{invite.name}</p><p className="mt-1 text-xs text-muted-foreground">{invite.email}</p></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${state === "Active" ? "bg-emerald-100 text-emerald-800" : state === "Awaiting acceptance" ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-600"}`}>{state}</span></td><td className="px-5 py-4 text-xs text-muted-foreground">{new Date(invite.expiresAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td><td className="px-5 py-4 text-right">{active ? <Button type="button" size="sm" variant="outline" disabled={revoke.isPending} onClick={() => revoke.mutate({ id: invite.id })} className="border-red-200 text-red-700 hover:bg-red-50"><Ban className="mr-1.5 h-3.5 w-3.5" />Revoke</Button> : <span className="text-xs text-muted-foreground">—</span>}</td></tr>; })}</tbody></table></div></section>
  </div></main>;
}
