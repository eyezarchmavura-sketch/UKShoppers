# UK Shoppers Africa Custom Domain Cutover Guide

**Prepared for:** UK Shoppers Africa

**Purpose:** Connect the client-owned `ukshoppersafrica.com` domain to the current managed UK Shoppers Africa web application without transferring domain ownership or unintentionally interrupting business email.

## Current position

At the time of review, `https://ukshoppersafrica.com/` is still serving the earlier public shopping website rather than the new managed application. The new application is already deployed on its managed address, `crossport-hayeut38.manus.space`. The domain connection is therefore a **DNS cutover**, not a domain purchase and not a transfer of ownership. The client should retain control of the registrar account throughout the process. [1]

> **Important:** Do not delete the current website or its DNS zone before the new domain has been verified, secured with HTTPS, and checked on both mobile and desktop browsers.

## What the client needs to provide

| Required item | Why it is needed | Safe handling approach |
|---|---|---|
| Access to the domain registrar or DNS host | To read and update the web DNS records for `ukshoppersafrica.com` | The client can make the changes themselves while following this guide; do not send a registrar password in chat. |
| The current DNS record list or a screenshot of it | To preserve email, verification and other non-web records during the cutover | Capture all existing records before changing anything. |
| Confirmation of the active email provider | To avoid deleting MX, SPF, DKIM or DMARC records that keep business email working | Keep all mail-related records unchanged. |
| Authority to change only website records | To safely replace the old public website with the new application | Confirm that the client approves the new application as the primary website. |

## Recommended connection path

### 1. Preserve the current DNS configuration

Log into the registrar or DNS provider that manages `ukshoppersafrica.com`. Before changing anything, export the zone if the provider supports it, or take clear screenshots of every DNS record. Pay particular attention to `MX`, `TXT`, `DKIM`, `SPF`, `DMARC`, verification records, and any subdomains that support email or other services.

Only the records used to send website traffic will be changed. Do **not** remove mail, ownership-verification, or unrelated subdomain records merely because they look unfamiliar.

### 2. Start the connection from the web application’s domain settings

Open the UK Shoppers Africa project’s **Settings → Domains** area in the management interface. Choose **connect an existing domain**, enter `ukshoppersafrica.com`, and select the option to set up both the root domain and `www` if that option is offered.

The platform will display the exact A-record or CNAME-record values required for this specific application. Copy these values exactly. Do not use values copied from another website, a blog post, or an old deployment; the platform-issued values are the authoritative connection targets. The platform may use either an A record or CNAME record depending on the connection it provisions. [1] [2]

### 3. Update only the website DNS records

At the registrar or DNS provider, replace the current web-hosting records for the root domain and, where instructed, create or replace the `www` record with the values supplied by the application’s Domains screen.

| Record area | Action | Do not change |
|---|---|---|
| Root domain (`@` / `ukshoppersafrica.com`) | Add or replace the A or CNAME record exactly as issued by the application | Existing MX and TXT records |
| `www` subdomain | Add the second record exactly as issued; use the platform’s “set up both” flow when available | Email-related subdomains and unrelated services |
| Mail records | Leave unchanged | MX, SPF, DKIM, DMARC, mail verification entries |

If there is an existing root-domain A record serving the older site, it will need to be replaced for the cutover. The official connection guidance also notes that the `www` record must be added or updated separately when applicable. [2]

### 4. Verify ownership and allow HTTPS to finish

Return to **Settings → Domains** and select the verification or connection check. Once the DNS points correctly, the platform will validate the domain and issue SSL/TLS for HTTPS. The platform states that SSL/TLS is configured automatically after a domain is connected. [1]

If `www` shows a certificate mismatch, disconnect and reconnect it using the existing-domain flow, ensuring the option to configure both root and `www` was selected. This is specifically called out in the official guidance. [2]

### 5. Test before announcing the cutover

After the connection shows as active, test the following addresses in a private/incognito browser on both a phone and a desktop computer.

| Check | Expected result |
|---|---|
| `https://ukshoppersafrica.com/` | Loads the new UK Shoppers Africa homepage over HTTPS. |
| `https://www.ukshoppersafrica.com/` | Loads the same new site or redirects cleanly to the chosen primary version. |
| Customer journey | Store categories, Coming Soon sales calendar, verified-deal links, product request, login and staff-only routes behave as expected. |
| Email | Existing business email continues sending and receiving, confirming mail records were preserved. |

Keep the prior hosting account and its backup intact until these checks pass. Once the new site has operated normally for an agreed observation period, the old website can be retained as an archive or formally retired by the client.

## What I need from you before the live DNS change

Please tell me **which provider manages the domain DNS** (for example, GoDaddy, Namecheap, Cloudflare, Hostinger, or the previous website host) and confirm whether the client uses email on `@ukshoppersafrica.com`. You do not need to share a password. Once you open the relevant domain/DNS page, I can guide you record by record using the exact values the project’s Domains screen provides.

## References

[1] [Manus, *Custom Domains: Professionalize Your Brand*](https://manus.im/docs/website-builder/custom-domains)

[2] [Manus Help Center, *How can I connect the website created by Manus to my custom domain?*](https://help.manus.im/en/articles/11711203-how-can-i-connect-the-website-created-by-manus-to-my-custom-domain)

[3] [Current public `ukshoppersafrica.com` homepage reviewed during this task](https://ukshoppersafrica.com/)
