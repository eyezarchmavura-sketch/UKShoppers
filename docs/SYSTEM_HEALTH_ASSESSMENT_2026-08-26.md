# UK Shoppers Africa — System Health Assessment

**Assessment date:** 26 August 2026  
**Scope:** Current shared project state, including the public storefront, authenticated customer/staff flows, seasonal-offers controls, server contracts, database schema, dependencies, runtime logs, and production build.

## Executive assessment

The platform is **functionally healthy in the development environment**. TypeScript is clean, all automated regression tests pass, the reviewed public and protected routes render as expected, and the seasonal-offers schema is present in the database with its evidence-first fields.

The main release gate is a **local production-build resource termination**. `pnpm build` completes module transformation but is terminated by the sandbox while rendering chunks (exit code `143`). This is an environment/resource failure rather than a TypeScript or test failure, but it means the production build still requires confirmation in the managed deployment pipeline before a release is considered verified.

## Verified checks

| Area | Result | Evidence |
|---|---|---|
| Type safety | Pass | `pnpm exec tsc --noEmit` completed successfully after all remediation work. |
| Regression tests | Pass | 10 test files and 37 tests passed. The cart-extraction malformed-JSON log is an expected safe-fallback test, not an unhandled application error. |
| Public experience | Pass | The public landing, directory/discovery, legal, and offers views were visually reviewed at desktop and mobile sizes. |
| Access control | Pass | Representative protected customer and staff routes were reviewed; the staff offers workspace remains behind the intended guard. |
| Seasonal-offers data model | Pass | The `seasonal_offers` table exists and includes source, terms, link-type, verification-time, and verifier fields. |
| Runtime logs | No confirmed application defect | The reviewed development, browser-console, and network logs did not identify a new unhandled production-flow error. |
| Dependency install reproducibility | Improved | pnpm overrides and patch declarations were moved from the ignored package-manifest field into `pnpm-workspace.yaml`. |

## Confirmed fixes applied during this assessment

| Fix | Outcome |
|---|---|
| Removed unused `flutterwave-react-v3` client dependency | Removes an unnecessary payment-client dependency from the runtime footprint. Live Flutterwave handling remains server-side and configuration-gated. |
| Updated `axios` to `1.19.0` | Resolves the audited direct HTTP-client vulnerability reported for the older installed version. |
| Updated `nanoid` to `5.1.16` | Resolves the audited direct identifier-library vulnerability while preserving server and Vite use. |
| Updated `drizzle-orm` to `0.45.2` | Resolves the audited ORM vulnerability; type checks and the full suite pass after the upgrade. |
| Moved pnpm patch/override settings to `pnpm-workspace.yaml` | Removes the repeated warning that the package-manifest `pnpm` field was ignored and makes the Wouter patch plus Tailwind transitive override reproducible. |
| Limited development-only Vite plugins to preview mode | Keeps source-location instrumentation and debug collection out of the production build path. |
| Disabled Vite compressed-size reporting | Avoids a memory-heavy reporting step during production builds. |

## Confirmed release blocker

### Production build is not yet verified

Even after removing compressed-size reporting and excluding development-only plugins, the local sandbox terminates `pnpm build` with exit code `143` during Vite chunk rendering after transforming 6,126 modules. This is the only confirmed functional release blocker from this review.

> **Required action before publishing:** run the managed deployment build after this checkpoint. If it also terminates, reduce client bundle pressure with targeted route-level code splitting and reassess the remaining heavyweight UI dependencies. Do not treat the local development preview as a substitute for a successful production build.

## Dependency and compatibility risks still open

The production audit was reduced from **41 findings (4 high)** to **40 findings (3 high)**. The remaining high-severity paths require deliberate upgrades or replacements rather than unsafe forced overrides.

| Remaining path | Risk | Recommended handling |
|---|---|---|
| `express@4.21.2` → `path-to-regexp@0.1.12` | Audited vulnerable transitive route-matching package | Plan an Express 5 compatibility upgrade or validate a supported transitive-resolution strategy in a separate branch. |
| `streamdown@1.4.0` → `mermaid@11.12.0` → `lodash-es` | The active assistant markdown renderer pulls a flagged transitive dependency | Test Streamdown v2 or replace it with a maintained markdown renderer in a scoped upgrade. |
| `recharts@2.15.x` → `lodash@4.17.21` | The shared chart component remains on an unmaintained major line | Schedule a Recharts 3 migration and visually validate all chart consumers. |
| `react-paystack@6.0.0` with React 19 | Peer-range warning; no test failure observed | Verify live hosted checkout in a sandbox before live payments are enabled. |
| `@builder.io/vite-plugin-jsx-loc` with Vite 7 | Peer-range warning; no preview failure observed | It is now preview-only. Replace or update it if preview instability appears. |

## Intentional configuration blockers, not defects

The following integrations are deliberately not live because their secure provider settings and external verification are still pending:

1. **Stripe Checkout and webhook signing configuration**;
2. **Safaricom and Vodacom callback credentials and verified callback URLs**;
3. **Meta WhatsApp Business Cloud API access token, phone-number ID, webhook verification token, app secret, and recipient configuration**.

The application does not send live WhatsApp messages, process live payment charges, or claim active mobile-money processing while those settings are absent. This is the safe, expected state.

## Priority actions

1. **Release gate:** confirm a successful managed production deployment build; investigate code splitting if it reproduces the exit-143 termination.
2. **Security debt:** plan separate, tested migrations for Express 5, Streamdown 2/replacement, and Recharts 3.
3. **Operations:** begin the four-week manual women-first Verified Store Desk trial before adding retailer data-feed automation.
4. **Integrations:** choose one provider path at a time, enter credentials through secure settings, then implement and test its server-side callback/webhook flow.

## Conclusion

Customer/staff workflows, offer-publishing safeguards, database migrations, access control, and automated regression coverage are in a good working state. The platform is suitable for continued controlled development and staff-led offer curation. A successful production build remains necessary before treating the current revision as release-ready.
