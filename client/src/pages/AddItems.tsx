/* UK Shoppers Africa — verified purchase request intake with cart screenshot assistance. */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, ClipboardCheck, ImagePlus, Link2, Loader2, MapPin, PackagePlus, ShieldCheck, Sparkles, Upload } from "lucide-react";
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

type CartExtraction = {
  retailerName: string;
  currency: "GBP" | "UNKNOWN";
  items: Array<{ name: string; quantity: number; unitPriceGbp: number | null; lineTotalGbp: number | null }>;
  subtotalGbp: number | null;
  shippingGbp: number | null;
  totalGbp: number | null;
  confidence: "high" | "medium" | "low";
  notes: string;
};

const acceptedScreenshotTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

function totalFromExtraction(extraction: CartExtraction) {
  if (extraction.totalGbp !== null) return extraction.totalGbp;
  if (extraction.subtotalGbp !== null) return extraction.subtotalGbp;
  const itemTotal = extraction.items.reduce((sum, item) => sum + (item.lineTotalGbp ?? item.unitPriceGbp ?? 0) * Math.max(item.quantity, 1), 0);
  return itemTotal > 0 ? itemTotal : null;
}

function formatExtractionDetails(extraction: CartExtraction) {
  const items = extraction.items.map((item) => {
    const price = item.lineTotalGbp ?? item.unitPriceGbp;
    return `• ${item.name} — Qty ${item.quantity}${price !== null ? ` — £${price.toFixed(2)}` : " — price not visible"}`;
  });
  return ["AI-extracted cart details — please confirm before submission", ...items, extraction.notes ? `Note: ${extraction.notes}` : ""].filter(Boolean).join("\n");
}

