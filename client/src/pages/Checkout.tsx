/* UK Shoppers Africa Checkout — 3-step stepper (Address → Payment → Confirm) */
import { useState } from "react";
import { useLocation } from "wouter";
import { MapPin, CreditCard, Smartphone, Landmark, Wallet, Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const payments = [
  { id: "mpesa", label: "M-Pesa / Tigo Pesa / Mobile Money", sub: "Instant mobile payment across East Africa", icon: Smartphone },
  { id: "card", label: "Card (Visa / Mastercard)", sub: "Secure Stripe & Flutterwave processing", icon: CreditCard },
  { id: "bank", label: "Direct Bank Transfer", sub: "Settled within 1 business day", icon: Landmark },
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
      toast.success("Payment received — our London team will buy your items within 24 hours");
      navigate("/orders");
    }, 1600);
  };

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Checkout</h1>
        <p className="text-sm text-muted-foreground mt-1">Your quote is locked in. Customs duties prepaid — nothing extra on delivery.</p>
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
          <h2 className="font-semibold">Shipping Destination in East Africa</h2>
          <label className="flex items-start gap-3 border-2 border-primary rounded-lg p-4 cursor-pointer">
            <input type="radio" name="addr" defaultChecked className="mt-1 accent-[#0A3622]" />
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Home — Dar es Salaam, Tanzania</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Plot 45, Ali Hassan Mwinyi Road, Kinondoni, Dar es Salaam
              </p>
            </div>
          </label>
          <button
            onClick={() => toast("Add new address modal")}
            className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/70">
            + Add a new East African delivery address
          </button>
          <div className="border-t pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch checked={duties} onCheckedChange={setDuties} />
              <div>
                <p className="text-sm font-medium">Estimate duties & clearance at checkout</p>
                <p className="text-xs text-muted-foreground">
                  Recommended — customs cleared before dispatch.
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-emerald-700">+£11.80 incl.</span>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5 space-y-3">
          <h2 className="font-semibold">Payment Method</h2>
          <div className="space-y-2">
            {payments.map((p) => (
              <label
                key={p.id}
                className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  payment === p.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}>
                <input
                  type="radio"
                  name="pay"
                  checked={payment === p.id}
                  onChange={() => setPayment(p.id)}
                  className="accent-[#0A3622]"
                />
                <p.icon className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5 space-y-4">
          <h2 className="font-semibold">Review & Confirm Order</h2>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destination:</span>
              <span className="font-semibold">Dar es Salaam, Tanzania</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items Total:</span>
              <span className="font-semibold">£109.99</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Air Freight & Handling:</span>
              <span className="font-semibold">£22.50</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-base">
              <span className="font-bold text-primary">Total Payable:</span>
              <span className="font-bold text-primary">£132.49 (≈ TSh 448,500)</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" /> Encrypted secure payment via UK Shoppers Africa payment gateway.
          </p>
        </div>
      )}

      {/* Footer buttons */}
      <div className="flex justify-between pt-2">
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="rounded-full">
            Back
          </Button>
        ) : <div />}
        {step < 2 ? (
          <Button onClick={next} className="rounded-full px-6">
            Continue to {steps[step + 1]}
          </Button>
        ) : (
          <Button onClick={pay} disabled={paying} className="rounded-full px-8 bg-[#F6E05E] text-primary hover:brightness-95 font-semibold">
            {paying ? "Processing payment..." : "Authorize & Pay (£132.49)"}
          </Button>
        )}
      </div>
    </div>
  );
}
