/* UK Shoppers Africa — demo data.
   Brand: deep green #0A3622 / warm yellow #F6E05E / canvas #F4F7F6.
   Focus: East Africa (Tanzania, Kenya, Uganda, Rwanda) shopping from UK. */

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
    id: "UKS-84201",
    store: "Nike UK",
    items: [{ name: "Nike Air Max 90 — White/Black, UK 9", qty: 1 }],
    status: "shipped",
    total: "£132.49",
    totalLocal: "TSh 448,500 / KSh 22,400",
    updatedAt: "2h ago",
    shippedTo: "Dar es Salaam, Tanzania",
    edd: "Aug 18",
    trackingNumber: "UKSA-TZ-99384",
  },
  {
    id: "UKS-84196",
    store: "Zara UK",
    items: [
      { name: "Linen blend blazer — M", qty: 1 },
      { name: "Cotton tote bag", qty: 2 },
    ],
    status: "in_warehouse",
    total: "£94.00",
    totalLocal: "KSh 15,900 / USh 465,000",
    updatedAt: "Yesterday",
  },
  {
    id: "UKS-84190",
    store: "Amazon UK",
    items: [
      { name: "Kindle Paperwhite (128GB)", qty: 1 },
      { name: "USB-C charging kit", qty: 1 },
    ],
    status: "purchased",
    total: "£178.98",
    totalLocal: "TSh 605,000 / KSh 30,200",
    updatedAt: "2 days ago",
  },
  {
    id: "UKS-84177",
    store: "Boots UK",
    items: [{ name: "Skincare bundle (x3)", qty: 1 }],
    status: "delivered",
    total: "£61.50",
    totalLocal: "USh 305,000 / TSh 208,000",
    updatedAt: "Aug 4",
    shippedTo: "Kampala, Uganda",
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
    label: "London Warehouse",
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
    label: "Air Shipped to E.A.",
    tint: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  customs: {
    label: "E.A. Customs Cleared",
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
    title: "Order Placed & Verified",
    time: "Aug 10, 10:12 AM",
    detail: "Items purchased from Nike UK by UK Shoppers Africa team",
    done: true,
  },
  {
    title: "Received at London Heathrow Warehouse",
    time: "Aug 11, 2:45 PM",
    detail: "Parcel checked in & weighed — 0.9 kg",
    done: true,
  },
  {
    title: "UK Export & Flight Consolidation",
    time: "Aug 12, 11:30 AM",
    detail: "Direct cargo flight to East Africa scheduled",
    done: true,
  },
  {
    title: "Arrived at Regional Hub (Nairobi / Dar es Salaam)",
    time: "Aug 14, 6:20 PM",
    detail: "Customs clearance & duty processing",
    done: true,
    active: true,
  },
  {
    title: "Local Dispatch",
    time: "Est. Aug 16",
    detail: "Secured courier dispatch to doorstep",
    done: false,
  },
  {
    title: "Delivered",
    time: "Est. Aug 18",
    detail: "Handed over to recipient",
    done: false,
  },
];

export const demoTransactions = [
  { id: "T-8821", label: "Order UKS-84201 — Nike UK", amount: "-£132.49", time: "Aug 10", type: "out" },
  { id: "T-8819", label: "Referral reward — Juma M.", amount: "+£6.00", time: "Aug 8", type: "in" },
  { id: "T-8812", label: "Wallet deposit — M-Pesa / Tigo Pesa", amount: "+£150.00", time: "Aug 5", type: "in" },
  { id: "T-8807", label: "Order UKS-84196 — Zara UK", amount: "-£94.00", time: "Aug 2", type: "out" },
];

export const demoReferred = [
  { name: "Juma M. (Dar es Salaam)", status: "Active — earned £6.00", date: "Aug 1" },
  { name: "Grace W. (Nairobi)", status: "First order completed", date: "Jul 28" },
  { name: "Patrick K. (Kampala)", status: "Signed up", date: "Aug 4" },
];
