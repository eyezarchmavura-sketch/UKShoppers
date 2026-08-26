import { Link } from "wouter";
import { ExternalLink, Moon, Search, Sun, ArrowLeft, ArrowRight, Store as StoreIcon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { filterStores, storeCategories } from "@/lib/stores";
import { getRetailerUrl } from "@/lib/retailerLinks";
import { getStoreDirectoryFilters } from "@/lib/storeDirectoryQuery";
import { getStoreBrandLogo } from "@/lib/storeBrandAssets";

export default function StoreDirectory() {
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState(() => getStoreDirectoryFilters(window.location.search).searchTerm);
  const [activeCategory, setActiveCategory] = useState(() => getStoreDirectoryFilters(window.location.search).category);
  const visibleStores = filterStores(searchTerm, activeCategory);

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#111418] text-foreground">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#1a1d23]/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="container h-18 sm:h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#111418] flex items-center justify-center text-[#D4AF37] font-bold text-xl shrink-0">UK</div>
            <div className="min-w-0">
              <span className="font-bold text-lg text-[#111418] dark:text-[#F7F4E8] tracking-tight block leading-none">UK Shoppers <span className="text-[#C9A227] dark:text-[#E6C764]">Africa</span></span>
              <span className="hidden sm:block text-[11px] text-muted-foreground font-medium tracking-wide mt-1">Store directory</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher compact />
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Toggle dark mode">
              {theme === "dark" ? <Sun className="w-5 h-5 text-[#D4AF37]" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/add" className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#111418] text-[#D4AF37] px-5 py-2.5 text-sm font-semibold hover:bg-black transition-colors">Request a quote</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[#111418] text-white border-b border-[#D4AF37]/30">
          <div className="container py-12 sm:py-16">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#E6C764] hover:text-white transition-colors"><ArrowLeft className="w-3.5 h-3.5" /> Back to home</Link>
            <div className="mt-6 grid lg:grid-cols-[1.3fr_0.7fr] gap-8 items-end">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E6C764]"><StoreIcon className="w-4 h-4" /> Curated UK retailers</span>
                <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">Find a UK store. Shop with confidence.</h1>
                <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">Explore our supported retailers by category. Open a retailer to browse products, then paste the item link into a staff-reviewed UK Shoppers Africa purchase request.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <p className="text-3xl font-bold text-[#E6C764]">{visibleStores.length}</p>
                <p className="mt-1 text-sm text-white/70">matching stores from our verified catalogue</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-10 sm:py-14">
          <div className="max-w-2xl">
            <label htmlFor="store-search" className="sr-only">Search supported UK stores</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input id="store-search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search Amazon, fashion, beauty, home, electronics…" className="w-full h-14 rounded-2xl border border-border bg-background pl-12 pr-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-[#C9A227]/60" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Store categories">
            {storeCategories.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${activeCategory === category ? "bg-[#111418] text-[#D4AF37]" : "bg-background border border-border text-foreground/75 hover:border-[#C9A227]"}`}>
                {category}
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">{visibleStores.length === 1 ? "1 supported store" : `${visibleStores.length} supported stores`}</p>
            {(searchTerm || activeCategory !== "All") && <button onClick={() => { setSearchTerm(""); setActiveCategory("All"); }} className="font-semibold text-[#A67C00] dark:text-[#E6C764] hover:underline">Clear filters</button>}
          </div>

          {visibleStores.length ? (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {visibleStores.map((store) => {
                const retailerUrl = getRetailerUrl(store.domain);
                const brandLogo = getStoreBrandLogo(store.name);
                return (
                  <a
                    key={store.name}
                    href={retailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${store.name} official UK storefront in a new tab`}
                    title={`Open ${store.name} official UK storefront in a new tab`}
                    className="group relative flex aspect-[1.25] min-h-[132px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] dark:bg-card">
                    <span className="sr-only">{store.name}, {store.category}</span>
                    {brandLogo ? <img src={brandLogo} alt="" className="h-16 w-full max-w-[144px] object-contain transition-transform duration-200 group-hover:scale-105" loading="lazy" /> : <span className="text-3xl font-black text-[#111418]">{store.name.charAt(0)}</span>}
                    <ExternalLink className="absolute bottom-3 right-3 h-4 w-4 text-[#A67C00] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:text-[#E6C764]" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-10 text-center">
              <h2 className="text-lg font-bold">No store matched that search</h2>
              <p className="mt-2 text-sm text-muted-foreground">Try another retailer, department, or category. We can still review any valid UK product link.</p>
              <Link href="/add" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#111418] px-5 py-3 text-sm font-semibold text-[#D4AF37]">Send a product link <ArrowRight className="w-4 h-4" /></Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