export default function AddItems() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const [productUrl, setProductUrl] = useState(() => new URLSearchParams(window.location.search).get("productUrl") ?? "");
  const [itemDetails, setItemDetails] = useState("");
  const [destination, setDestination] = useState(destinations[0]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [createdRef, setCreatedRef] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<"idle" | "preparing" | "ready" | "uploading" | "submitted">("idle");
  const [extraction, setExtraction] = useState<CartExtraction | null>(null);
  const [estimatedItemPrice, setEstimatedItemPrice] = useState("");
  const fileReader = useRef<FileReader | null>(null);

  const analyzeCartScreenshot = trpc.orders.analyzeCartScreenshot.useMutation({
    onSuccess: (result) => {
      setExtraction(result);
      const total = totalFromExtraction(result);
      setEstimatedItemPrice(total === null ? "" : total.toFixed(2));
      if (result.items.length > 0) {
        setItemDetails((current) => current.trim() ? `${current.trim()}\n\n${formatExtractionDetails(result)}` : formatExtractionDetails(result));
        toast.success(`${result.items.length} cart item${result.items.length === 1 ? "" : "s"} extracted. Please review the editable details below.`);
      } else {
        toast.message("No clear cart items were found. Please enter the item details manually.");
      }
    },
    onError: (error) => toast.error(error.message || "We could not read the screenshot automatically. Please enter the item details manually."),
  });

  const submitRequest = trpc.orders.create.useMutation({
    onSuccess: ({ ref, screenshotUploaded }) => {
      if (screenshotUploaded) {
        setUploadProgress(100);
        setUploadState("submitted");
      }
      setCreatedRef(ref);
      toast.success(screenshotUploaded ? "Cart screenshot uploaded and attached to your request." : "Purchase request submitted for staff review");
    },
    onError: (error) => {
      if (uploadState === "uploading") setUploadState("ready");
      toast.error(error.message || "We could not submit your request. Please try again.");
    },
  });

  useEffect(() => {
    return () => {
      fileReader.current?.abort();
      if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    };
  }, [screenshotPreview]);

  const handleScreenshotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!acceptedScreenshotTypes.has(file.type)) {
      toast.error("Please select a PNG, JPG, or WEBP screenshot.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Screenshots must be smaller than 10 MB.");
      return;
    }

    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
    setScreenshotDataUrl(null);
    setUploadProgress(0);
    setUploadState("preparing");
    setExtraction(null);
    setEstimatedItemPrice("");

    const reader = new FileReader();
    fileReader.current = reader;
    reader.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
    };
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      if (!dataUrl) {
        setUploadState("idle");
        toast.error("We could not prepare that screenshot. Please choose it again.");
        return;
      }
      setScreenshotDataUrl(dataUrl);
      setUploadProgress(100);
      setUploadState("ready");
      if (isAuthenticated) {
        toast.message("Screenshot ready. AI is reading visible cart items and prices…");
        analyzeCartScreenshot.mutate({
          fileName: file.name,
          contentType: file.type as "image/png" | "image/jpeg" | "image/webp",
          dataBase64: dataUrl,
        });
      } else {
        toast.success("Screenshot ready. Sign in to use AI cart extraction or complete the details manually.");
      }
    };
    reader.onerror = () => {
      setUploadState("idle");
      toast.error("We could not read that screenshot. Please choose it again.");
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in before submitting a purchase request.");
      return;
    }
    const hasScreenshot = Boolean(screenshotFile && screenshotDataUrl && uploadState === "ready");
    if (!productUrl.trim() && !hasScreenshot) {
      toast.error("Paste a product link or upload a completed cart screenshot before submitting.");
      return;
    }
    if (!itemDetails.trim() || !deliveryAddress.trim()) {
      toast.error("Add the item details and delivery address before submitting.");
      return;
    }
    if (productUrl.trim()) {
      try {
        new URL(productUrl);
      } catch {
        toast.error("Enter a complete product URL beginning with https://");
        return;
      }
    }

    const screenshotNote = hasScreenshot ? ` [Cart screenshot: ${screenshotFile?.name.slice(0, 120)}]` : "";
    const linkNote = productUrl.trim() ? ` — ${productUrl.trim()}` : " — Manual cart screenshot review";
    const parsedVisibleTotal = Number(estimatedItemPrice);
    const amountGbp = estimatedItemPrice.trim() && Number.isFinite(parsedVisibleTotal) ? `£${parsedVisibleTotal.toFixed(2)}` : "Pending staff review";
    if (hasScreenshot) {
      setUploadProgress(65);
      setUploadState("uploading");
    }
    submitRequest.mutate({
      store: productUrl.trim() ? merchantFromUrl(productUrl) : extraction?.retailerName || "Manual cart screenshot review",
      item: `${itemDetails.trim()}${screenshotNote}${linkNote}`.slice(0, 512),
      destination,
      deliveryAddress: deliveryAddress.trim(),
      amountGbp,
      currencyCode: "GBP",
      requestType: hasScreenshot ? "cart_screenshot" : "product_link",
      screenshot: hasScreenshot && screenshotFile && screenshotDataUrl ? {
        fileName: screenshotFile.name,
        contentType: screenshotFile.type as "image/png" | "image/jpeg" | "image/webp",
        dataBase64: screenshotDataUrl,
      } : undefined,
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
            Reference <strong className="text-foreground">{createdRef}</strong>.             A UK Shoppers Africa staff member will check availability, item variations, shipping, customs requirements, and the confirmed total before a payment request is issued.
          </p>
          {uploadState === "submitted" && <p className="mx-auto mt-4 flex max-w-xl items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 py-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Your cart screenshot was uploaded securely and attached to this request for staff review.</p>}

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
          Send a product link or upload a screenshot of your UK cart. Our team reviews availability and all costs before creating any payment request; no placeholder prices are shown here.
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
          <label htmlFor="product-url" className="text-sm font-semibold">UK product link <span className="font-normal text-muted-foreground">(optional if using a screenshot)</span></label>
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input id="product-url" type="url" value={productUrl} onChange={(event) => setProductUrl(event.target.value)} placeholder="https://www.amazon.co.uk/dp/..." className="pl-9" />
          </div>
          <p className="text-xs text-muted-foreground">Use the specific product or cart link from a UK retailer when available.</p>
        </div>

        <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <ImagePlus className="h-4 w-4" /> Upload a UK cart screenshot
              </div>
              <p className="mt-1 max-w-lg text-xs leading-5 text-muted-foreground">
                Upload a clear screenshot of your basket from any UK store for manual assistance. PNG, JPG, and WEBP files up to 10 MB are supported.
              </p>
            </div>
            <label htmlFor="cart-screenshot" className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-primary/30 bg-background px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5">
              <Upload className="h-4 w-4" /> Choose screenshot
              <input id="cart-screenshot" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleScreenshotChange} className="sr-only" />
            </label>
          </div>

          {uploadState !== "idle" && (
            <div className="mt-4 rounded-xl border border-border bg-background p-3">
              <div className="flex items-center gap-3">
                {screenshotPreview ? <img src={screenshotPreview} alt="Selected cart screenshot preview" className="h-14 w-14 rounded-lg object-cover" /> : <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted"><ImagePlus className="h-5 w-5 text-muted-foreground" /></div>}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-xs font-semibold text-foreground">{screenshotFile?.name}</p>
                    <span className="shrink-0 text-xs font-bold text-primary">{uploadProgress}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Cart screenshot upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={uploadProgress}>
                    <div className={`h-full rounded-full transition-[width] duration-100 ${uploadState === "submitted" || uploadState === "ready" ? "bg-emerald-600" : "bg-primary"}`} style={{ width: `${uploadProgress}%` }} />
                  </div>
                  {uploadState === "preparing" ? (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> Preparing screenshot for secure upload…</p>
                  ) : uploadState === "uploading" ? (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> Uploading screenshot and creating your request…</p>
                  ) : uploadState === "submitted" ? (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Screenshot uploaded successfully and attached to your request.</p>
                  ) : (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Screenshot ready. Add details below and submit for staff review.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {(analyzeCartScreenshot.isPending || extraction) && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-100 p-2 text-amber-800"><Sparkles className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-amber-950">AI cart extraction</p>
                {analyzeCartScreenshot.isPending ? (
                  <p className="mt-1 flex items-center gap-2 text-xs text-amber-900/80"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading visible item names and GBP prices…</p>
                ) : extraction ? (
                  <>
                    <p className="mt-1 text-xs leading-5 text-amber-900/80">{extraction.items.length ? `Found ${extraction.items.length} item${extraction.items.length === 1 ? "" : "s"}${extraction.retailerName ? ` from ${extraction.retailerName}` : ""}. Check and edit the pre-filled details before submission.` : "No readable cart items were found. Add the details manually."}</p>
                    {extraction.items.length > 0 && <ul className="mt-3 space-y-1.5 rounded-xl border border-amber-200 bg-white/80 p-3 text-xs text-amber-950">{extraction.items.slice(0, 5).map((item, index) => <li key={`${item.name}-${index}`} className="flex justify-between gap-4"><span className="min-w-0 truncate">{item.name} <span className="text-amber-800/70">× {item.quantity}</span></span><span className="shrink-0 font-semibold">{item.lineTotalGbp ?? item.unitPriceGbp !== null ? `£${(item.lineTotalGbp ?? item.unitPriceGbp ?? 0).toFixed(2)}` : "Price not visible"}</span></li>)}</ul>}
                    {extraction.notes && <p className="mt-2 text-[11px] text-amber-900/70">{extraction.notes}</p>}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="item-details" className="text-sm font-semibold">Item details</label>
          <Textarea id="item-details" value={itemDetails} onChange={(event) => setItemDetails(event.target.value)} placeholder="Example: Nike Air Max 90, white/black, UK size 9, quantity 1. For screenshots, list the items and preferred variations." maxLength={380} className="min-h-24" required />
          <p className="text-xs text-muted-foreground">Include size, colour, quantity, preferred variation, and any alternatives.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
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
          <div className="space-y-2">
            <label htmlFor="estimated-item-price" className="text-sm font-semibold">Visible cart total <span className="font-normal text-muted-foreground">(GBP, editable)</span></label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground">£</span>
              <Input id="estimated-item-price" inputMode="decimal" value={estimatedItemPrice} onChange={(event) => setEstimatedItemPrice(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="AI will pre-fill" className="pl-7" />
            </div>
            <p className="text-xs text-muted-foreground">An estimate only. Staff verifies the final total.</p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><ClipboardCheck className="h-4 w-4 text-primary" /> Staff review before quote and payment</p>
          <Button type="submit" disabled={submitRequest.isPending || analyzeCartScreenshot.isPending || uploadState === "preparing" || uploadState === "uploading"} className="rounded-full px-6">
            {submitRequest.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting request</> : <><PackagePlus className="mr-2 h-4 w-4" />Submit for quote review</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
