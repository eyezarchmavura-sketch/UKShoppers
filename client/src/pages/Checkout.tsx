import { ArrowRight, BadgeCheck, ClipboardCheck, Lock, MapPin, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

/**
 * Production checkout gate.
 *
 * A customer must receive a staff-reviewed quote before a payment intent is
 * created. This deliberately avoids a browser-declared amount, a hardcoded
 * delivery address, and any suggestion that a provider payment is settled.
 */
export default function Checkout() {
  const [, navigate] = useLocation();

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 lg:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Secure payment workflow</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-primary">Quote review required</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Before any payment request is created, our team verifies your items, delivery address, destination, customs requirements, and final total. This keeps every payment amount accurate and prevents unverified browser submissions.
        </p>
      </div>

      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">How secure payment works</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A staff-approved order receives a server-issued payment reference. It remains <strong>pending</strong> until a signed provider event and server-side reconciliation confirm the payment reference, amount, currency, and status.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: ClipboardCheck, title: "1. Submit items", text: "Share product links or a cart screenshot." },
          { icon: MapPin, title: "2. Confirm delivery", text: "Provide your real East African delivery address." },
          { icon: BadgeCheck, title: "3. Pay securely", text: "Use the verified payment request sent after approval." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-4 text-card-foreground">
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="mt-3 text-sm font-semibold">{title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground sm:p-6">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h2 className="font-semibold">No payment request is ready yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We do not show a placeholder total, prefill a delivery address, or create a payment from a browser-provided amount. Add your items first; staff will review your request and send the confirmed payment link when the order is ready.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate("/add")} className="rounded-full px-6">
            Add items for review <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/orders")} className="rounded-full px-6">
            View my orders
          </Button>
        </div>
      </section>
    </div>
  );
}
