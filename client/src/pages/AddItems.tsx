/* GlobalCart Add Items — paste URL → simulated fetch → instant quote result card → cart.
   Core conversion feature of the platform per wireframe 2.3. */
import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2, Link2, Check, ShoppingCart, CreditCard, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface FetchedItem {
  name: string;
  store: string;
  storePrice: number;
  weight: number;
  fee: number;
  shipping: number;
}

export default function AddItems() {
  const [, navigate] = useLocation();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState<FetchedItem | null>(null);
  const [cart, setCart] = useState<FetchedItem[]>([]);
  const [localCurrency, setLocalCurrency] = useState(true);

  const fetchQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Paste a product URL first");
      return;
    }
    setLoading(true);
    setFetched(null);
    // Simulated link-parser response (~1.5s)
    setTimeout(() => {
      setFetched({
        name: "Nike Air Max 90 — White/Black",
        store: "Nike UK",
        storePrice: 109.99,
        weight: 0.9,
        fee: 8.0,
        shipping: 14.5,
      });
      setLoading(false);
      toast.success("Quote fetched — store price, fees and shipping all shown upfront");
    }, 1500);
  };

  const addToCart = () => {
    if (!fetched) return;
    setCart((c) => [...c, fetched]);
    toast.success("Added to cart — your all-in quote is locked in");
  };

  const subtotal = cart.reduce((s, i) => s + i.storePrice + i.fee + i.shipping, 0);
  const totalLocal = Math.round(subtotal * 1273); // demo FX rate

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Add Items</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Paste a product link from any supported store. We fetch the price and give you an instant, transparent quote.
        </p>
      </div>

      {/* Paste link */}
      <form onSubmit={fetchQuote} className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center gap-2 border border-input rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/30 bg-background/50">
            <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.nike.com/gb/t/air-max-90-shoe-…"
              className="w-full bg-transparent text-sm py-3 outline-none"
            />
          </div>
          <Button type="submit" disabled={loading} className="rounded-lg px-6 active:scale-[0.97]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
            Fetch
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
          <Store className="w-3.5 h-3.5" />
          Supported: amazon.co.uk · asos.com · zara.com · nike.com · adidas.com · boots.com · ebay.co.uk
        </p>
        {loading && (
          <div className="mt-4 border-t border-border pt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Fetching product details and estimating shipping…
          </div>
        )}
      </form>

      {/* Result card */}
      {fetched && (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-36 h-36 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <ShoppingCart className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-primary uppercase tracking-wide">{fetched.store}</p>
              <h2 className="text-lg font-bold text-foreground mt-0.5">{fetched.name}</h2>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Store price</p>
                  <p className="font-semibold">£{fetched.storePrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Service fee</p>
                  <p className="font-semibold">£{fetched.fee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Est. weight</p>
                  <p className="font-semibold">{fetched.weight} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Est. shipping</p>
                  <p className="font-semibold">£{fetched.shipping.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Estimated total</p>
                  <p className="text-xl font-bold text-primary">
                    {localCurrency ? `≈ ₦${totalLocal.toLocaleString()}` : `£${(fetched.storePrice + fetched.fee + fetched.shipping).toFixed(2)}`}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs font-medium">
                  <Switch checked={localCurrency} onCheckedChange={setLocalCurrency} />
                  Show in ₦ Naira
                </label>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" onClick={addToCart} className="rounded-full border-primary/40 active:scale-[0.97]">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </Button>
                <Button
                  className="rounded-full bg-[#F6E05E] text-primary font-semibold hover:brightness-95 active:scale-[0.97]"
                  onClick={() => {
                    toast.success("Starting checkout with your locked-in quote");
                    navigate("/checkout");
                  }}>
                  <CreditCard className="w-4 h-4" /> Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(10,54,34,0.08)] p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Your Cart
          </h2>
          <span className="text-sm text-muted-foreground">{cart.length} item{cart.length === 1 ? "" : "s"}</span>
        </div>
        {cart.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
            Cart is empty — fetch an item above to see a quote.
          </p>
        ) : (
          <>
            <div className="divide-y divide-border">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.name} ({item.store})</span>
                  </div>
                  <span className="font-semibold shrink-0">
                    £{(item.storePrice + item.fee + item.shipping).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Subtotal incl. fees & shipping</p>
                <p className="font-bold text-primary">
                  {localCurrency ? `≈ ₦${totalLocal.toLocaleString()}` : `£${subtotal.toFixed(2)}`}
                </p>
              </div>
              <Button
                className="rounded-full active:scale-[0.97]"
                onClick={() => navigate("/checkout")}>
                Checkout <CreditCard className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
