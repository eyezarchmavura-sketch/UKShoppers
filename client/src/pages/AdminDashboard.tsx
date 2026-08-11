/* UK Shoppers Africa — Internal Admin Operations Dashboard for Isaac Mavura & Team */
import { useState } from "react";
import { Link } from "wouter";
import {
  Package,
  Users,
  Truck,
  DollarSign,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  FileText,
  RefreshCw,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AdminOrder {
  id: string;
  client: string;
  destination: string;
  store: string;
  item: string;
  amountGBP: number;
  status: string;
  date: string;
}

const initialOrders: AdminOrder[] = [
  { id: "UKS-84201", client: "Amina Mohamed (Dar es Salaam)", destination: "Tanzania", store: "Nike UK", item: "Nike Air Max 90", amountGBP: 132.49, status: "Air Shipped to E.A.", date: "Aug 10, 2026" },
  { id: "UKS-84196", client: "Juma Juma (Nairobi)", destination: "Kenya", store: "Zara UK", item: "Linen Blazer", amountGBP: 94.00, status: "London Warehouse", date: "Aug 9, 2026" },
  { id: "UKS-84190", client: "Grace Wanjiku (Kampala)", destination: "Uganda", store: "Amazon UK", item: "Kindle Paperwhite", amountGBP: 178.98, status: "Pending Purchase", date: "Aug 8, 2026" },
  { id: "UKS-84177", client: "Patrick Kagame (Kigali)", destination: "Rwanda", store: "Boots UK", item: "Skincare Bundle", amountGBP: 61.50, status: "Delivered", date: "Aug 4, 2026" },
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const updateStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order ${id} milestone updated to: ${newStatus}`);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === "All" || o.status === filter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.item.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F2F4F7] font-sans">
      {/* Top Admin Header */}
      <header className="bg-[#111418] text-white sticky top-0 z-50 shadow-md">
        <div className="container flex items-center justify-between h-20 px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#111418] flex items-center justify-center font-bold text-lg">
              EA
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">
                UK Shoppers <span className="text-[#D4AF37]">Africa</span> — Operations Hub
              </h1>
              <p className="text-xs text-white/70 mt-1">Internal Team Dashboard (Isaac Mavura & Staff)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-semibold text-[#D4AF37] hover:underline">
              View Public Website
            </Link>
            <Link href="/portal" className="text-xs font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors">
              Client Portal View
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
              <span>Active Orders</span>
              <Package className="w-5 h-5 text-[#111418]" />
            </div>
            <div className="text-3xl font-bold text-[#111418] mt-2">24</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">+18% vs last week</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
              <span>London Warehouse</span>
              <Truck className="w-5 h-5 text-[#C9A227]" />
            </div>
            <div className="text-3xl font-bold text-[#111418] mt-2">12 Parcels</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting consolidation flight</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
              <span>East Africa Hubs</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-[#111418] mt-2">4 Countries</div>
            <p className="text-xs text-muted-foreground mt-1">TZ, KE, UG, RW</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
              <span>Monthly Volume</span>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-[#111418] mt-2">£18,450</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Fully cleared & insured</p>
          </div>
        </div>

        {/* Orders Management Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-border p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#111418]">Customer Purchase Requests & Shipments</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Update tracking milestones instantly. Changes sync with customer WhatsApp notifications and client portals.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search order ID, client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#111418]"
                />
              </div>
              <Button
                onClick={() => toast.success("Exported operational report to CSV")}
                variant="outline"
                className="rounded-xl">
                Export Report
              </Button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["All", "Pending Purchase", "London Warehouse", "Air Shipped to E.A.", "Delivered"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  filter === f
                    ? "bg-[#111418] text-[#D4AF37] shadow-sm"
                    : "bg-[#F2F4F7] text-foreground/75 hover:bg-muted"
                }`}>
                {f}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4 whitespace-nowrap">Order ID</th>
                  <th className="py-3 px-4">Client & Destination</th>
                  <th className="py-3 px-4">Store & Item</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Current Milestone</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#111418] whitespace-nowrap">{o.id}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-foreground">{o.client}</div>
                      <div className="text-xs text-muted-foreground">{o.destination}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-foreground">{o.item}</div>
                      <div className="text-xs text-muted-foreground">{o.store}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#111418]">£{o.amountGBP.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          o.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : o.status === "Air Shipped to E.A."
                            ? "bg-blue-100 text-blue-800"
                            : o.status === "London Warehouse"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#111418]">
                        <option value="Pending Purchase">Pending Purchase</option>
                        <option value="London Warehouse">London Warehouse</option>
                        <option value="Air Shipped to E.A.">Air Shipped to E.A.</option>
                        <option value="Customs Cleared">Customs Cleared</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
