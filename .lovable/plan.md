# Live inventory handshake with MTC Energy Collective

The inventory admin lives in a separate Lovable project ("MTC Energy Collective") with its own Supabase backend (`shwqajucathhxbvpbzxo`). Its `public.products` table has: `name, category, company, specifications, quantity, cost_price, selling_price, low_stock_threshold, status`.

The storefront will read **directly** from that database as the single source of truth.

## 1. Open inventory DB for public reads (in the inventory project)

Today the `products` table only allows reads by authenticated users. To let an anonymous storefront read it, I'll add (over there, via a migration):

- `GRANT SELECT ON public.products TO anon;`
- `CREATE POLICY "public read active products" ON public.products FOR SELECT TO anon USING (status = 'active');`

Nothing about admin write access changes. Cost price stays hidden from the storefront by selecting only safe columns.

> Note: I can only edit files in the inventory project if you switch to it, or I can hand you the exact SQL to paste. The rest below is all in **this** storefront project.

## 2. Add a second Supabase client for the inventory DB

New file `src/integrations/inventory/client.ts` — a publishable-key Supabase client pointing at `https://shwqajucathhxbvpbzxo.supabase.co`. URL + anon key go into `.env` as `VITE_INVENTORY_SUPABASE_URL` / `VITE_INVENTORY_SUPABASE_PUBLISHABLE_KEY` (anon keys are safe in the client bundle).

## 3. Fetch + map inventory rows to the storefront `Product` shape

New hook `src/hooks/use-inventory-products.ts` using TanStack Query:

- `select('id, name, category, company, specifications, quantity, selling_price, low_stock_threshold, status')`
- filter `status = 'active'`
- map each row to the existing `Product` type:
  - `id` ← uuid
  - `name`, `series` ← company
  - `category` ← normalized to `"panel" | "inverter" | "battery"` (substring match on inventory category text; rows that don't match are dropped)
  - `watts` ← parsed from `specifications` (regex `(\d+)\s*W`) when present
  - `tags` ← split from specifications (comma/semicolon), trimmed, capped at 3
  - `image` ← local fallback by category (`panel.jpg` / `inverter.jpg` / `battery.jpg`) so we don't break the UI; later we can add an `image_url` column upstream
- expose `price` (`selling_price`) and `stock` (`quantity`) alongside the product

## 4. Wire storefront sections to live data

Replace static imports from `src/data/products.ts` in:

- `src/components/PanelsSection.tsx`
- `src/components/InvertersSection.tsx` (split hybrid vs on-grid by tag/spec text)
- `src/components/BatteriesSection.tsx` (split IP65 vs IP21 by tag/spec text)
- `src/routes/product.$id.tsx`
- `src/components/Hero.tsx` / anywhere else pulling from `allProducts`

Each section uses the hook, shows a skeleton while loading, and an empty-state if the upstream returns nothing.

`src/data/products.ts` stays only as a type re-export + image fallbacks; the hardcoded arrays go away.

## 5. Out-of-stock behavior

In `ProductCard` + product detail page:

- When `stock <= 0`: show an "Out of stock" pill (replaces the category accent), and render the "Add to system" button **disabled** with label "Out of stock".
- When `0 < stock <= low_stock_threshold`: small "Only N left" hint.
- Cart `add()` ignores out-of-stock items defensively.

Pricing on the cards/detail uses the live `selling_price` (PKR) from inventory instead of the derived `priceFor()` helper.

## 6. Refresh cadence

TanStack Query with `staleTime: 30s`, `refetchOnWindowFocus: true`. That keeps stock/price visibly fresh without hammering the DB.

---

## Technical notes

- The storefront's own `/admin/products` page (this project's `products` table) becomes unused for the storefront read path. We can either (a) leave it as-is for now, (b) point it at the inventory DB too in a follow-up, or (c) remove it. **Default: leave it untouched this round** — say the word if you'd rather I deprecate or repurpose it.
- No service-role keys leave either project. All cross-project access is anon + RLS-scoped to `status = 'active'`.
- Cart `Product.id` becomes the inventory UUID. Any in-flight carts using the old slug IDs (e.g. `mustang-595`) will silently drop on next load — acceptable for a dev cutover.
- Images: inventory has no image column today. Falling back per category is a temporary measure; the clean follow-up is to add `image_url text` upstream and surface a thumbnail uploader in the inventory admin.
