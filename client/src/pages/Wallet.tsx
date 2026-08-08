/* GlobalCart Wallet — balance card, local deposit, transaction history per wireframe 2.7. */
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { demoTransactions } from "@/lib/demoData";

export default function Wallet() {
  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Wallet</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Deposit in your local currency, pay orders instantly, and receive referral rewards here.
        </p>
      </div>

      {/* Balance card */}
      <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-6 lg:p-8">
        <div className="absolute top-0 right-0 opacity-10 grid grid-cols-8 gap-3 p-4 select-none pointer-events-none" aria-hidden>
          {Array.from({ length: 32 }).map((_, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
          ))}
        </div>
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-primary-foreground/70 uppercase tracking-wide flex items-center gap-1.5">
              <WalletIcon className="w-3.5 h-3.5" /> Available balance
            </p>
            <p className="font-display text-4xl font-bold mt-1">£42.30</p>
            <p className="text-sm text-primary-foreground/70 mt-1">≈ ₦53,800 at today's rate</p>
          </div>
          <Button
            onClick={() => toast("Deposit flow (Paystack / Flutterwave / M-Pesa) ships with payment integration")}
            className="rounded-full bg-[#F6E05E] text-primary font-semibold hover:brightness-95 active:scale-[0.97]">
            <Plus className="w-4 h-4" /> Deposit funds
          </Button>
        </div>
      </div>

      {/* Payment methods summary */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <h2 className="font-semibold text-sm mb-3">Connected payment methods</h2>
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-muted px-3 py-1.5 flex items-center gap-1.5">💳 Visa •• 4821</span>
          <span className="rounded-full bg-muted px-3 py-1.5 flex items-center gap-1.5">📱 M-Pesa</span>
          <span className="rounded-full bg-muted px-3 py-1.5 flex items-center gap-1.5">🏦 Flutterwave</span>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <h2 className="font-semibold mb-1">Transaction history</h2>
        <p className="text-xs text-muted-foreground mb-3">All movements of your balance and credits.</p>
        <div className="divide-y divide-border">
          {demoTransactions.map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-3">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  t.type === "in" ? "bg-emerald-100" : "bg-orange-100"
                }`}>
                {t.type === "in" ? (
                  <ArrowDownRight className="w-4 h-4 text-emerald-700" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-orange-700" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.time}</p>
              </div>
              <span className={`text-sm font-bold ${t.type === "in" ? "text-emerald-700" : "text-foreground"}`}>
                {t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
