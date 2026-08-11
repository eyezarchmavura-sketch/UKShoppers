/* UK Shoppers Africa Checkout — 3-step stepper (Address → Payment → Confirm)
   Brand: black ink + gold. Payment gateways: Paystack (TZ/RW/NG cards + mobile money),
   Flutterwave (KE/UG/RW cards, M-Pesa, Airtel Money), bank transfer, and portal wallet.
   Demo keys are test/public keys only — no real charge occurs until real live keys are set. */
import { useState, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import {
  MapPin,
  CreditCard,
  Smartphone,
  Landmark,
  Wallet,
  Check,
  Lock,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaystackButton } from "react-paystack";
import { useFlutterwave } from "flutterwave-react-v3";
import { DESTINATIONS, DESTINATION_LABELS, gbpWithLocal, type LocalCurrency } from "@/lib/currency";
import { saveLastPayment, type PaymentTransaction } from "@/lib/receipts";

const TOTAL_GBP = 132.49;

const destCurrency = (code: string): LocalCurrency => DESTINATIONS[code] ?? DESTINATIONS.TZ;

type GatewayId = "paystack" | "flutterwave" | "mpesa" | "bank" | "wallet";

interface Gateway {
  id: GatewayId;
  label: string;
  sub: string;
  icon: typeof CreditCard;
  brandColor: string;
  methods: string[];
  recommendedFor?: string;
}

const gateways: Gateway[] = [
  {
    id: "paystack",
    label: "Paystack",
    sub: "Visa, Mastercard, Mobile Money — trusted across East Africa",
    icon: CreditCard,
    brandColor: "#0BA4DB",
    methods: ["Card", "M-Pesa", "Airtel Money", "Tigo Pesa"],
    recommendedFor: "Tanzania, Rwanda, Uganda",
  },
  {
    id: "flutterwave",
    label: "Flutterwave",
    sub: "Cards, M-Pesa Kenya, Airtel Money, bank transfer",
    icon: CreditCard,
    brandColor: "#F5A623",
    methods: ["Card", "M-Pesa KE", "Airtel Money", "Bank Transfer"],
    recommendedFor: "Kenya, Uganda, Rwanda",
  },
  {
    id: "mpesa",
    label: "M-Pesa Direct (STK Push)",
    sub: "Instant paybill — pay from your Safaricom phone",
    icon: Smartphone,
    brandColor: "#39B54A",
    methods: ["M-Pesa Paybill 247247"],
    recommendedFor: "Kenya",
  },
  {
    id: "bank",
    label: "Direct Bank Transfer",
    sub: "CRDB, NMB, Equity, KCB — settled within 1 business day",
    icon: Landmark,
    brandColor: "#111418",
    methods: ["CRDB", "NMB", "Equity Bank", "KCB"],
  },
  {
    id: "wallet",
    label: "Pay from Wallet Balance",
    sub: "Use your credited wallet balance (£42.30 available)",
    icon: Wallet,
    brandColor: "#C9A227",
    methods: ["Wallet Credit"],
  },
];

const steps = ["Address", "Payment", "Confirm"];

export default function Checkout() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [gateway, setGateway] = useState<GatewayId>("paystack");
  const [destCode, setDestCode] = useState("TZ");
  const [duties, setDuties] = useState(true);
  const [paying, setPaying] = useState(false);
  const [txRef, setTxRef] = useState<string>("");
  const [bankOpen, setBankOpen] = useState(false);
  const [mpesaOpen, setMpesaOpen] = useState(false);
  const [phone, setPhone] = useState("");

  const ref = useCallback(() => `UKSA-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, []);

  // Flutterwave config must exist before useFlutterwave is called (TDZ-safe, declared below via fwConfigMemo).
  // We build it here with a stable function that reads the latest phone.
  const fwConfigMemo = useMemo(
    () => ({
      public_key: "FLWPUBK_TEST-demo-placeholder-X",
      tx_ref: "",
      amount: 132.49,
      currency: "USD",
      payment_options: "card, mobilemoneyke, mpesa, mobilemoneyuganda, mobilemoneyrwanda, ussd",
      customer: { email: "customer@ukshoppersafrica.com", name: "Amina M.", phone_number: phone || "+255763173629" },
      customizations: {
        title: "UK Shoppers Africa — Order Payment",
        description: "Express UK shopping delivery to East Africa",
        logo: "https://placehold.co/120x40/111418/D4AF37?text=UKSA",
      },
    }),
    [phone]
  );
  const payWithFlutterwave = useFlutterwave(fwConfigMemo);
  const openFlutterwave = (cb: (data: { status: string; tx_ref?: string }) => void) => {
    payWithFlutterwave({
      callback: (data: { status: string; tx_ref?: string }) => {
        if (data.status === "successful") onSuccess(data.tx_ref ?? ref());
        else onClose();
        cb(data);
      },
      onClose,
    });
  };

  const FlutterwavePay = () => (
    <div className="w-full">
      <input
        type="tel"
        placeholder="Your phone number (e.g. +254 7XX XXX XXX)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full mb-2 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <button
        onClick={() => {
          setPaying(true);
          fwConfigMemo.tx_ref = ref();
          openFlutterwave(() => {});
        }}
        className="w-full rounded-full px-8 py-3 bg-[#F5A623] text-black font-semibold text-sm hover:brightness-95 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
        Pay with Flutterwave (£{TOTAL_GBP}) <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );

  const next = () => {
    if (step === 0) toast.success("Delivery address selected");
    setStep((s) => Math.min(s + 1, 2));
  };

  const onSuccess = (tref: string, gwLabel = gateways.find((g) => g.id === gateway)?.label ?? gateway) => {
    setPaying(false);
    setTxRef(tref);
    const tx: PaymentTransaction = {
      ref: tref,
      date: new Date().toISOString(),
      gateway,
      gatewayLabel: gwLabel,
      amountGbp: TOTAL_GBP,
      localAmount: gbpWithLocal(TOTAL_GBP, destCurrency(destCode)).match(/\(([^)]+)\)/)?.[1] ?? "—",
      destCode,
      customer: "Amina M.",
      status: "completed",
      items: "Nike sneakers + ASOS dress + Boots skincare bundle",
    };
    saveLastPayment({ tx });
    toast.success(`Payment received (${tref}) — our London team will buy your items within 24 hours`);
    setTimeout(() => navigate(`/success?ref=${encodeURIComponent(tref)}`), 900);
  };

  const onClose = () => {
    setPaying(false);
    toast.info("Payment window closed — your order is still saved. Resume anytime.");
  };

  /* ---------- Paystack config — amount in minor units of the selected destination's currency ---------- */
  const paystackConfig = {
    reference: ref(),
    email: "customer@ukshoppersafrica.com",
    amount: Math.round(TOTAL_GBP * destCurrency(destCode).rate * 100),
    currency: destCurrency(destCode).code,
    publicKey: "pk_test_demo_placeholder",
    onSuccess: () => onSuccess(paystackConfig.reference),
    onClose,
    metadata: {
      custom_fields: [
        { display_name: "Customer", variable_name: "customer", value: "Amina M." },
        { display_name: "Destination", variable_name: "destination", value: "Dar es Salaam, TZ" },
      ],
    },
  };

  /* ---------- Flutterwave config (fwConfigMemo above) ---------- */

  /* ---------- M-Pesa STK push (simulated flow) ---------- */
  const startMpesa = () => {
    if (!phone) {
      toast.error("Enter your Safaricom number first");
      return;
    }
    setMpesaOpen(true);
    setPaying(true);
  };
  const confirmMpesa = () => {
    setPaying(false);
    setMpesaOpen(false);
    onSuccess(`MPESA-${Date.now()}`);
  };

  /* ---------- Bank transfer ---------- */
  const startBank = () => {
    setTxRef(ref());
    setBankOpen(true);
  };
  const confirmBank = () => {
    const tref = txRef || ref();
    setTxRef(tref);
    saveLastPayment({
      tx: {
        ref: tref,
        date: new Date().toISOString(),
        gateway: "bank",
        gatewayLabel: "Bank Transfer",
        amountGbp: TOTAL_GBP,
        localAmount: gbpWithLocal(TOTAL_GBP, destCurrency(destCode)).match(/\(([^)]+)\)/)?.[1] ?? "—",
        destCode,
        customer: "Amina M.",
        status: "pending",
        items: "Nike sneakers + ASOS dress + Boots skincare bundle",
      },
    });
    setBankOpen(false);
    toast.success(`Transfer reference ${tref} logged — order activated once funds clear (1 business day)`);
    navigate(`/success?ref=${encodeURIComponent(tref)}`);
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(DESTINATIONS) as (keyof typeof DESTINATIONS)[]).map((code) => {
              const c = DESTINATIONS[code];
              return (
                <button
                  key={code}
                  onClick={() => setDestCode(code)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    destCode === code ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}>
                  <span className="text-lg">{c.flag}</span>
                  <p className="text-sm font-semibold mt-1">{DESTINATION_LABELS[code]}</p>
                  <p className="text-[11px] text-muted-foreground">{c.symbol}</p>
                </button>
              );
            })}
          </div>
          <label className="flex items-start gap-3 border-2 border-primary rounded-lg p-4 cursor-pointer">
            <input type="radio" name="addr" defaultChecked className="mt-1 accent-[#111418]" />
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
            <span className="text-sm font-semibold text-amber-700">+£11.80 incl.</span>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Choose Payment Gateway</h2>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" /> PCI-DSS secured
            </span>
          </div>
          <div className="space-y-2">
            {gateways.map((g) => (
              <label
                key={g.id}
                className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                  gateway === g.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}>
                <input
                  type="radio"
                  name="gw"
                  checked={gateway === g.id}
                  onChange={() => setGateway(g.id)}
                  className="accent-[#111418]"
                />
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: g.brandColor + "18" }}>
                  <g.icon className="w-5 h-5" style={{ color: g.brandColor }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    {g.label}
                    {g.recommendedFor && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                        {g.recommendedFor}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{g.sub}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {g.methods.map((m) => (
                      <span key={m} className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            Review & Confirm Order <BadgeCheck className="w-4 h-4 text-primary" />
          </h2>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destination:</span>
              <span className="font-semibold">Dar es Salaam, Tanzania</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gateway:</span>
              <span className="font-semibold">{gateways.find((g) => g.id === gateway)?.label}</span>
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
              <span className="font-bold text-primary">£{TOTAL_GBP} (≈ {gbpWithLocal(TOTAL_GBP, destCurrency(destCode))})</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" /> Encrypted secure payment via UK Shoppers Africa payment gateway.
          </p>

          {/* Pay button per gateway */}
          <div className="pt-2">
            {gateway === "paystack" && (
              <PaystackButton
                {...paystackConfig}
                className="w-full rounded-full px-8 py-3 bg-[#0BA4DB] text-white font-semibold text-sm hover:brightness-95 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                Pay with Paystack (£{TOTAL_GBP}) <ExternalLink className="w-4 h-4" />
              </PaystackButton>
            )}
            {gateway === "flutterwave" && <FlutterwavePay />}
            {gateway === "mpesa" && (
              <div className="space-y-2">
                <input
                  type="tel"
                  placeholder="Safaricom number (e.g. +254 7XX XXX XXX)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
                <Button
                  onClick={startMpesa}
                  className="w-full rounded-full px-8 py-3 bg-[#39B54A] text-white font-semibold hover:brightness-95 active:scale-[0.98]">
                  Request M-Pesa STK Push (£{TOTAL_GBP})
                </Button>
              </div>
            )}
            {gateway === "bank" && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Transfer £{TOTAL_GBP} to our UK Shoppers Africa account. Your order activates automatically once the funds clear (max 1 business day).
                </p>
                <Button onClick={startBank} variant="outline" className="w-full rounded-full px-8 py-3 font-semibold">
                  Show Bank Details & Generate Reference
                </Button>
              </div>
            )}
            {gateway === "wallet" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                  <Wallet className="w-4 h-4 text-amber-700 shrink-0" />
                  Wallet balance £42.30 — top up via Paystack/Flutterwave, then pay from balance anytime.
                </div>
                <Button
                  onClick={() => onSuccess(ref())}
                  className="w-full rounded-full px-8 py-3 bg-[#C9A227] text-black font-semibold hover:brightness-95 active:scale-[0.98]">
                  Pay £42.30 from Wallet (partial)
                </Button>
              </div>
            )}
          </div>

          {paying && gateway !== "mpesa" && (
            <p className="text-xs text-center text-muted-foreground animate-pulse">
              Opening secure payment window… {gateway === "bank" ? "" : ""}
            </p>
          )}
        </div>
      )}

      {/* Footer buttons */}
      <div className="flex justify-between pt-2">
        {step > 0 ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="rounded-full">
            Back
          </Button>
        ) : (
          <div />
        )}
        {step < 2 ? (
          <Button onClick={next} className="rounded-full px-6">
            Continue to {steps[step + 1]}
          </Button>
        ) : (
          gateway === "paystack" && (
            <div />
          )
        )}
      </div>

      {/* M-Pesa STK push dialog */}
      <Dialog open={mpesaOpen} onOpenChange={(v) => !v && !paying && setMpesaOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#39B54A]">
              <Smartphone className="w-5 h-5" /> M-Pesa STK Push Sent
            </DialogTitle>
            <DialogDescription>
              Check your Safaricom phone ({phone || "+254 7XX XXX XXX"}) — a payment prompt for £{TOTAL_GBP} (≈ {gbpWithLocal(TOTAL_GBP, destCurrency(destCode)).match(/\(([^)]+)\)/)?.[1] ?? "KSh 236,000"}) is waiting. Enter your M-Pesa PIN to complete.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-[#39B54A]/10 rounded-lg text-center space-y-2">
            <p className="text-sm font-semibold">Paybill: 247247 · Account: UKSA-{Date.now().toString().slice(-6)}</p>
            <p className="text-xs text-muted-foreground">Demo prototype — tap confirm to simulate completion</p>
          </div>
          <Button onClick={confirmMpesa} className="rounded-full bg-[#39B54A] text-white font-semibold">
            I've completed the payment
          </Button>
        </DialogContent>
      </Dialog>

      {/* Bank transfer dialog */}
      <Dialog open={bankOpen} onOpenChange={setBankOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-primary" /> Bank Transfer Details
            </DialogTitle>
            <DialogDescription>
              Transfer the exact amount and your order activates automatically on clearance.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted/60 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Bank:</span><span className="font-semibold">CRDB Bank PLC, Dar es Salaam</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Account:</span><span className="font-semibold">UK Shoppers Africa INM LTD</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Account No.:</span><span className="font-semibold">0152-0299-4170</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Reference:</span><span className="font-bold text-primary">{txRef}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="font-semibold">Amount:</span><span className="font-bold">£{TOTAL_GBP} ≈ {gbpWithLocal(TOTAL_GBP, destCurrency(destCode))}</span></div>
          </div>
          <Button onClick={confirmBank} className="rounded-full font-semibold w-full">
            I've made the transfer — activate my order
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
