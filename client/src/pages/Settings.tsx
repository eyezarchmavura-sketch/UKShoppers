/* UK Shoppers Africa — Settings: profile, notification channels, security.
   Brand: black ink + gold. Reads the real logged-in user and persists the
   "Email me order updates" preference to the database. */
import { useEffect, useState } from "react";
import { ShieldCheck, Bell, Mail, Smartphone, MessageCircle, FileText, Scale, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Settings() {
  const { user, isAuthenticated } = useAuth();
  const initials = (user?.name ?? "U").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  // Real database rows.
  const me = trpc.auth.me.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const updatePrefs = trpc.profile.update.useMutation({
    onSuccess: () => toast.success("Preferences saved — order updates will follow your choices"),
    onError: () => toast.error("Could not save — please try again"),
  });

  // Email notifications preference, seeded from the real user row.
  const [emailNotif, setEmailNotif] = useState(true);
  useEffect(() => {
    if (me.data) setEmailNotif((me.data as { emailNotifications?: string } | null)?.emailNotifications !== "no");
  }, [me.data]);

  const [smsNotif, setSmsNotif] = useState(true);
  const [waNotif, setWaNotif] = useState(true);
  const [twofa, setTwofa] = useState(false);

  const saveEmailPref = (value: boolean) => {
    setEmailNotif(value);
    updatePrefs.mutate({ emailNotifications: value ? "yes" : "no" });
  };

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile, notifications, and security.</p>
      </div>

      {/* Profile */}
      <div className="bg-white dark:bg-card rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] dark:shadow-none p-5 space-y-4">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Profile</h2>
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            {initials}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">{me.data?.name ?? "Guest shopper"}</p>
            <p className="text-xs text-muted-foreground">{me.data?.email ?? "Sign in to see your account email"}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input defaultValue={me.data?.name ?? ""} placeholder="Full name" disabled />
          <Input defaultValue={me.data?.email ?? ""} placeholder="Email" disabled />
        </div>
        <div className="flex justify-end">
          <Button
            disabled
            onClick={() => toast.success("Profile saved")}
            className="rounded-full active:scale-[0.97]">
            Save changes
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Profile details come from your account. Name and email are managed in your sign-in profile.
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-card rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] dark:shadow-none p-5">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4" /> Notification channels
        </h2>
        <div className="space-y-3">
          {[
            {
              icon: Mail,
              label: "Email",
              sub: "Order confirmations, receipts and milestone updates — saved to your account",
              checked: emailNotif,
              saving: updatePrefs.isPending,
              set: (v: boolean) => saveEmailPref(v),
              real: true,
            },
            {
              icon: Smartphone,
              label: "SMS",
              sub: "Delivery and customs updates (coming soon)",
              checked: smsNotif,
              set: (v: boolean) => {
                setSmsNotif(v);
                toast.success(v ? "SMS updates enabled (prototype)" : "SMS updates disabled (prototype)");
              },
              real: false,
            },
            {
              icon: MessageCircle,
              label: "WhatsApp",
              sub: "Real-time checkpoint pings (coming soon)",
              checked: waNotif,
              set: (v: boolean) => {
                setWaNotif(v);
                toast.success(v ? "WhatsApp updates enabled (prototype)" : "WhatsApp updates disabled (prototype)");
              },
              real: false,
            },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <n.icon className="w-4.5 h-4.5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.sub}</p>
                </div>
              </div>
              <Switch
                checked={n.checked}
                disabled={n.real && n.saving}
                onCheckedChange={n.set as (v: boolean) => void}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-card rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] dark:shadow-none p-5">
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
          <Switch
            checked={twofa}
            onCheckedChange={(v) => {
              setTwofa(v);
              toast.success(v ? "2FA enabled (prototype)" : "2FA disabled (prototype)");
            }}
          />
        </div>
      </div>

      {/* Legal */}
      <div className="bg-white dark:bg-card rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] dark:shadow-none p-5">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4" /> Legal documents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, label: "Privacy Policy", path: "/privacy" },
            { icon: Scale, label: "Terms of Service", path: "/terms" },
            { icon: RotateCcw, label: "Returns & Refunds", path: "/returns" },
          ].map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              href={path}
              className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-colors">
              <Icon className="w-4 h-4 text-primary" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
