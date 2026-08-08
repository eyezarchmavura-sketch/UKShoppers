/* GlobalCart Referrals — link, share-to-WhatsApp, rewards meter, referred users per wireframe 2.7. */
import { useState } from "react";
import { Gift, Copy, Check, MessageCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { demoReferred } from "@/lib/demoData";

export default function Referrals() {
  const [copied, setCopied] = useState(false);
  const code = "GCL-ADA7X";
  const link = `https://globalcart.com/join/${code}`;
  const earned = 6000;
  const goal = 15000;

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Refer & Earn</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Earn ₦3,000 shipping credit for every friend who completes their first order.
        </p>
      </div>

      {/* Share card */}
      <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-6 lg:p-8">
        <div className="absolute top-0 right-0 opacity-10 grid grid-cols-8 gap-3 p-4 select-none pointer-events-none" aria-hidden>
          {Array.from({ length: 32 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
          ))}
        </div>
        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-[#F6E05E]" />
            <div>
              <p className="font-display text-xl font-bold">Your referral link</p>
              <p className="text-xs text-primary-foreground/70">Share it anywhere — WhatsApp works best.</p>
            </div>
          </div>
          <p className="font-mono text-sm bg-white/10 rounded-lg px-4 py-3 break-all">{link}</p>
          <p className="text-sm">
            Referral code: <span className="font-mono font-bold text-[#F6E05E]">{code}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`${link} — Use my code ${code} for ₦3,000 credit`);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
                toast.success("Link + code copied to clipboard");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition-colors active:scale-[0.97]">
              {copied ? <Check className="w-4 h-4 text-[#F6E05E]" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
            <a
              href={"https://wa.me/?text=" + encodeURIComponent(`Shop the UK with GlobalCart — use my code ${code} for ₦3,000 credit: ${link}`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#F6E05E] text-primary px-4 py-2 text-sm font-semibold hover:brightness-95 transition-all active:scale-[0.97]">
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
          <p className="text-sm text-muted-foreground">
            ₦{earned.toLocaleString()} / ₦{goal.toLocaleString()}
          </p>
        </div>
        <Progress value={(earned / goal) * 100} className="mt-3 h-2.5" />
        <p className="text-xs text-muted-foreground mt-2">
          Reach ₦15,000 to unlock VIP tier — priority support and 5% off every shipment.
        </p>
      </div>

      {/* Referred users */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <h2 className="font-semibold mb-3">Friends you've invited ({demoReferred.length})</h2>
        <div className="divide-y divide-border">
          {demoReferred.map((u) => (
            <div key={u.name} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {u.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.status}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{u.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
