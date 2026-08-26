# UK Shoppers Africa — System Health Assessment

**Assessment date:** 26 August 2026  
**Scope:** Current shared project state, including the public storefront, authenticated customer/staff flows, seasonal-offers controls, server contracts, database schema, dependencies, runtime logs, and production build.

## Executive assessment

The platform is **functionally healthy in the development environment**. TypeScript is clean, all automated regression tests pass, the reviewed public and protected routes render as expected, and the seasonal-offers schema is present in the database with its evidence-first fields.

The previously observed local production-build resource termination and blank development preview have both been resolved. The final bounded `pnpm build` completed successfully, and the development server now returns the Vite client entry module as JavaScript rather than falling through to the HTML response. The platform is ready for a managed deployment build, though publishing itself remains a separate approval action.

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
| Production build | Pass | The final bounded `NODE_OPTIONS=--max-old-space-size=2048 pnpm build` completed successfully after route splitting and client-graph reduction. |
| Development preview entry | Pass | `GET /src/main.tsx` returns `200` with `Content-Type: text/javascript`; the live root preview rendered normally after restart. |

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
| Added route-level lazy loading | Splits portal, staff, legal, account, and management pages into smaller production chunks. |
| Replaced Streamdown rendering with safe lightweight text formatting | Removes the Katex/Mermaid-related markdown-renderer path from the active client graph while retaining readable assistant messages. |
| Evaluated the Vite configuration export before middleware-server creation | Ensures the middleware server uses the `client` root and correctly serves `/src/main.tsx`. |
| Removed randomized entry-module queries | Prevents the Vite client entry request from falling through to the HTML catch-all. |

## Resolved release gates

The two issues that blocked release verification during this assessment are resolved:

1. **Production build:** the bounded build now completes successfully after route-level lazy loading, removal of the heavy unused markdown-rendering graph, and Vite build-configuration reductions.
2. **Development preview:** the blank-preview incident was traced to spreading the Vite configuration export without evaluating its function form, which discarded the configured client root. The middleware now evaluates the configuration, and `/src/main.tsx` returns the expected JavaScript module.

> **Before publishing:** use the platform's Publish control only after reviewing this checkpoint. A successful local build is strong release evidence, but it does not itself publish the site.

## Dependency and compatibility risks still open

The production audit is now **8 findings (2 high)**. The remaining high-severity paths require deliberate upgrades or replacements rather than unsafe forced overrides.

| Remaining path | Risk | Recommended handling |
|---|---|---|
| `express@4.21.2` → `path-to-regexp@0.1.12` | Audited vulnerable transitive route-matching package | Plan an Express 5 compatibility upgrade or validate a supported transitive-resolution strategy in a separate branch. |
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

1. **Deployment:** review this checkpoint, then run the managed deployment build through the Publish control when ready.
2. **Security debt:** plan separate, tested migrations for Express 5 and Recharts 3.
3. **Operations:** begin the four-week manual women-first Verified Store Desk trial before adding retailer data-feed automation.
4. **Integrations:** choose one provider path at a time, enter credentials through secure settings, then implement and test its server-side callback/webhook flow.

## Conclusion

Customer/staff workflows, offer-publishing safeguards, database migrations, access control, automated regression coverage, the development preview, and the production build are in a good working state. The platform is suitable for continued controlled development and staff-led offer curation, and it is ready for the user to review and publish through the managed deployment flow when desired.
