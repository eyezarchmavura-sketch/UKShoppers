/* GlobalCart My Address — UK warehouse address card with copy + QR placeholder per wireframe 2.6. */
import { useState } from "react";
import { Copy, Check, QrCode, Flag, Sparkles, Rocket } from "lucide-react";
import { toast } from "sonner";

const address = {
  name: "Ada E.",
  unit: "UNIT-7X2",
  street: "12 Fulfillment Road",
  city: "London, N17 6AB",
  country: "United Kingdom",
};

export default function Address() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const full = `${address.name}, ${address.unit}, ${address.street}, ${address.city}, ${address.country}`;
    navigator.clipboard?.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success("Address copied — paste it as the shipping address at any store checkout");
  };

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">My International Addresses</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Shop at any supported store and use this address at checkout. Parcels are auto-linked to your account via your UNIT ID.
        </p>
      </div>

      {/* Active UK address */}
      <div className="relative overflow-hidden bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-6">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-[#C9A227]" />
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Active · UK Warehouse</p>
            </div>
            <div className="mt-3 space-y-1 font-mono text-sm text-foreground/80">
              <p>{address.name} <span className="font-semibold text-primary">({address.unit})</span></p>
              <p>{address.street}</p>
              <p>{address.city}</p>
              <p>{address.country}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors active:scale-[0.97]">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy address"}
              </button>
              <button
                onClick={() => toast("QR code feature ships with the mobile app in Phase 2")}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors active:scale-[0.97]">
                <QrCode className="w-4 h-4" /> Show QR for stores
              </button>
            </div>
          </div>
          <div className="w-full sm:w-32 h-32 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <div className="grid grid-cols-6 gap-1 p-2" aria-hidden>
              {Array.from({ length: 36 }).map((_, i) => (
                <span key={i} className={`w-2 h-2 ${i % 3 === 0 || i % 5 === 0 ? "bg-foreground/70" : "bg-foreground/20"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How to use */}
      <div className="bg-[#F6E05E]/40 border border-[#F6E05E] rounded-xl p-5 flex gap-3">
        <Sparkles className="w-5 h-5 text-[#8a7415] shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-[#6b5a0f]">How to use it</p>
          <p className="text-[#55470c] mt-0.5">
            Copy this address into any store's checkout as your shipping address. Our warehouse auto-detects
            your UNIT-7X2 code and links every parcel to your account — no forwarding requests needed.
          </p>
        </div>
      </div>

      {/* Coming soon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { flag: "🇺🇸", name: "US Warehouse", note: "New York · arriving Phase 2" },
          { flag: "🇪🇺", name: "EU Warehouse", note: "Amsterdam · arriving Phase 2" },
        ].map((w) => (
          <div key={w.name} className="bg-white/60 border border-dashed border-border rounded-xl p-5 flex items-center gap-4">
            <Flag className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground/70">
                {w.flag} {w.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Rocket className="w-3 h-3" /> {w.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
