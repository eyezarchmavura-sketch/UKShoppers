import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, ClipboardCheck, Link2, Loader2, MapPin, PackagePlus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const destinations = [
  "Dar es Salaam, Tanzania",
  "Nairobi, Kenya",
  "Kampala, Uganda",
  "Kigali, Rwanda",
  "Bujumbura, Burundi",
];

function merchantFromUrl(value: string) {
  try {
    const host = new URL(value).hostname.replace(/^www\./, "");
    return host || "UK retailer";
  } catch {
    return "UK retailer";
  }
}

export default function AddItems() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [productUrl, setProductUrl] = useState("");
  const [itemDetails, setItemDetails] = useState("");
  const [destination, setDestination] = useState(destinations[0]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [createdRef, setCreatedRef] = useState<string | null>(null);

  const submitRequest = trpc.orders.create.useMutation({
    onSuccess: ({ ref }) => {
      setCreatedRef(ref);
      toast.success("Purchase request submitted for staff review");
    },
    onError: (error) => toast.error(error.message || "We could not submit your request. Please try again."),
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in before submitting a purchase request.");
      return;
    }
    if (!productUrl.trim() || !itemDetails.trim() || !deliveryAddress.trim()) {
      toast.error("Add the product link, item details, and delivery address before submitting.");
      return;
    }
    try {
      new URL(productUrl);
    } catch {
      toast.error("Enter a complete product URL beginning with https://");
      return;
    }

    submitRequest.mutate({
      store: merchantFromUrl(productUrl),
      item: `${itemDetails.trim()} — ${productUrl.trim()}`,
      destination,
      deliveryAddress: deliveryAddress.trim(),
      amountGbp: "Pending staff review",
      currencyCode: "GBP",
    });
  };

  if (createdRef) {
    return (
      <div className="mx-auto max-w-2xl p-4 lg:p-8">
        <section className="rounded-2xl border border-primary/25 bg-primary/5 p-6 text-center sm:p-10">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Request received</p>
          <h1 className="mt-2 font-display text-2xl font-bold text-primary">Your purchase request is in the queue</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Reference <strong className="text-foreground">{createdRef}</strong>. A UK Shoppers Africa staff member will check availability, item variations, shipping, customs requirements, and the confirmed total before a payment request is issued.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => navigate("/orders")} className="rounded-full px-6">Track this request</Button>
            <Button variant="outline" onClick={() => setCreatedRef(null)} className="rounded-full px-6">Submit another item</Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 lg:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Personal shopping request</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-primary">Request a verified UK purchase quote</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Send the exact product link and your delivery details. Our team reviews availability and all costs before creating any payment request; no placeholder prices are shown here.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-5 text-card-foreground sm:p-6">
        <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Your request is reviewed by a person. A payment link is issued only after our team confirms the item, destination, and final payable amount.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="product-url" className="text-sm font-semibold">UK product link</label>
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="product-url" type="url" value={productUrl} onChange={(event) => setProductUrl(event.target.value)} placeholder="https://www.amazon.co.uk/dp/..." className="pl-9" required />
          </div>
          <p className="text-xs text-muted-foreground">Use the specific product or cart link from a UK retailer.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="item-details" className="text-sm font-semibold">Item details</label>
          <Textarea id="item-details" value={itemDetails} onChange={(event) => setItemDetails(event.target.value)} placeholder="Example: Nike Air Max 90, white/black, UK size 9, quantity 1." maxLength={380} className="min-h-24" required />
          <p className="text-xs text-muted-foreground">Include size, colour, quantity, preferred variation, and any alternatives.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-semibold">Delivery destination</label>
            <select id="destination" value={destination} onChange={(event) => setDestination(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
              {destinations.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="delivery-address" className="text-sm font-semibold">Delivery address</label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="delivery-address" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} placeholder="Street, area, city" className="pl-9" minLength={8} maxLength={512} required />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><ClipboardCheck className="h-4 w-4 text-primary" /> Staff review before quote and payment</p>
          <Button type="submit" disabled={submitRequest.isPending} className="rounded-full px-6">
            {submitRequest.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting request</> : <><PackagePlus className="mr-2 h-4 w-4" />Submit for quote review</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
