## Switching to the inventory project's public REST endpoint

You've exposed a server-side endpoint on the inventory project:

```
GET https://project--feac0274-c0f1-4b72-9f19-af992b2c0758(-dev).lovable.app/api/public/catalog/products
```

I tested it — it returns clean JSON with the four categories already labeled (`Batteries`, `Inverters`, `Solar Panels`, `Accessories`) and only safe fields (no cost price). This is strictly better than the direct-Supabase approach, so I'm dropping the cross-project DB client entirely.

## Changes in this project

### 1. Remove the old cross-project Supabase client

- Delete `src/integrations/inventory/client.ts`.
- Remove `VITE_INVENTORY_SUPABASE_URL` and `VITE_INVENTORY_SUPABASE_PUBLISHABLE_KEY` from `.env`.

### 2. Add a tiny REST client for the inventory API

New file `src/integrations/inventory/api.ts`:

- Exposes a typed `InventoryProduct` matching the endpoint's response shape (`id, name, category, model, capacity, product_type, warranty, specifications, selling_price, quantity, in_stock, status, created_at`).
- `fetchInventoryProducts()` calls the endpoint and returns `{ products, total }`.
- Base URL comes from `VITE_INVENTORY_API_URL` in `.env`. Default to the dev URL for now (`project--feac0274-...-dev.lovable.app`). You can flip it to the production URL after you publish the inventory project — single env-var change.

### 3. Rewrite the catalog hook

Update `src/hooks/use-inventory-products.ts`:

- Replace the Supabase query with `fetch` to the REST endpoint via TanStack Query (`staleTime: 30s`, `refetchOnWindowFocus: true`).
- Map inventory categories directly to storefront categories:
  - `"Solar Panels"` → `panel`
  - `"Inverters"` → `inverter`
  - `"Batteries"` / `"Batteries/Storage"` → `battery`
  - `"Accessories"` → `accessory`
  - Anything else → `null` (shows up as "Unmapped" in the admin so you can override).
- Parse watts from `capacity` first, then `specifications` as fallback (regex for `kW`/`W`/`kWh`).
- Tags from `specifications` if present, capped at 3.
- Continue merging with the local `storefront_products` overrides table for visibility, image, category override, and sort order. That part of the design stays exactly the same — only the upstream data source changes.

### 4. No DB changes needed

- The local `storefront_products` table (visibility toggles, image uploads, category overrides) stays as-is.
- No GRANT/policy work in the inventory project — your server route handles it.

### 5. UI touch-ups (small)

- Update the admin `/admin/products` page's empty/loading copy to mention "Inventory API" instead of "Inventory DB", and surface the API base URL in a tiny footer note so you can confirm at a glance which environment you're pulling from.
- Everything else (image uploader, toggle, sort order, category override drawer, storefront sections) keeps working unchanged because the merged shape going into the store is identical.

## Verification steps after build

1. Open `/admin/products` → confirm all ~103 products load with category labels.
2. Toggle a Panel, an Inverter, a Battery, and an Accessory visible. Upload an image for one.
3. Open `/` → confirm each item appears in its correct section with the right price and stock.
4. Mark one item out-of-stock upstream (or its qty hits 0) → confirm the "Out of stock" pill renders and the button is disabled.

## One thing to do on your side later

When you publish the inventory project, ping me and I'll flip `VITE_INVENTORY_API_URL` from the `-dev` URL to the stable production URL. Until then the storefront reads from the dev build of the inventory project, which is fine for development but means published storefront → dev inventory. Worth doing the swap before you launch the storefront publicly.

## Out of scope this round

- Real-time updates (current 30s polling is fine).
- Pagination/search on the admin list (we'll add it if the list gets unwieldy past 200+ items).
- Per-product custom descriptions in the storefront (today the admin only overrides visibility, image, category; let me know if you want a `description_override` column too).