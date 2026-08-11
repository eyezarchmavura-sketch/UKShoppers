/* UK Shoppers Africa Add Items — paste URL OR upload shopping cart screenshot */
import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2, Link2, Check, ShoppingCart, CreditCard, Store, Upload, Image as ImageIcon } from "lucide-react";
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
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const fetchQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Paste a product URL first");
      return;
    }
    setLoading(true);
    setFetched(null);
    setTimeout(() => {
      setFetched({
        name: "Nike Air Max 90 — White/Black, UK 9",
        store: "Nike UK",
        storePrice: 109.99,
        weight: 0.9,
        fee: 8.0,
        shipping: 14.5,
      });
      setLoading(false);
      toast.success("Quote fetched successfully!");
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadedFile(file.name);
    setTimeout(() => {
      setUploading(false);
      setFetched({
        name: `Cart Screenshot (${file.name}) — 3 items`,
        store: "UK Retailer (Manual Quote)",
        storePrice: 145.00,
        weight: 1.4,
        fee: 10.0,
        shipping: 18.5,
      });
      toast.success("Screenshot uploaded! Our London team will verify items and prepare your manual quote.");
    }, 1500);
  };

  const addToCart = () => {
    if (!fetched) return;
    setCart((c) => [...c, fetched]);
    toast.success("Added to cart — your all-in quote is locked in");
  };

  const subtotal = cart.reduce((s, i) => s + i.storePrice + i.fee + i.shipping, 0);
  const totalLocal = Math.round(subtotal * 3400); // TSh conversion demo

  return (
    <div className="p-4 lg:p-8 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-primary">Add UK Items & Cart Screenshots</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Paste any UK product link OR upload a screenshot of your basket/cart from Amazon UK, ASOS, Zara, etc. for manual quoting.
        </p>
      </div>

      {/* Tabs / Two Options */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Option 1: Paste Link */}
        <form onSubmit={fetchQuote} className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-[#0A3622]">
            <Link2 className="w-5 h-5 text-[#C9A227]" /> Option 1: Paste UK Product Link
          </div>
          <p className="text-xs text-muted-foreground">
            Paste any link from supported UK stores for an instant automated quote.
          </p>
          <div className="flex gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.amazon.co.uk/dp/..."
              className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3622]"
            />
            <Button type="submit" disabled={loading} className="rounded-xl px-5 bg-[#0A3622] text-[#F6E05E]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch"}
            </Button>
          </div>
        </form>

        {/* Option 2: Upload Screenshot */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 font-bold text-[#0A3622]">
            <Upload className="w-5 h-5 text-[#C9A227]" /> Option 2: Upload Cart Screenshot
          </div>
          <p className="text-xs text-muted-foreground">
            Screenshot your basket from any UK store and upload it here for personal shopper review.
          </p>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-[#0A3622] transition-colors bg-[#F4F7F6]">
            {uploading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#0A3622]" /> Uploading & reviewing screenshot...
              </div>
            ) : (
              <>
                <ImageIcon className="w-6 h-6 text-[#0A3622] mb-1" />
                <span className="text-xs font-semibold text-[#0A3622]">Click to upload screenshot</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG up to 10MB</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Result card */}
      {fetched && (
        <div className="bg-white rounded-2xl shadow-lg border border-border p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-40 h-40 rounded-2xl bg-[#0A3622]/5 flex items-center justify-center shrink-0 border border-[#0A3622]/10">
              <ShoppingCart className="w-12 h-12 text-[#0A3622]" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-2.5 py-0.5 rounded-full">
                  {fetched.store}
                </span>
                <h2 className="text-lg font-bold text-foreground mt-1.5">{fetched.name}</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm bg-[#F4F7F6] p-4 rounded-xl">
                <div>
                  <p className="text-muted-foreground text-[11px]">Item Price</p>
                  <p className="font-bold text-[#0A3622]">£{fetched.storePrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Service Fee</p>
                  <p className="font-bold text-[#0A3622]">£{fetched.fee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Est. Weight</p>
                  <p className="font-bold text-[#0A3622]">{fetched.weight} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px]">Air Shipping</p>
                  <p className="font-bold text-[#0A3622]">£{fetched.shipping.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Total Estimated Cost (Duties Prepaid)</p>
                  <p className="text-2xl font-bold text-[#0A3622]">
                    £{(fetched.storePrice + fetched.fee + fetched.shipping).toFixed(2)}
                  </p>
                  <p className="text-xs font-semibold text-[#C9A227]">≈ TSh 448,500 / KSh 22,400</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={addToCart} className="rounded-full border-[#0A3622]/30">
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success("Proceeding to checkout with locked quote");
                      navigate("/checkout");
                    }}
                    className="rounded-full bg-[#0A3622] text-[#F6E05E] hover:bg-[#0A3622]/90 font-semibold px-6">
                    Proceed to Checkout <CreditCard className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[#0A3622] flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#C9A227]" /> Active Cart ({cart.length} items)
          </h2>
          {cart.length > 0 && (
            <span className="font-bold text-[#0A3622]">
              £{cart.reduce((s, i) => s + i.storePrice + i.fee + i.shipping, 0).toFixed(2)}
            </span>
          )}
        </div>
        {cart.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">
            Your cart is empty. Paste a link or upload a cart screenshot above to start shopping.
          </p>
        ) : (
          <div className="space-y-3">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-[#F4F7F6] rounded-xl text-sm">
                <div>
                  <p className="font-semibold text-[#0A3622]">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.store}</p>
                </div>
                <p className="font-bold text-[#0A3622]">
                  £{(item.storePrice + item.fee + item.shipping).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="pt-2 flex justify-end">
              <Button
                onClick={() => navigate("/checkout")}
                className="rounded-full bg-[#0A3622] text-[#F6E05E] font-semibold px-8">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
