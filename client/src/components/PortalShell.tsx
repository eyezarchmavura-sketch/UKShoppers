/* GlobalCart portal shell — brand: deep green sidebar, yellow active marker.
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
  MessageCircleQuestion,
  Settings,
  Bell,
  Search,
  Globe,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/useMobile";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/address", label: "My Address", icon: MapPin },
  { path: "/orders", label: "Orders", icon: Package },
  { path: "/tracking", label: "Tracking", icon: Truck },
  { path: "/wallet", label: "Wallet", icon: Wallet },
  { path: "/referrals", label: "Referrals", icon: Gift },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const mobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const copyAddress = () => {
    navigator.clipboard?.writeText(
      "Ada E., UNIT-7X2, 12 Fulfillment Road, London N17 6AB, United Kingdom",
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-[0_1px_8px_rgba(10,54,34,0.06)]">
        <div className="flex items-center gap-3 px-4 lg:px-6 h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-primary tracking-tight">
              Global<span className="text-[#C9A227]">Cart</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 ml-6 bg-muted rounded-full px-3 py-2 w-72">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search orders, items, tracking…"
              className="bg-transparent text-sm w-full outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:bg-muted rounded-full px-3 py-1.5 transition-colors">
            <Globe className="w-4 h-4" /> EN <ChevronDown className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:bg-muted rounded-full px-3 py-1.5 transition-colors">
            £ GBP <ChevronDown className="w-3 h-3" />
          </div>

          {/* Wallet chip */}
          <Link
            href="/wallet"
            className="hidden sm:flex items-center gap-2 bg-[#F6E05E] text-primary font-semibold text-sm rounded-full px-3.5 py-1.5 hover:brightness-95 transition-all active:scale-[0.97]">
            <Wallet className="w-4 h-4" /> £42.30
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-border rounded-xl shadow-lg p-2 z-50">
                <p className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Notifications
                </p>
                <div className="p-3 hover:bg-muted/60 rounded-lg transition-colors">
                  <p className="text-sm font-medium">Parcel arrived at London warehouse</p>
                  <p className="text-xs text-muted-foreground mt-0.5">GC-48196 · 2h ago</p>
                </div>
                <div className="p-3 hover:bg-muted/60 rounded-lg transition-colors">
                  <p className="text-sm font-medium">Referral reward: ₦3,000 credited</p>
                  <p className="text-xs text-muted-foreground mt-0.5">From Tunde A. · Yesterday</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => toast("Profile options coming soon in the real build")}
            className="flex items-center gap-2 ml-1">
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              AE
            </div>
          </button>
        </div>
      </header>

      {mobile ? (
        <>
          <main className="flex-1 pb-20">{children}</main>
          <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border flex">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}>
                  <Icon className={`w-5 h-5 ${active ? "text-primary" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/settings"
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                ["/settings", "/wallet", "/referrals"].includes(location)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}>
              <Settings className="w-5 h-5" />
              More
            </Link>
          </nav>
        </>
      ) : (
        <div className="flex-1 flex">
          {/* Sidebar */}
          <aside className="hidden lg:flex w-56 shrink-0 flex-col bg-sidebar text-sidebar-foreground py-6 px-3 gap-1 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <Link
              href="/add"
              className="mb-4 mx-1 bg-[#F6E05E] text-primary font-semibold rounded-lg px-4 py-2.5 text-sm flex items-center justify-center gap-2 hover:brightness-95 transition-all active:scale-[0.98]">
              <Package className="w-4 h-4" /> New Purchase
            </Link>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-[#F6E05E]"
                      : "hover:bg-sidebar-accent/60 text-sidebar-foreground/80"
                  }`}>
                  <Icon className="w-4.5 h-4.5" />
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-auto pt-4 border-t border-sidebar-border">
              <div className="px-3 py-2">
                <p className="text-xs text-sidebar-foreground/60 uppercase tracking-wide mb-1">
                  UK Warehouse
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold">UNIT-7X2</span>
                  <button onClick={copyAddress} className="flex items-center gap-1 hover:text-[#F6E05E]">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-sidebar-accent/60 text-sidebar-foreground/80">
                <MessageCircleQuestion className="w-4.5 h-4.5" /> Support
              </Link>
            </div>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      )}
    </div>
  );
}
