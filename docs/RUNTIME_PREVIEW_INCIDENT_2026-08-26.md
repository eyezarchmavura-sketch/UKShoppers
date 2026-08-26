# Runtime Preview Incident — 2026-08-26

## Observed behavior

After the development server restarted following dependency and bundle-graph changes, two independent root-preview captures rendered a blank white page.

## Evidence

- The Vite client log reports repeated pre-transform failures resolving `/src/main.tsx` when the request includes a `?v=` query parameter.
- TypeScript type checking remains clean.
- The bounded production build completes successfully, so this is currently isolated to the development preview entry-point path.
- The HTML entry reference is `/src/main.tsx` and the Vite root is correctly set to the `client` directory, so the next check is the direct development-server response for that module rather than changing either path prematurely.

## Current handling

Treat the preview as unhealthy until the entry module is served correctly. The next debugging step is to compare the HTML entry reference and Vite development configuration, then restart and recheck the public root route. No customer data or production database records were changed by this incident.
