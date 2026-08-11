/* UK Shoppers Africa — Payment History
   Brand: black ink + gold. Shows past transactions: date, gateway, amount (GBP + local), status, receipt download.
   Style note: gold/black/faint-blue tokens from index.css; fully localized via t() (en/sw/rw/lg). */
import { useEffect, useState } from "react";
import { CreditCard, Smartphone, Landmark, Wallet, Download, Search, FileSpreadsheet, FileText } from "lucide-react";
import { ensureDemoHistory, downloadReceipt, downloadTransactionsCsv, downloadTransactionsPdf, type PaymentTransaction } from "@/lib/receipts";
import { DESTINATION_LABELS } from "@/lib/currency";
import { tr } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";

const GATEWAY_ICON: Record<string, typeof CreditCard> = {
  paystack: CreditCard,
  flutterwave: CreditCard,
  mpesa: Smartphone,
  bank: Landmark,
  wallet: Wallet,
};

export default function PaymentHistory() {
  const { lang } = useLanguage();
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

  const STATUS_STYLE: Record<PaymentTransaction["status"], string> = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    refunded: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
  };

  const STATUS_LABEL: Record<PaymentTransaction["status"], string> = {
    completed: tr("pay.paid", lang),
    pending: tr("pay.pendingStatus", lang),
    refunded: tr("pay.refunded", lang),
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">{tr("pay.title", lang)}</h1>
        <p className="text-sm text-muted-foreground mt-1">{tr("pay.sub", lang)}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-card rounded-xl shadow-sm p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{tr("pay.totalPaid", lang)}</p>
          <p className="text-xl font-bold text-primary mt-1">£{totalPaid.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white dark:bg-card rounded-xl shadow-sm p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{tr("pay.txCount", lang)}</p>
          <p className="text-xl font-bold text-primary mt-1">{txs.length}</p>
        </div>
        <div className="bg-white dark:bg-card rounded-xl shadow-sm p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{tr("pay.completed", lang)}</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{txs.filter((t) => t.status === "completed").length}</p>
        </div>
        <div className="bg-white dark:bg-card rounded-xl shadow-sm p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{tr("pay.pending", lang)}</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{txs.filter((t) => t.status === "pending").length}</p>
        </div>
      </div>

      {/* Filters + export */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              if (filtered.length === 0) return;
              downloadTransactionsPdf(filtered);
            }}
            title={tr("pay.exportPdf", lang)}
            disabled={filtered.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
              filtered.length === 0
                ? "opacity-50 cursor-not-allowed bg-white dark:bg-card border-border text-muted-foreground"
                : "bg-primary text-primary-foreground border-transparent hover:opacity-90 active:scale-[0.97]"
            }`}>
            <FileText className="w-4 h-4" /> {tr("pay.exportPdf", lang)}
          </button>
          <button
            onClick={() => {
              if (filtered.length === 0) return;
              downloadTransactionsCsv(filtered);
            }}
            title={tr("pay.exportCsv", lang)}
            disabled={filtered.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
              filtered.length === 0
                ? "opacity-50 cursor-not-allowed bg-white dark:bg-card border-border text-muted-foreground"
                : "bg-emerald-700 text-white border-transparent hover:opacity-90 active:scale-[0.97]"
            }`}>
            <FileSpreadsheet className="w-4 h-4" /> {tr("pay.exportCsv", lang)}
          </button>
        </div>
        {filtered.length === 0 && (query !== "" || filter !== "all") && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 self-center">
            <Search className="w-3.5 h-3.5" /> {tr("pay.exportNone", lang)}
          </p>
        )}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr("pay.searchPh", lang)}
            className="w-full rounded-lg border border-border pl-9 pr-3 py-2 text-sm bg-white dark:bg-card outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "completed", "pending", "refunded"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-white dark:bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}>
              {f === "all" ? tr("pay.all", lang) : tr(`pay.${f}`, lang)}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-card rounded-xl p-10 text-center">
            <Wallet className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground mt-3">{tr("pay.none", lang)}</p>
          </div>
        )}
        {filtered.map((t) => {
          const Icon = GATEWAY_ICON[t.gateway] ?? CreditCard;
          return (
            <div key={t.ref} className="bg-white dark:bg-card rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
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
                    aria-label={tr("pay.receiptTooltip", lang)}
                    title={tr("pay.receiptTooltip", lang)}>
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
