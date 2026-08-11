/* UK Shoppers Africa — Privacy Policy
   Brand: black ink + gold. Required for Paystack/Flutterwave merchant approval.
   Company details use clearly-labeled placeholders until real registration details are provided. */
import { LegalPage } from "@/components/LegalPage";

const sections = [
  {
    heading: "1. Who We Are",
    body: "UK Shoppers Africa — Powered by INM LTD (\"we\", \"us\", \"our\") operates a personal shopping and parcel forwarding service that purchases goods from UK retailers on your behalf and delivers them to customers in Tanzania, Kenya, Uganda and Rwanda. Our registered office address and company registration number are displayed on our homepage and available on request. This Privacy Policy explains what information we collect, why we collect it, and how we protect it.",
  },
  {
    heading: "2. Information We Collect",
    body: "When you use our website or services we may collect: (a) identity information such as your name, phone number, email address, and delivery address in East Africa; (b) payment information such as mobile-money numbers and bank details required to process and reconcile payments through our licensed payment providers; (c) transaction data including order references, item descriptions, amounts, and delivery records; and (d) technical information such as your device type and browser when you visit our website. We do not store full card numbers — card processing is handled directly by our licensed payment processors.",
  },
  {
    heading: "3. How We Use Your Information",
    body: "We use your information to process your orders, arrange purchase and shipping, clear customs, deliver parcels, send delivery updates (including via WhatsApp where you have provided a number), handle refunds and disputes, comply with legal obligations, and improve our services. We do not sell your personal information to third parties.",
  },
  {
    heading: "4. Payment Processing",
    body: "Payments are processed by licensed third-party providers (Paystack, Flutterwave, and mobile-money operators) under their own privacy policies. These providers collect the payment details required to complete your transaction and apply industry-standard encryption. We receive confirmation of payment and the reference needed to match your order, but not your full card details.",
  },
  {
    heading: "5. How We Protect Your Data",
    body: "Our website uses encrypted connections (HTTPS), access to personal information is restricted to staff who need it, and demo/test data is clearly separated from production data. Order records are retained for the period required by applicable tax and consumer-protection law, after which they are securely deleted.",
  },
  {
    heading: "6. Cookies and Local Storage",
    body: "Our website uses minimal local storage in your browser to remember your language preference, theme choice, and (where applicable) your most recent payment so that receipts can be downloaded again. We do not use invasive cross-site tracking for advertising purposes.",
  },
  {
    heading: "7. WhatsApp Communications",
    body: "With your consent we send order and delivery updates to your WhatsApp number. You can opt out of WhatsApp updates at any time by telling us through the same number, and you will continue to receive essential transaction notifications through your account.",
  },
  {
    heading: "8. Your Rights",
    body: "You have the right to request access to, correction of, or deletion of your personal information, and to withdraw consent to marketing communications at any time. Requests can be made via WhatsApp at +255 763 173 629 and will be handled within a reasonable period.",
  },
  {
    heading: "9. Cross-Border Data Transfers",
    body: "Because our service involves shipping from the United Kingdom to East Africa, some order information is processed in both the UK and the destination country, solely to fulfil your order and comply with customs requirements.",
  },
  {
    heading: "10. Contact Us",
    body: "Questions about this Privacy Policy can be directed to UK Shoppers Africa — Powered by INM LTD via WhatsApp at +255 763 173 629 or through the contact details displayed on our homepage.",
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="11 August 2026"
      intro="This Privacy Policy describes how UK Shoppers Africa — Powered by INM LTD collects, uses, and protects your personal information when you use our personal shopping and parcel forwarding services."
      sections={sections}
    />
  );
}
