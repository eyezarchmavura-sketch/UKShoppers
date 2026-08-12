/* UK Shoppers Africa portal shell — brand: black ink + gold accents + faint blue.
   Layout per wireframe: sticky header (logo, search, wallet, bell, user menu),
   left sidebar nav (desktop), bottom tab bar (mobile). */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  MapPin,
  Package,
  Truck,
  Wallet,
  Gift,
  Settings,
  Bell,
  Search,
  Globe,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/useMobile";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AssistantChat from "@/components/AssistantChat";
import { tr } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

function parseGbp(amount: string | number): number {
  if (typeof amount === "number") return amount;
  const m = String(amount).match(/-?[0-9]+(\.[0-9]+)?/);
  return m ? parseFloat(m[0]) : 0;
}

function initialsFor(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("") || "UK";
}

const NAV_KEYS: { path: string; icon: typeof LayoutDashboard; key: string }[] = [
  { path: "/portal", icon: LayoutDashboard, key: "nav.dashboard" },
  { path: "/address", icon: MapPin, key: "nav.ukWarehouse" },
  { path: "/orders", icon: Package, key: "nav.orders" },
  { path: "/tracking", icon: Truck, key: "nav.tracking" },
  { path: "/wallet", icon: Wallet, key: "nav.walletPay" },
  { path: "/payments", icon: Wallet, key: "nav.payments" },
  { path: "/referrals", icon: Gift, key: "nav.referrals" },
  { path: "/settings", icon: Settings, key: "nav.settings" },
];

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const mobile = useIsMobile();
  const { theme, toggleTheme } = useTheme();
  const { lang } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: payments } = trpc.payments.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const { data: notifCount } = trpc.notifications.unreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const { data: notifRows, refetch: refetchNotifs } = trpc.notifications.list.useQuery(undefined, {
    enabled: isAuthenticated && notifOpen,
    retry: false,
  });
  const balanceGbp =
    isAuthenticated && payments
      ? (payments as any[]).reduce((sum, p) => sum + parseGbp(p.amount ?? 0), 0)
      : null;

  const copyAddress = () => {
    navigator.clipboard?.writeText(
      "Amina M., UKSA-7X2, 12 Heathrow Cargo Way, London TW6 2GE, United Kingdom",
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#1a1d23] border-b border-border shadow-[0_1px_8px_rgba(17,20,24,0.06)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3 px-4 lg:px-6 h-20">
          <Link href="/portal" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#111418] flex items-center justify-center text-[#D4AF37] font-bold text-lg shadow-md">
              UK
            </div>
            <div>
              <span className="font-bold text-base text-[#111418] tracking-tight block leading-none">
                UK Shoppers <span className="text-[#C9A227]">Africa</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                Client Portal
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 ml-6 bg-muted/60 rounded-full px-3 py-2 w-72 border border-border/60">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              placeholder={tr("portal.searchPh", lang)}
              className="bg-transparent text-sm w-full outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex-1" />

          <Link href="/" className="hidden lg:inline-flex text-xs font-semibold text-[#111418] hover:underline px-3 py-1">
            {tr("portal.backHome", lang)}
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-foreground/80 hover:bg-muted rounded-full px-3 py-1.5 transition-colors">
            <Globe className="w-3.5 h-3.5" /> East Africa <ChevronDown className="w-3 h-3" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-foreground/80 hover:bg-muted rounded-full px-3 py-1.5 transition-colors">
            £ GBP / TSh / KSh <ChevronDown className="w-3 h-3" />
          </div>

          <LanguageSwitcher compact />

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-foreground/80" />
            ) : (
              <Sun className="w-5 h-5 text-[#D4AF37]" />
            )}
          </button>

          {/* Wallet chip */}
          <Link
            href="/wallet"
            className="flex items-center gap-2 bg-[#111418] text-[#D4AF37] font-semibold text-xs rounded-full px-3.5 py-2 hover:bg-[#111418]/90 transition-all active:scale-[0.97]">
            <Wallet className="w-3.5 h-3.5" /> {balanceGbp !== null ? `£${balanceGbp.toFixed(2)} Balance` : "Wallet"}
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen((v) => {
                  if (!v) refetchNotifs();
                  return !v;
                });
              }}
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Notifications">
              <Bell className="w-5 h-5 text-foreground/80" />
              {isAuthenticated && notifCount && notifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1a1d23] border border-border rounded-xl shadow-xl p-3 z-50">
                <p className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {tr("portal.notifications", lang)}
                </p>
                {!isAuthenticated ? (
                  <p className="p-3 text-xs text-muted-foreground">
                    Sign in to see your real order updates.
                  </p>
                ) : !notifRows || notifRows.length === 0 ? (
                  <p className="p-3 text-xs text-muted-foreground">No notifications yet — order updates will appear here.</p>
                ) : (
                  <div className="max-h-72 overflow-y-auto">
                    {(notifRows as any[]).map((n: any) => (
                      <div key={n.id} className="p-3 hover:bg-muted/60 rounded-lg transition-colors">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                          {new Date(n.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => toast("Profile settings")}
            className="flex items-center gap-2 ml-1">
            <div className="w-9 h-9 rounded-full bg-[#111418] text-[#D4AF37] flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name ? initialsFor(String(user.name)) : "UK"}
            </div>
          </button>
        </div>
      </header>

      {/* Main body with sidebar */}
      <div className="flex-1 flex">
        {/* Sidebar for desktop */}
        {!mobile && (
          <aside className="w-64 bg-white dark:bg-[#1a1d23] border-r border-border p-4 flex flex-col shrink-0">
            <nav className="space-y-1.5">
              {NAV_KEYS.map(({ path, icon, key }) => {
                const active = location === path;
                return (
                  <Link
                    key={path}
                    href={path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-[#111418] text-[#D4AF37] shadow-sm font-semibold"
                        : "text-foreground/75 hover:bg-muted hover:text-foreground"
                    }`}>
                    {(() => {
                      const Icon = icon;
                      return <Icon className={`w-4.5 h-4.5 ${active ? "text-[#D4AF37]" : "text-muted-foreground"}`} />;
                    })()}
                    {tr(key, lang)}
                  </Link>
                );
              })}
              {isAuthenticated && (user?.role === "staff" || user?.role === "admin") && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location === "/admin"
                      ? "bg-[#111418] text-[#D4AF37] shadow-sm font-semibold"
                      : "text-foreground/75 hover:bg-muted hover:text-foreground"
                  }`}>
                  <Package className={`w-4.5 h-4.5 ${location === "/admin" ? "text-[#D4AF37]" : "text-muted-foreground"}`} />
                  Operations queue
                </Link>
              )}
            </nav>

            <div className="mt-auto pt-6 border-t border-border">
              <div className="bg-[#111418]/5 rounded-2xl p-4 border border-[#111418]/10 space-y-2">
                <div className="text-xs font-bold text-[#111418]">Need Help?</div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  WhatsApp support for Dar es Salaam, Nairobi & Kampala.
                </p>
                <a
                  href={`https://wa.me/255763173629?text=${encodeURIComponent("Hi UK Shoppers Africa! I need help with an order. My destination is ")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-xs font-semibold bg-[#111418] text-[#D4AF37] rounded-xl py-2 hover:bg-[#111418]/90 transition-all">
                  {tr("portal.chatWhatsApp", lang)}
                </a>
              </div>
            </div>
          </aside>
        )}

        {/* Content area */}
        <main className="flex-1 bg-[#F2F4F7] dark:bg-background pb-20 md:pb-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* AI shopping assistant */}
      <AssistantChat />

      {/* Mobile bottom bar */}
      {mobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1d23] border-t border-border flex items-center justify-around py-2 shadow-lg">
          {[...NAV_KEYS.slice(0, 4), NAV_KEYS[5]].map(({ path, icon, key }) => {
            const active = location === path;
            const Icon = icon;
            return (
              <Link
                key={path}
                href={path}
                className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-lg text-[10px] sm:text-xs font-medium leading-tight text-center truncate max-w-[20%] ${
                  active ? "text-[#111418] font-bold" : "text-muted-foreground"
                }`}>
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate w-full">{tr(key, lang)}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
