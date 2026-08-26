# Express 5 Migration Verification

**Date:** 2026-08-26  
**Scope:** Security-driven upgrade from Express 4.21.2 to Express 5.2.1.

## Official compatibility basis

Express 5 requires Node.js 18 or later and is a breaking upgrade from Express 4. The official migration guide recommends upgrading the package, running automated tests, and then starting the application to identify unsupported APIs.[1]

The routing guide states that Express 5 uses `path-to-regexp` v8. Wildcards must be named; they are captured as arrays of route segments. A catch-all which must also match `/` is written as `/{*splat}`.[2]

## Applied route changes

| Previous Express 4 route form | Express 5-compatible form | Purpose |
|---|---|---|
| `app.use("*")` | `app.use("/{*splat}")` | Vite and production SPA fallbacks, including the root path. |
| `app.get("/manus-storage/*")` | `app.get("/manus-storage/{*key}")` | Storage-proxy nested object keys, joined safely before constructing the backend request. |

## Validation evidence

The project now uses `express@5.2.1` and `@types/express@5.0.6`. TypeScript passed with no errors. The complete Vitest regression suite passed with **39 tests**, including two new Express 5 named-wildcard tests that verify nested storage keys and root/nested SPA fallback matching. The bounded production build also completed successfully.

## Follow-up

The direct `path-to-regexp` security path is removed through the Express 5 upgrade. The separate Recharts/Lodash dependency path remains a planned, visually tested migration rather than an unsafe forced upgrade.

## References

[1] [Express — Upgrade to Express v5](https://expressjs.com/en/guide/migrating-5/)

[2] [Express 5.x — Routing: wildcard route parameters](https://expressjs.com/en/5x/guide/routing/)
