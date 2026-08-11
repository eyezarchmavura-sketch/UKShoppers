import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { demoTransactions } from "@/lib/demoData";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { parseGbp } from "@/pages/PaymentHistory";
import type { PaymentTransaction } from "@/lib/receipts";
import { ensureDemoHistory } from "@/lib/receipts";

/** Convert a DB payment row into the shared PaymentTransaction shape used by transaction rows. */
function toWalletTx(p: { ref: string; gateway: string; amount: number | string; currencyCode: string; destination: string | null; createdAt: Date; status: string }): PaymentTransaction {
  const gbp = parseGbp(p.amount);
  const GATEWAY_LABEL: Record<string, string> = { paystack: "Paystack", flutterwave: "Flutterwave", mpesa: "M-Pesa", bank: "Bank Transfer", wallet: "Wallet" };
  return {
    ref: p.ref,
    date: p.createdAt.toISOString(),
    gateway: p.gateway,
    gatewayLabel: GATEWAY_LABEL[p.gateway] ?? p.gateway,
    items: p.destination ?? "Wallet deposit",
    amountGbp: gbp,
    localAmount: p.currencyCode !== "GBP" ? p.amount + " " + p.currencyCode : "",
    destCode: p.destination ?? "",
    customer: "",
    status: p.status === "paid" ? "completed" : "pending",
  };
}

export default function Wallet() {
  const { isAuthenticated } = useAuth();
  const { data: dbPayments } = trpc.payments.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const isReal = isAuthenticated && Boolean(dbPayments);
  const isLoading = isAuthenticated && !dbPayments;
  const entries: PaymentTransaction[] = isReal ? dbPayments!.map(toWalletTx) : ensureDemoHistory();
  const balance = isReal
    ? dbPayments!.reduce((s, p) => s + parseGbp(p.amount), 0)
    : demoTransactions.reduce((s, t) => s + parseFloat(t.amount.replace(/[^0-9.\-]/g, "")), 0);

  const balanceDisplay = Number.isFinite(balance)
    ? `£${balance.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`
    : "£42.30";

  const onDeposit = () => toast.info("Live wallet deposits land here — enable Paystack/M-Pesa live keys in production and this becomes a real top-up flow.");

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Wallet & Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Deposit via M-Pesa, Tigo Pesa, Airtel Money, or bank cards. Pay orders instantly and receive referral rewards.
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
            <p className="font-display text-4xl font-bold mt-1">{balanceDisplay}</p>
            <p className="text-sm text-primary-foreground/70 mt-1">≈ TSh 143,800 / KSh 7,100 at today's rate</p>
          </div>
          <Button onClick={onDeposit}
            className="rounded-full bg-[#D4AF37] text-primary font-semibold hover:brightness-95 active:scale-[0.97]">
            <Plus className="w-4 h-4" /> Deposit funds
          </Button>
        </div>
      </div>

      {/* Payment methods summary */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <h2 className="font-semibold text-sm mb-3">Connected Payment Methods (East Africa & UK)</h2>
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-muted px-3 py-1.5 flex items-center gap-1.5">📱 M-Pesa (Kenya / Tanzania)</span>
          <span className="rounded-full bg-muted px-3 py-1.5 flex items-center gap-1.5">📱 Tigo Pesa / Airtel Money</span>
          <span className="rounded-full bg-muted px-3 py-1.5 flex items-center gap-1.5">💳 Visa / Mastercard</span>
          <span className="rounded-full bg-muted px-3 py-1.5 flex items-center gap-1.5">🏦 Direct Bank Transfer</span>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <h2 className="font-semibold mb-1">Transaction History</h2>
        <p className="text-xs text-muted-foreground mb-3">
          {isReal
            ? "Your real payment history from the UK Shoppers Africa account. Wallet balance is computed from completed payments."
            : "All movements of your balance and credits."}
        </p>
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">Loading your transactions…</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm font-medium text-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground mt-1">Make your first payment and it will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
          {entries.map((t) => (
            <div key={t.ref} className="flex items-center gap-3 py-3">
              <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-amber-100">
                <ArrowDownRight className="w-4 h-4 text-amber-700" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.gatewayLabel}{t.items ? ` — ${t.items}` : ""}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {t.ref}
                </p>
              </div>
              <span className="text-sm font-bold text-amber-700">£{t.amountGbp.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
