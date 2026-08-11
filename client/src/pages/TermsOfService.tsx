/* UK Shoppers Africa — Terms of Service
   Brand: black ink + gold. Required for Paystack/Flutterwave merchant approval.
   Company details use clearly-labeled placeholders until real registration details are provided. */
import { LegalPage } from "@/components/LegalPage";

const sections = [
  {
    heading: "1. The Service",
    body: "UK Shoppers Africa — Powered by INM LTD provides personal shopping and parcel forwarding services. When you paste a UK product link or provide a cart screenshot, we purchase the item on your behalf, receive it at our London warehouse, inspect and consolidate it, clear customs, and deliver it to your address in Tanzania, Kenya, Uganda, or Rwanda. Alternatively, you may shop directly on UK stores using your free UK warehouse address and forward your parcels to us.",
  },
  {
    heading: "2. Acceptance of Terms",
    body: "By placing an order, making a payment, or using our UK warehouse address, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service. These terms form a contract between you and UK Shoppers Africa — Powered by INM LTD.",
  },
  {
    heading: "3. Pricing, Fees and Payment",
    body: "Prices shown in the calculator are estimates based on the item price, weight, and destination you provide. The final price is confirmed before payment and includes the item cost, UK domestic shipping, our service and inspection fee, air freight, and (where applicable) an estimated duty payment. Payments are collected through our licensed payment providers (Paystack, Flutterwave, mobile-money operators, or bank transfer). Once paid, funds are non-refundable except as provided in our Returns & Refunds Policy. Prices are quoted in GBP with local-currency equivalents shown at indicative exchange rates.",
  },
  {
    heading: "4. Your Responsibilities",
    body: "You agree to provide accurate delivery details, declare the contents of your orders truthfully, ensure that items you order are lawful and permitted for import into your destination country, and not order prohibited items such as weapons, illegal drugs, counterfeit goods, or hazardous materials. You are responsible for any customs restrictions that apply to specific items in your country.",
  },
  {
    heading: "5. Prohibited Use",
    body: "You must not use the service for money laundering, fraud, or any unlawful purpose; attempt to resell services in a way that violates store terms of purchase; or use the platform to harm, harass, or deceive others. We may suspend accounts that violate these rules.",
  },
  {
    heading: "6. Delivery Times",
    body: "Typical door-to-door delivery takes 4–8 business days after your parcel leaves our London warehouse, subject to customs processing, carrier schedules, and local conditions. Time estimates are provided in good faith but are not guarantees.",
  },
  {
    heading: "7. Risk and Insurance",
    body: "Parcels are insured while in our custody and during shipment, as described on our website. Claims for loss or damage must be raised within the period set out in our Returns & Refunds Policy, supported by photographs where requested.",
  },
  {
    heading: "8. Limitation of Liability",
    body: "To the extent permitted by law, our total liability arising from any order is limited to the amount you paid for that order plus the insured value of the parcel. We are not liable for manufacturer defects in purchased goods, delays caused by customs authorities or carriers beyond our control, or indirect losses.",
  },
  {
    heading: "9. Intellectual Property",
    body: "The website, its design, logos, and content are the property of UK Shoppers Africa — Powered by INM LTD. Retailer names and trademarks displayed on our website are used to identify supported stores and remain the property of their respective owners.",
  },
  {
    heading: "10. Changes to These Terms",
    body: "We may update these terms from time to time. Continued use of the service after changes are posted constitutes acceptance of the new terms. Material changes will be announced on our homepage.",
  },
  {
    heading: "11. Governing Law and Contact",
    body: "These terms are governed by the laws applicable to INM LTD's place of registration. Disputes should first be raised with us via WhatsApp at +255 763 173 629, where our team responds quickly. Our registered address and company details are displayed on our homepage.",
  },
];

export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="11 August 2026"
      intro="These Terms of Service set out the agreement between you and UK Shoppers Africa — Powered by INM LTD for the use of our personal shopping and parcel forwarding services."
      sections={sections}
    />
  );
}
