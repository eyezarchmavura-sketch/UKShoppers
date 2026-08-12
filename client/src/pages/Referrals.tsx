import { useState } from "react";
import { Gift, Copy, Check, MessageCircle, Users, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

/** Derive a deterministic, honest referral code from the user's real account id. */
function referralCodeFor(userId: string | number): string {
  return `UKS-${String(userId).toUpperCase().slice(0, 7)}`;
}

export default function Referrals() {
  const [copied, setCopied] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const code = user?.id ? referralCodeFor(user.id) : "UKS-AMINA7";
  const link = `${window.location.origin}/join/${code}`;

  const shareText = `Shop the UK and ship to East Africa with UK Shoppers Africa — use my code ${code} for £6.00 credit: ${link}`;

  const onCopy = () => {
    navigator.clipboard?.writeText(`${link} — Use my code ${code} for £6.00 UK shopping credit`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success("Link + code copied to clipboard");
  };

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Refer & Earn</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Earn £6.00 shipping credit for every friend who completes their first order to East Africa.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
          <LogIn className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-900">Sign in to activate your referral link</p>
            <p className="text-amber-800/80 mt-1">
              Your personal referral code is generated from your account. Sign in to see it and start earning.
            </p>
          </div>
          <Button onClick={() => startLogin()} className="shrink-0 rounded-full bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.97]">
            Sign in
          </Button>
        </div>
      )}

      {/* Share card */}
      <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-6 lg:p-8">
        <div className="absolute top-0 right-0 opacity-10 grid grid-cols-8 gap-3 p-4 select-none pointer-events-none" aria-hidden>
          {Array.from({ length: 32 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
          ))}
        </div>
        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <p className="font-display text-xl font-bold">Your referral link</p>
              <p className="text-xs text-primary-foreground/70">Share it anywhere — WhatsApp works best across East Africa.</p>
            </div>
          </div>
          <p className="font-mono text-sm bg-white/10 rounded-lg px-4 py-3 break-all">{link}</p>
          <p className="text-sm">
            Referral code: <span className="font-mono font-bold text-[#D4AF37]">{code}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onCopy}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition-colors active:scale-[0.97]">
              {copied ? <Check className="w-4 h-4 text-[#D4AF37]" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
            <a
              href={"https://wa.me/?text=" + encodeURIComponent(shareText)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] text-primary px-4 py-2 text-sm font-semibold hover:brightness-95 transition-all active:scale-[0.97]">
              <MessageCircle className="w-4 h-4" /> Share to WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Rewards meter */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Referral rewards
          </p>
          <p className="text-sm text-muted-foreground">£0.00 / £45.00</p>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-primary/10">
          <div className="h-full w-0 rounded-full bg-[#D4AF37]" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Reach £45 to unlock VIP tier — priority London warehouse packaging and 5% off every shipment.
        </p>
      </div>

      {/* Referred users */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <h2 className="font-semibold mb-3">Friends you've invited</h2>
        <div className="text-center py-8">
          <p className="text-sm font-medium text-foreground">No friends invited yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {isAuthenticated
              ? "Share your referral link above — friends who complete their first order earn you £6.00 in shipping credit."
              : "Sign in to share your personal referral link and track invitations."}
          </p>
        </div>
      </div>
    </div>
  );
}
