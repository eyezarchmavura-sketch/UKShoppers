/* UK Shoppers Africa — Payment History
   Brand: black ink + gold. Shows past transactions: date, gateway, amount (GBP + local), status, receipt download. */
import { useEffect, useState } from "react";
import { CreditCard, Smartphone, Landmark, Wallet, Download, Search } from "lucide-react";
import { loadTransactions, ensureDemoHistory, downloadReceipt, type PaymentTransaction } from "@/lib/receipts";
import { DESTINATION_LABELS } from "@/lib/currency";

const GATEWAY_ICON: Record<string, typeof CreditCard> = {
  paystack: CreditCard,
  flutterwave: CreditCard,
  mpesa: Smartphone,
  bank: Landmark,
  wallet: Wallet,
};

const STATUS_STYLE: Record<PaymentTransaction["status"], string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  refunded: "bg-rose-50 text-rose-700 border-rose-200",
};

const STATUS_LABEL: Record<PaymentTransaction["status"], string> = {
  completed: "Paid",
  pending: "Pending",
  refunded: "Refunded",
};

export default function PaymentHistory() {
  const [txs, setTxs] = useState<PaymentTransaction[]>([]);
  const [filter, setFilter] = useState<"all" | PaymentTransaction["status"]>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setTxs(ensureDemoHistory());
  }, []);

  const filtered = txs.filter(
    (t) =>
      (filter === "all" || t.status === filter) &&
      (query === "" || t.ref.toLowerCase().includes(query.toLowerCase()) || t.gatewayLabel.toLowerCase().includes(query.toLowerCase()))
  );

  const totalPaid = txs.filter((t) => t.status === "completed").reduce((s, t) => s + t.amountGbp, 0);

  return (
    <div className="p-4 lg:p-8 max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Payment History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Every payment you have made through UK Shoppers Africa — with receipts you can download anytime.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Total Paid</p>
          <p className="text-xl font-bold text-primary mt-1">£{totalPaid.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Transactions</p>
          <p className="text-xl font-bold text-primary mt-1">{txs.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Completed</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{txs.filter((t) => t.status === "completed").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Pending</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{txs.filter((t) => t.status === "pending").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reference or gateway…"
            className="w-full rounded-lg border border-border pl-9 pr-3 py-2 text-sm bg-white outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "completed", "pending", "refunded"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-white border border-border text-muted-foreground hover:bg-muted"
              }`}>
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center">
            <Wallet className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground mt-3">No transactions found.</p>
          </div>
        )}
        {filtered.map((t) => {
          const Icon = GATEWAY_ICON[t.gateway] ?? CreditCard;
          return (
            <div key={t.ref} className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{t.gatewayLabel}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{t.items}</p>
                <p className="text-[11px] text-muted-foreground mt-1 font-mono">{t.ref} · {DESTINATION_LABELS[t.destCode]}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-primary">£{t.amountGbp.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</p>
                <p className="text-[11px] text-muted-foreground">{t.localAmount}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[t.status]}`}>
                  {STATUS_LABEL[t.status]}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                {t.status === "completed" && (
                  <button
                    onClick={() => downloadReceipt(t)}
                    className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                    title="Download PDF receipt">
                    <Download className="w-4 h-4 text-primary" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
