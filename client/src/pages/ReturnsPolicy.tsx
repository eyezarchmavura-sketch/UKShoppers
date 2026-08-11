/* UK Shoppers Africa — Returns & Refunds Policy
   Brand: black ink + gold. Required for Paystack/Flutterwave merchant approval. */
import { LegalPage } from "@/components/LegalPage";

const sections = [
  {
    heading: "1. Overview",
    body: "Because we purchase goods on your behalf from UK retailers, most items are not returnable to the original store once shipped internationally. However, we stand behind every shipment we handle. This policy explains when you are entitled to a refund, a replacement, or compensation, and how to raise a claim.",
  },
  {
    heading: "2. Damage or Loss in Transit",
    body: "If your parcel arrives damaged or does not arrive at all, raise a claim within 7 days of the expected delivery date by contacting us on WhatsApp at +255 763 173 629 with your order reference and, where possible, photographs of the packaging and item. Valid claims are compensated up to the insured value of the parcel, through a refund or credit to your account.",
  },
  {
    heading: "3. Wrong or Defective Items",
    body: "If an item we purchased is not the item you ordered (wrong product, wrong size sent by the retailer due to our error, or visibly defective on inspection at our warehouse), we will replace it at our cost where the UK retailer accepts the return, or refund the item's cost plus our fee for that item. Claims must be raised within 14 days of delivery. We photograph and inspect every item at our London warehouse before shipping, and these photos are shared with you to resolve disputes quickly.",
  },
  {
    heading: "4. Change of Mind",
    body: "If you change your mind after we have already purchased the item, refunds are not available unless the item can be returned to the UK retailer under their policy, in which case a refund may be issued less any non-recoverable shipping and handling costs. Cancelling before purchase is made is free of charge.",
  },
  {
    heading: "5. Non-Refundable Items",
    body: "Customs duties already paid to authorities, consolidated packaging charges for parcels already flown, and shipping costs for successfully delivered parcels are not refundable except where the shipment itself failed.",
  },
  {
    heading: "6. Refund Method and Timing",
    body: "Refunds are issued to the original payment method where the gateway supports reversals, otherwise as wallet credit or bank transfer. Card and mobile-money refunds typically complete within 5–10 business days depending on your bank or network operator.",
  },
  {
    heading: "7. How to Raise a Claim",
    body: "Message us on WhatsApp at +255 763 173 629 with your order reference, a description of the issue, and photographs where relevant. Our team acknowledges claims promptly and resolves them as quickly as the relevant carrier or retailer allows.",
  },
];

export default function ReturnsPolicy() {
  return (
    <LegalPage
      title="Returns & Refunds Policy"
      lastUpdated="11 August 2026"
      intro="This Returns & Refunds Policy explains when you are entitled to a refund, replacement, or compensation from UK Shoppers Africa — Powered by INM LTD, and how to raise a claim."
      sections={sections}
    />
  );
}
