import { useState } from "react";
import { Check, MapPin, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { demoTracking, demoOrders } from "@/lib/demoData";
import { Button } from "@/components/ui/button";

export default function Tracking() {
  const [whatsapp, setWhatsapp] = useState(true);

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Shipment Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{demoOrders[0].trackingNumber} · Nike UK → Dar es Salaam</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Estimated delivery</p>
          <p className="text-lg font-bold text-primary">{demoOrders[0].edd}, 2026</p>
        </div>
      </div>

      {/* Route visual */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <MapPin className="w-4 h-4 text-primary" /> London Heathrow Hub
          </div>
          <div className="flex-1 mx-3 relative h-px bg-border">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[65%] h-0.5 bg-primary rounded-full" />
            <span className="absolute left-[62%] -top-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-primary/20" />
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <MapPin className="w-4 h-4 text-[#C9A227]" /> Dar es Salaam / Nairobi
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Express Air Freight from UK to East Africa.
        </p>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <div className="relative pl-6 space-y-0">
          {demoTracking.map((s, i) => (
            <div key={s.title} className="relative pb-6 last:pb-0">
              {i < demoTracking.length - 1 && (
                <span
                  className={`absolute left-[11px] top-6 bottom-0 w-px ${s.done ? "bg-primary" : "bg-border"}`}
                />
              )}
              <span
                className={`absolute -left-6 top-0.5 w-[23px] h-[23px] rounded-full flex items-center justify-center ${
                  s.active
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : s.done
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-muted text-muted-foreground"
                }`}>
                {s.done ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              </span>
              <div className={`ml-9 ${s.done || s.active ? "" : "opacity-60"}`}>
                <p className={`text-sm font-semibold ${s.active ? "text-primary" : "text-foreground"}`}>{s.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">{s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp toggle */}
      <div className="bg-primary text-primary-foreground rounded-xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-[#F6E05E]" />
          <div>
            <p className="text-sm font-semibold">Notify me on WhatsApp</p>
            <p className="text-xs text-primary-foreground/70">
              Get an instant update at every checkpoint across East Africa.
            </p>
          </div>
        </div>
        <Switch checked={whatsapp} onCheckedChange={setWhatsapp} />
      </div>

      <Button variant="outline" asChild className="rounded-full border-primary/40 w-fit">
        <a href="/orders">← All orders</a>
      </Button>
    </div>
  );
}
