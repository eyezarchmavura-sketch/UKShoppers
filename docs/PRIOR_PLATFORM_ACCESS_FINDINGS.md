# Prior Platform Access Findings

**Assessment date:** 19 August 2026

The Gmail conversation with Queen Komanya Pinto contains an authorized prior-platform administrator reference for UK Shoppers Africa. The referenced site is publicly reachable, and its administrator entry point redirects to a standard **WordPress** login screen at `https://ukshoppersafrica.com/wp-login.php`.

This confirms that the prior platform is WordPress-based and has a distinct legacy administration environment. Any credentials located in the private Gmail conversation are treated as confidential access materials and are not copied into project files, source code, task logs, or analysis documents.

## Next evidence steps

The assessment will examine the authorized administrative environment only to understand the existing content, plugins, code-access options, and operational limitations. Public-page review and independent evidence gathering will be kept separate from privileged access findings.

## Authorized administration findings

The authorized account reaches the legacy WordPress dashboard successfully. The environment currently presents the following operational evidence:

| Area | Verified observation | Implication for the replacement platform |
|---|---|---|
| CMS | WordPress 7.0.4 | The existing site is a content-managed website rather than a transaction-focused customer system. |
| Visual construction | Elementor 4.1.4 and a Woodmart child theme | Marketing-page changes are possible, but the current stack is oriented toward page building rather than a purpose-built East African order, quote, payment, and tracking workflow. |
| Content structure | 19 published pages, 6 published posts, layouts, HTML blocks, slides, popups, and floating blocks | Content is fragmented across several WordPress constructs, increasing the risk of inconsistent customer journeys. |
| Commerce and support plugins | Product reviews, Contact Form 7, GS Logos, and Templately are available | The platform has common presentation and contact tools but no confirmed end-to-end parcel-forwarding operations workflow. |
| Maintenance | Dashboard warns that one or more required or recommended plugins need installation, update, or activation | The legacy site needs a maintenance review before any production dependency changes. |

The assessment will not make changes to the legacy environment. Any code, file, or plugin-export access will be inspected only after the user explicitly selects the specific material to review.

## Public-site evidence

Public pages reviewed on 19 August 2026 establish the following customer-facing observations.

| Customer surface | Verified evidence | Client impact | Replacement priority |
|---|---|---|---|
| Homepage | The headline communicates UK-to-Africa shopping and forwarding, but the primary operational action is a WhatsApp order link. | The key purchase journey leaves the website before an order record, quote status, or customer context can be captured. | High |
| Service explanation | The “How it works” page describes both assisted shopping and self-shopping with a UK delivery address. | The proposition is accurate but has no guided request form, delivery-address capture, quote state, customs explanation, or tracking continuation. | High |
| Product catalogue | The site lists products, cart controls, wishlist, comparison, and product prices. | The storefront suggests conventional online checkout, while the business model actually relies on staff quotations and forwarding. This can create pricing and fulfilment ambiguity. | High |
| Homepage quality | Several visible sections reference unrelated everyday-carry products, promotions, and copy marked for replacement. | Unrelated content weakens trust in a cross-border shopping and forwarding brand. | High |
| About page | The main UK-to-Africa explanation is followed by an unrelated everyday-carry FAQ. | Customers receive conflicting signals about the service and may question the brand’s focus. | High |
| Contact page | Contact information and locations display generic placeholder-style details, including `mail@mail.com`, a non-business phone number, and US addresses. | Customers cannot reliably identify a genuine support channel or verified operating locations. | Critical |
| Legal links | Refund, privacy, shipping, and terms links all point to the same privacy-policy URL. | Policy clarity and payment-provider readiness are weakened. | High |

### Evidence URLs

1. https://ukshoppersafrica.com/
2. https://ukshoppersafrica.com/how-it-works/
3. https://ukshoppersafrica.com/about-us/
4. https://ukshoppersafrica.com/contact-us/

These are direct observations from the public pages, not assumptions about the legacy database, customer records, or back-office operations.

## Additional public evidence

| Surface | Verified observation | Customer-experience consequence |
|---|---|---|
| All Stores | The page has a title and site chrome but no visible retailer directory or store cards. | The promise to find UK stores is not fulfilled by a usable discovery tool. |
| UK Deals | The page has a title and site chrome but no deal content. | A navigation item leads to an empty destination. |
| Blog | Public posts are about everyday-carry gear rather than UK-to-Africa shopping, parcel forwarding, customs, or delivery. | Organic content does not answer the service’s real customer questions or reinforce the intended brand. |
| Privacy policy | The page identifies a different Woodmart demonstration website and a template provider rather than UK Shoppers Africa. | The published legal notice is not business-specific and should be replaced before payment or data-collection growth. |

These findings are drawn from the public pages at https://ukshoppersafrica.com/all-stores/, https://ukshoppersafrica.com/uk-deals/, https://ukshoppersafrica.com/blog/, and https://ukshoppersafrica.com/privacy-policy/.
