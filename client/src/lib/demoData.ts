/* GlobalCart prototype — demo data (mock, not real data).
   Brand: deep green #0A3622 / yellow #F6E05E / canvas #F4F7F6. */

export type OrderStatus =
  | "pending_purchase"
  | "purchased"
  | "in_warehouse"
  | "consolidated"
  | "shipped"
  | "customs"
  | "out_for_delivery"
  | "delivered";

export interface DemoOrder {
  id: string;
  store: string;
  items: { name: string; qty: number }[];
  status: OrderStatus;
  total: string;
  totalLocal: string;
  updatedAt: string;
  shippedTo?: string;
  edd?: string;
  trackingNumber?: string;
}

export const demoOrders: DemoOrder[] = [
  {
    id: "GC-48201",
    store: "Nike UK",
    items: [{ name: "Nike Air Max 90 — White/Black, UK 9", qty: 1 }],
    status: "shipped",
    total: "£132.49",
    totalLocal: "₦168,400",
    updatedAt: "2h ago",
    shippedTo: "Lagos, Nigeria",
    edd: "Jul 22",
    trackingNumber: "DHL-9938471026",
  },
  {
    id: "GC-48196",
    store: "Zara UK",
    items: [
      { name: "Linen blend blazer — M", qty: 1 },
      { name: "Cotton tote bag", qty: 2 },
    ],
    status: "in_warehouse",
    total: "£94.00",
    totalLocal: "₦119,500",
    updatedAt: "Yesterday",
  },
  {
    id: "GC-48190",
    store: "Amazon UK",
    items: [
      { name: "Kindle Paperwhite (128GB)", qty: 1 },
      { name: "USB-C charging kit", qty: 1 },
    ],
    status: "purchased",
    total: "£178.98",
    totalLocal: "₦227,500",
    updatedAt: "2 days ago",
  },
  {
    id: "GC-48177",
    store: "Boots UK",
    items: [{ name: "Skincare bundle (x3)", qty: 1 }],
    status: "delivered",
    total: "£61.50",
    totalLocal: "₦78,200",
    updatedAt: "Jul 4",
    shippedTo: "Lagos, Nigeria",
  },
];

export const statusMeta: Record<
  OrderStatus,
  { label: string; tint: string; text: string; dot: string }
> = {
  pending_purchase: {
    label: "Pending purchase",
    tint: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
  purchased: {
    label: "Purchased",
    tint: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
  },
  in_warehouse: {
    label: "In warehouse",
    tint: "bg-purple-100",
    text: "text-purple-800",
    dot: "bg-purple-500",
  },
  consolidated: {
    label: "Consolidated",
    tint: "bg-indigo-100",
    text: "text-indigo-800",
    dot: "bg-indigo-500",
  },
  shipped: {
    label: "Shipped",
    tint: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  customs: {
    label: "In customs",
    tint: "bg-orange-100",
    text: "text-orange-800",
    dot: "bg-orange-500",
  },
  out_for_delivery: {
    label: "Out for delivery",
    tint: "bg-teal-100",
    text: "text-teal-800",
    dot: "bg-teal-500",
  },
  delivered: {
    label: "Delivered",
    tint: "bg-green-100",
    text: "text-green-800",
    dot: "bg-green-600",
  },
};

export interface TrackingStep {
  title: string;
  time: string;
  detail: string;
  done: boolean;
  active?: boolean;
}

export const demoTracking: TrackingStep[] = [
  {
    title: "Purchased",
    time: "Jul 6, 10:12 AM",
    detail: "Items purchased from Nike UK",
    done: true,
  },
  {
    title: "Received at London warehouse",
    time: "Jul 8, 2:45 PM",
    detail: "Parcel checked in — 0.9 kg",
    done: true,
  },
  {
    title: "Customs cleared (UK export)",
    time: "Jul 9, 11:30 AM",
    detail: "Commercial invoice approved",
    done: true,
  },
  {
    title: "Shipped to Lagos",
    time: "Jul 9, 6:20 PM",
    detail: "DHL Express — tracking DHL-9938471026",
    done: true,
    active: true,
  },
  {
    title: "Cleared Nigerian customs",
    time: "Est. Jul 14",
    detail: "Duties prepaid — nothing to pay at delivery",
    done: false,
  },
  {
    title: "Delivered",
    time: "Est. Jul 22",
    detail: "Doorstep delivery, Lagos",
    done: false,
  },
];

export const demoTransactions = [
  { id: "T-8821", label: "Order GC-48201 — Nike UK", amount: "-£132.49", time: "Jul 6", type: "out" },
  { id: "T-8819", label: "Referral reward — Tunde A.", amount: "+₦3,000", time: "Jul 5", type: "in" },
  { id: "T-8812", label: "Wallet deposit — Flutterwave", amount: "+₦120,000", time: "Jul 3", type: "in" },
  { id: "T-8807", label: "Order GC-48196 — Zara UK", amount: "-£94.00", time: "Jul 2", type: "out" },
  { id: "T-8799", label: "Loyalty credit redeemed", amount: "+£5.00", time: "Jun 29", type: "in" },
];

export const demoReferred = [
  { name: "Tunde A.", status: "Active — earned £6.00", date: "Jun 22" },
  { name: "Chioma N.", status: "First order completed", date: "Jul 1" },
  { name: "Emeka O.", status: "Signed up", date: "Jul 5" },
];
