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

/* ---------- Bulk export helpers ---------- */

/** CSV-safely quote a cell (commas/quotes/newlines). */
export function csvCell(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** Download the visible (filtered) transaction list as a CSV file. */
export function downloadTransactionsCsv(txs: PaymentTransaction[]) {
  const header = ["Date", "Reference", "Gateway", "Status", "Amount (GBP)", "Local Amount", "Destination", "Customer", "Items"];
  const rows = txs.map((t) => [
    new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    t.ref,
    t.gatewayLabel,
    STATUS_LABEL[t.status],
    t.amountGbp.toFixed(2),
    t.localAmount,
    DESTINATION_LABELS[t.destCode] ?? t.destCode,
    t.customer,
    t.items,
  ]);
  const lines = [header.map(csvCell).join(","), ...rows.map((r) => r.map(csvCell).join(","))];
  const csv = "\uFEFF" + lines.join("\r\n"); // BOM so Excel opens UTF-8 cleanly
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `UKSA-PaymentHistory-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Download the visible (filtered) transaction list as an A4 PDF report. */
export function downloadTransactionsPdf(txs: PaymentTransaction[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const dark = [17, 20, 24] as const;
  const gold = [212, 175, 55] as const;
  const gray = [110, 116, 125] as const;
  const total = txs.reduce((s, t) => s + t.amountGbp, 0);

  // Header band
  doc.setFillColor(...dark);
  doc.rect(0, 0, 210, 36, "F");
  doc.setFillColor(...gold);
  doc.rect(0, 36, 210, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("UK Shoppers Africa", 18, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text("Payment History Report — Powered by INM LTD", 18, 22);
  doc.setFontSize(9);
  doc.setTextColor(170, 176, 185);
  const issued = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  doc.text(`Issued ${issued}`, 18, 28);
  doc.text(`${txs.length} transaction${txs.length === 1 ? "" : "s"}  ·  Total £${total.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`, 150, 22);
  doc.setFontSize(8);
  doc.text(`Scope: ${txs.length === 0 ? "—" : "matching your current filters"}`, 150, 28);

  // Table header
  let y = 46;
  doc.setFillColor(250, 248, 238);
  doc.rect(0, y - 5.5, 210, 9, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...dark);
  const colX = [16, 46, 88, 124, 140, 162, 182];
  const headers = ["Date", "Gateway", "Reference", "Status", "GBP", "Local", "Dest."];
  headers.forEach((h, i) => doc.text(h, colX[i], y));
  y += 4;
  doc.setDrawColor(212, 175, 55);
  doc.line(18, y, 192, y);
  y += 5;

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  txs.forEach((t, i) => {
    if (y > 275) { doc.addPage(); y = 20; }
    if (i % 2 === 0) {
      doc.setFillColor(247, 247, 249);
      doc.rect(0, y - 3.5, 210, 8, "F");
    }
    doc.setTextColor(110, 116, 125);
    doc.text(new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), colX[0], y);
    doc.setTextColor(...dark);
    doc.text(t.gatewayLabel, colX[1], y);
    const refTrunc = t.ref.length > 20 ? t.ref.slice(0, 18) + "…" : t.ref;
    doc.text(refTrunc, colX[2], y);
    const statusColor = t.status === "completed" ? [16, 120, 70] : t.status === "pending" ? [160, 100, 0] : [180, 40, 40];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(STATUS_LABEL[t.status], colX[3], y);
    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.text(`£${t.amountGbp.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`, colX[4], y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(110, 116, 125);
    doc.text(t.localAmount, colX[5], y);
    doc.text(DESTINATION_LABELS[t.destCode] ?? t.destCode, colX[6], y);
    y += 8;
  });

  // Footer
  y = 286;
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.text("UK Shoppers Africa — computer-generated payment history report. Individual receipts are available in the customer portal.", 18, y);

  doc.save(`UKSA-PaymentHistory-${new Date().toISOString().slice(0, 10)}.pdf`);
}
