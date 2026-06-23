The admin system is largely built. This pass closes the remaining gaps you flagged.

## 1. Hidden admin entry point
- Remove any storefront-visible admin link/icon (none should appear in navbar, footer, or mobile menu).
- Keep `/admin/login` reachable only by typing the URL. No discovery from the storefront.
- Verify `_admin` layout still redirects non-admins back to `/admin/login`.

## 2. Product detail page polish (`src/routes/product.$id.tsx`)
- Large primary image + thumbnail gallery (click to swap, keyboard navigable).
- Sections: description, technical specifications table, features list, tags.
- Sale-price display (strike-through original + sale price) when present.
- Stock badge: In stock / Low stock / Out of stock based on `stock_quantity`.
- Sticky right-rail (desktop) with price, quantity stepper, Add to cart, WhatsApp inquiry button (pre-fills message with product title + URL).
- Related products row (same category, excluding current).
- Match existing dark/gold theme — no new colors.

## 3. Admin notifications (`src/routes/_admin.tsx` + dashboard)
- Poll `adminSummary` every 30s (already in place); add a bell icon in the admin top bar showing unseen counts for:
  - new orders since last view (compare against `localStorage` last-seen order id),
  - low-stock items (`stock_quantity < 5`).
- Click bell → dropdown listing recent triggers, "Mark all read" clears the local marker.
- Toast (sonner) when a new order arrives while admin is active.
- No schema changes — purely client-side diffing against the polled summary.

## 4. Checkout flow audit (`src/components/CheckoutModal.tsx` + `src/lib/orders.functions.ts`)
- Confirm all required fields are collected and persisted: full name, email, phone, city, delivery address, permanent address (optional), notes (optional), payment method (cod / bank_transfer / easypaisa / jazzcash).
- Add zod validation on the server fn input; show field-level errors in the modal.
- On success: show order number on the confirmation step, clear cart, write activity_log entry.
- Verify guest checkout works without auth (orders insert via service-role server fn — already the secure pattern).

## 5. Verification
- `bun run build` clean.
- Playwright smoke: open `/product/<id>`, screenshot; open `/admin/login`, sign in, screenshot dashboard with bell.

## Out of scope
- No new tables, no schema migrations.
- No changes to storefront branding, navbar, or theme tokens.
- No header admin icon (per your choice — hidden URL only).
