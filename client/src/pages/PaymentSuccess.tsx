/* UK Shoppers Africa — Payment Success Confirmation
   Brand: black ink + gold. Shows order summary, animated check mark, downloadable PDF receipt, and next steps.
   Style note: gold/black/faint-blue tokens from index.css; fully localized via t() (en/sw/rw/lg). */
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "wouter";
import { CheckCircle2, FileDown, Package, Truck, MessageCircle, ArrowRight } from "lucide-react";
import { getLastPayment, downloadReceipt } from "@/lib/receipts";
import { Button } from "@/components/ui/button";
import { tr } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PaymentTransaction } from "@/lib/receipts";

export default function PaymentSuccess() {
  const { lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const [, navigate] = useLocation();
  const [tx, setTx] = useState<PaymentTransaction | null>(null);

  useEffect(() => {
    const last = getLastPayment();
    setTx(last);
    if (!last) {
      // No payment recorded — send them back to orders rather than showing broken data
      const t = setTimeout(() => navigate("/orders", { replace: true }), 1200);
      return () => clearTimeout(t);
    }
  }, [navigate]);

  const ref = searchParams?.get("ref") ?? tx?.ref;

  if (!tx) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        {tr("success.locating", lang)} <span className="animate-spin inline-block">⟳</span>
      </div>
    );
  }

  const nextSteps = [
    { icon: Package, text: tr("success.step1", lang) },
    { icon: Truck, text: tr("success.step2", lang) },
    { icon: MessageCircle, text: tr("success.step3", lang) },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-[640px] mx-auto">
      {/* Hero card */}
      <div className="bg-white dark:bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-primary text-primary-foreground p-8 text-center relative">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/15 mx-auto flex items-center justify-center animate-in zoom-in duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="font-display text-2xl font-bold mt-4">{tr("success.confirmed", lang)}</h1>
          <p className="text-sm opacity-90 mt-1">{tr("success.processing", lang)}</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Summary rows */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{tr("success.reference", lang)}</span>
              <span className="font-mono font-semibold">{ref}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{tr("success.paidVia", lang)}</span>
              <span className="font-semibold capitalize">{tx.gatewayLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{tr("success.amount", lang)}</span>
              <span className="font-semibold">£{tx.amountGbp.toLocaleString("en-GB", { minimumFractionDigits: 2 })} · {tx.localAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{tr("success.items", lang)}</span>
              <span className="text-right font-medium">{tx.items}</span>
            </div>
          </div>

          {/* Receipt download */}
          <button
            onClick={() => downloadReceipt(tx)}
            className="w-full rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 px-5 py-3.5 flex items-center justify-center gap-3 font-semibold text-sm transition-colors active:scale-[0.98]">
            <FileDown className="w-5 h-5 text-primary" />
            {tr("success.downloadReceipt", lang)}
          </button>

          {/* Next steps */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{tr("success.whatNext", lang)}</p>
            {nextSteps.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/orders")}>
              {tr("success.viewOrders", lang)}
            </Button>
            <Button className="flex-1" onClick={() => navigate("/portal")}>
              {tr("success.goDashboard", lang)} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
