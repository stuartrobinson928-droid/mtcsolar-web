## What's actually wrong

Local `bun run build` and `bun run build:dev` both succeed right now, so there is no syntax/typecheck error breaking the build today. The real bug introduced with the admin work is a **server-only module leaking into the client bundle** — exactly the class of issue that intermittently breaks Lovable's publish pipeline and causes runtime 500s on the deployed site even when local builds pass.

### The leak

`src/lib/orders.functions.ts` does this at the top of the file:

```ts
import { supabaseAdmin } from "@/integrations/supabase/client.server";
```

That module is imported by `src/components/CheckoutModal.tsx` — a public storefront component. Because the import is at module top-level (not inside a `.handler()` body), the code-splitter cannot strip `client.server` from the client chunk. `client.server.ts` is supposed to be server-only (service-role key, admin access). The sibling file `src/lib/products.functions.ts` already follows the correct pattern (dynamic `await import(...)` inside the handler).

This is the bug to fix. Everything else in the admin work is fine.

## Fix

Apply the same pattern `products.functions.ts` uses, in `src/lib/orders.functions.ts`:

1. Remove the top-level `import { supabaseAdmin } from "@/integrations/supabase/client.server"`.
2. In `createOrder.handler`, `await import("@/integrations/supabase/client.server")` once at the top of the handler and use the returned `supabaseAdmin` for the orders/order_items/activity_log writes.
3. In `updateOrderStatus.handler`, do the same dynamic import for the single `activity_log` insert (the status update itself already goes through `context.supabase`, which is correct).
4. `listOrders` already uses `context.supabase` — no change needed.

## Notes on other things the user might be thinking of

- The hydration warning in the console (`body __processed_86f0d2b6…="true"`) is from a browser extension mutating `<body>` before React hydrates. It is not caused by our code and not a build failure.
- No other `.functions.ts` file has the same leak; `products.functions.ts` is already correct.
- No route files use `src/pages/`, no missing imports, no duplicate `/` routes.

After this fix the codebase will be back to the clean import-graph contract that keeps publish stable for future features.