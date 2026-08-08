/* GlobalCart Checkout — 3-step stepper (Address → Payment → Confirm) per wireframe 2.4.
   Duties-estimate toggle defaults ON to reinforce no-hidden-fees positioning. */
import { useState } from "react";
import { useLocation } from "wouter";
import { MapPin, CreditCard, Smartphone, Landmark, Wallet, Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const payments = [
  { id: "card", label: "Card (Visa / Mastercard)", sub: "Processed by Stripe", icon: CreditCard },
  { id: "mpesa", label: "M-Pesa", sub: "Pay with your M-Pesa balance", icon: Smartphone },
  { id: "flutterwave", label: "Local card via Flutterwave", sub: "Cards issued in your country", icon: Wallet },
  { id: "bank", label: "Bank transfer", sub: "Settled within 1 business day", icon: Landmark },
];

const steps = ["Address", "Payment", "Confirm"];

export default function Checkout() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [payment, setPayment] = useState("mpesa");
  const [duties, setDuties] = useState(true);
  const [paying, setPaying] = useState(false);

  const next = () => {
    if (step === 0) toast.success("Delivery address selected");
    setStep((s) => Math.min(s + 1, 2));
  };

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      toast.success("Payment received — we'll buy your items within 24 hours");
      navigate("/orders");
    }, 1600);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Checkout</h1>
        <p className="text-sm text-muted-foreground mt-1">Your quote is locked in. Nothing will change at delivery.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
            {i < 2 && <div className={`flex-1 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>
      <Progress value={((step + 1) / 3) * 100} className="h-1.5" />

      {step === 0 && (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5 space-y-4">
          <h2 className="font-semibold">Shipping destination</h2>
          <label className="flex items-start gap-3 border-2 border-primary rounded-lg p-4 cursor-pointer">
            <input type="radio" name="addr" defaultChecked className="mt-1 accent-[#0A3622]" />
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Home — Lagos, Nigeria</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                14 Admiralty Way, Lekki Phase 1, Lagos
              </p>
            </div>
          </label>
          <button
            onClick={() => toast("Add-address form arrives in the real build")}
            className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/70">
            + Add a new address
          </button>
          <div className="border-t pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch checked={duties} onCheckedChange={setDuties} />
              <div>
                <p className="text-sm font-medium">Estimate duties at checkout</p>
                <p className="text-xs text-muted-foreground">
                  Recommended — duties prepaid, nothing to pay at the door.
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-emerald-700">+£11.80 est.</span>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5 space-y-3">
          <h2 className="font-semibold">Payment method</h2>
          {payments.map((p) => {
            const Icon = p.icon;
            const active = payment === p.id;
            return (
              <label
                key={p.id}
                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                  active ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}>
                <input
                  type="radio"
                  name="payment"
                  value={p.id}
                  checked={active}
                  onChange={() => setPayment(p.id)}
                  className="accent-[#0A3622]"
                />
                <Icon className="w-4.5 h-4.5 text-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.sub}</p>
                </div>
                {p.id === "mpesa" && (
                  <span className="text-[10px] font-semibold bg-[#F6E05E] text-primary rounded-full px-2 py-0.5">
                    POPULAR
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5 space-y-4">
          <h2 className="font-semibold">Order summary</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Items (Nike Air Max 90 · Nike UK)</span><span>£109.99</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Service fee</span><span>£8.00</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Estimated shipping (0.9 kg)</span><span>£14.50</span></div>
            {duties && (
              <div className="flex justify-between text-muted-foreground"><span>Estimated duties (prepaid)</span><span>£11.80</span></div>
            )}
            <div className="flex justify-between border-t pt-2 font-bold text-primary text-base">
              <span>Total — all-in</span><span>£{duties ? "144.29" : "132.49"}</span>
            </div>
            <p className="text-xs text-muted-foreground">≈ ₦183,700 at today's rate</p>
          </div>
          <p className="text-xs text-muted-foreground bg-muted rounded-lg p-3 flex gap-2">
            <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            Payments are processed by tokenized, PCI-DSS compliant gateways — your card details never touch our servers.
          </p>
          <Button
            onClick={pay}
            disabled={paying}
            className="w-full rounded-full bg-[#F6E05E] text-primary font-semibold h-11 hover:brightness-95 active:scale-[0.98]">
            {paying ? (
              <>Processing…</>
            ) : (
              <>Pay Securely · £{duties ? "144.29" : "132.49"}</>
            )}
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="rounded-full">
            Back
          </Button>
        )}
        {step < 2 && (
          <Button onClick={next} className="rounded-full active:scale-[0.97]">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
