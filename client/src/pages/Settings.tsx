/* GlobalCart Settings — profile, notification channels, security per wireframe 2.7. */
import { useState } from "react";
import { ShieldCheck, Bell, Mail, Smartphone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function Settings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [waNotif, setWaNotif] = useState(true);
  const [twofa, setTwofa] = useState(false);

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile, notifications, and security.</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5 space-y-4">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Profile</h2>
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            AE
          </span>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input defaultValue="Ada" placeholder="First name" />
            <Input defaultValue="Eze" placeholder="Last name" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input defaultValue="ada.eze@example.com" placeholder="Email" />
          <Input defaultValue="+234 803 000 0000" placeholder="Phone" />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => toast.success("Profile saved (prototype — no persistence)")}
            className="rounded-full active:scale-[0.97]">
            Save changes
          </Button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4" /> Notification channels
        </h2>
        <div className="space-y-3">
          {[
            { icon: Mail, label: "Email", sub: "Order confirmations and receipts", checked: emailNotif, set: setEmailNotif },
            { icon: Smartphone, label: "SMS", sub: "Delivery and customs updates", checked: smsNotif, set: setSmsNotif },
            { icon: MessageCircle, label: "WhatsApp", sub: "Real-time checkpoint pings", checked: waNotif, set: setWaNotif },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <n.icon className="w-4.5 h-4.5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.sub}</p>
                </div>
              </div>
              <Switch checked={n.checked} onCheckedChange={n.set} />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4" /> Security
        </h2>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Two-factor authentication</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Adds an extra code when signing in from a new device.
            </p>
          </div>
          <Switch checked={twofa} onCheckedChange={(v) => {
            setTwofa(v);
            toast.success(v ? "2FA enabled (prototype)" : "2FA disabled (prototype)");
          }} />
        </div>
      </div>
    </div>
  );
}
