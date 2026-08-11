/* UK Shoppers Africa — payment transaction store + PDF receipt generation.
   Demo transactions persist to localStorage so Payment History and receipts stay consistent. */
import { jsPDF } from "jspdf";
import { DESTINATION_LABELS, gbpWithLocal } from "@/lib/currency";

export interface PaymentTransaction {
  ref: string;
  date: string; // ISO
  gateway: string;
  gatewayLabel: string;
  amountGbp: number;
  localAmount: string;
  destCode: string;
  customer: string;
  status: "completed" | "pending" | "refunded";
  items: string;
}

const KEY = "uksa_transactions";

export function loadTransactions(): PaymentTransaction[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addTransaction(tx: PaymentTransaction): PaymentTransaction[] {
  const list = [tx, ...loadTransactions()];
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
  return list;
}

export function saveLastPayment(payload: {
  tx: PaymentTransaction;
}) {
  localStorage.setItem("uksa_last_payment", JSON.stringify(payload.tx));
  addTransaction(payload.tx);
}

export function getLastPayment(): PaymentTransaction | null {
  try {
    return JSON.parse(localStorage.getItem("uksa_last_payment") ?? "null");
  } catch {
    return null;
  }
}

/** Seed demo history the first time a visitor opens the portal. */
export function ensureDemoHistory(): PaymentTransaction[] {
  const list = loadTransactions();
  if (list.length > 0) return list;
  const seed: PaymentTransaction[] = [
    {
      ref: "UKSA-1751224800-K8T3PL",
      date: new Date(Date.now() - 9 * 86400000).toISOString(),
      gateway: "flutterwave",
      gatewayLabel: "Flutterwave",
      amountGbp: 87.2,
      localAmount: "KSh 155,216",
      destCode: "KE",
      customer: "Amina M.",
      status: "completed",
      items: "Boots skincare order — 3 items, 2.1 kg",
    },
    {
      ref: "UKSA-1748568000-M4RP9X",
      date: new Date(Date.now() - 21 * 86400000).toISOString(),
      gateway: "paystack",
      gatewayLabel: "Paystack",
      amountGbp: 154.9,
      localAmount: "TSh 525,111",
      destCode: "TZ",
      customer: "Amina M.",
      status: "completed",
      items: "Nike x 2 + ASOS dress — consolidated, 3.8 kg",
    },
    {
      ref: "UKSA-1745976000-B7N2QW",
      date: new Date(Date.now() - 44 * 86400000).toISOString(),
      gateway: "bank",
      gatewayLabel: "Bank Transfer",
      amountGbp: 61.5,
      localAmount: "USh 378,225",
      destCode: "UG",
      customer: "Amina M.",
      status: "completed",
      items: "Pharmacy & electronics bundle, 1.6 kg",
    },
  ];
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

const STATUS_LABEL: Record<PaymentTransaction["status"], string> = {
  completed: "Paid",
  pending: "Pending",
  refunded: "Refunded",
};

/** Generate a downloadable PDF receipt for a transaction. */
export function downloadReceipt(tx: PaymentTransaction) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const dark = [17, 20, 24] as const;
  const gold = [212, 175, 55] as const;
  const gray = [110, 116, 125] as const;

  // Header band
  doc.setFillColor(...dark);
  doc.rect(0, 0, 210, 42, "F");
  doc.setFillColor(...gold);
  doc.rect(0, 42, 210, 1.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("UK Shoppers Africa", 18, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text("Powered by INM LTD  ·  Payment Receipt", 18, 26);
  doc.setFontSize(9);
  doc.setTextColor(170, 176, 185);
  doc.text(`Receipt No. ${tx.ref}`, 150, 18);
  doc.text(`Issued ${new Date(tx.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, 150, 24);

  let y = 56;

  const section = (title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...gold);
    doc.text(title.toUpperCase(), 18, y);
    y += 3;
    doc.setDrawColor(230, 230, 230);
    doc.line(18, y, 192, y);
    y += 7;
  };

  const kv = (k: string, v: string, vBold = false) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text(k, 18, y);
    doc.setTextColor(...dark);
    doc.setFont(vBold ? "helvetica" : "helvetica", vBold ? "bold" : "normal");
    doc.text(v, 120, y);
    y += 7;
  };

  section("Payment Details");
  kv("Status", STATUS_LABEL[tx.status]);
  kv("Payment Gateway", tx.gatewayLabel);
  kv("Transaction Reference", tx.ref);
  kv("Customer", tx.customer);

  section("Amount");
  kv("Total (GBP)", `£${tx.amountGbp.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`);
  kv(`Local Amount (${DESTINATION_LABELS[tx.destCode]})`, tx.localAmount, true);

  section("Items");
  const wrapped = doc.splitTextToSize(tx.items, 174);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...dark);
  doc.text(wrapped, 18, y);
  y += wrapped.length * 5 + 4;

  // Order fulfillment promise
  y += 4;
  doc.setFillColor(250, 248, 238);
  doc.roundedRect(18, y, 174, 16, 2, 2, "F");
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  doc.text("Thank you for your payment. Our London team will purchase your items within 24 hours and", 24, y + 6);
  doc.text("you will receive tracking updates via WhatsApp and the customer portal.", 24, y + 11);
  y += 24;

  section("Support");
  kv("WhatsApp", "+44 7903 069064");
  kv("Email", "hello@ukshoppersafrica.com");
  kv("Web", "ukshoppersafrica.com");

  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.text("This is a computer-generated receipt for a payment processed via the UK Shoppers Africa platform.", 18, 282);

  doc.save(`UKSA-Receipt-${tx.ref}.pdf`);
}
