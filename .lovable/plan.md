# MTC Solar — Admin System + Guest Checkout

This is a large addition. To do it properly we need a real backend (auth, database, file storage). I'll enable **Lovable Cloud** (no external setup) and build everything on top of it. The existing storefront design, theme, and animations stay untouched.

## 1. Backend (Lovable Cloud)

Tables:
- `products` — image, gallery, title, category, brand, model, description, specs (jsonb), features (jsonb), price, sale_price, stock, status (active/out_of_stock/draft/hidden), featured, tags, created_at
- `orders` — order_number, customer name/email/phone, city, delivery_address, permanent_address, notes, payment_method, total_amount, status (pending/processing/confirmed/shipped/delivered/cancelled), created_at
- `order_items` — order_id, product_id, name snapshot, qty, unit_price, line_total
- `user_roles` — `(user_id, role)` with `app_role` enum (`admin`, `user`) + `has_role()` security-definer function
- `activity_log` — type, message, meta, created_at (for "Recent Activity")
- Storage bucket `product-images` (public read, admin write)

RLS:
- `products`: public read of non-hidden/non-draft; admin full write
- `orders` / `order_items`: insert allowed for anyone (guest checkout); read/update admin-only
- `user_roles`: admin-only
- `activity_log`: admin-only read; insert by triggers/server fns

## 2. Admin Account

Hardcoding a plaintext admin password in code would be insecure. Instead:
- The first time anyone signs up with `Awaismalik.mtc1@gmail.com`, a DB trigger automatically assigns the `admin` role.
- The user signs up once with the password they want (we can pre-seed `awaismalik.mtc1@` if you confirm, but the password lives only in Supabase Auth — never in the repo).
- All future logins use Supabase Auth normally. Email confirmation will be disabled so login works immediately.

## 3. Routes

```
/                       storefront (unchanged)
/product/$id            unchanged
/checkout               guest checkout page (Name/Email/Phone/City/Address/Permanent Address/Notes + payment method: COD, Bank Transfer, EasyPaisa, JazzCash)
/admin/login            admin sign-in
/_admin                 layout — beforeLoad checks has_role(admin), else redirect /admin/login
/_admin/dashboard       overview cards + recent orders + recent activity
/_admin/products        table, add/edit/delete (modal forms), image upload to storage bucket
/_admin/orders          table with status badges + drill-down dialog to view items and change status
```

The current Navbar/CartDrawer/Hero/Footer/SideNav stay exactly as they are. The admin area is a parallel section with its own minimal shell (sidebar nav + topbar) styled with the same Slate Navy + Gold tokens already in `src/styles.css`.

## 4. Checkout Flow

`CheckoutModal` is replaced by a `/checkout` route (better UX for the required fields). On submit:
1. Insert `orders` row + `order_items` rows via a `createServerFn` using `supabaseAdmin` (guest-safe).
2. Insert `activity_log` row "New order #1234".
3. Show animated success modal with order number and "Download Invoice" (client-side PDF via `jspdf`).
4. Clear the cart.

## 5. Notifications

In-app only (no email/SMS infra): a bell icon in the admin topbar polls `orders` + `activity_log` every 30s and shows unread badges for new orders, status changes, and low stock (`stock < 5`).

## 6. Product Details Page

Already exists — I'll add: gallery thumbnails, specs/features lists rendered from DB, related products (same category), and a WhatsApp inquiry button (`https://wa.me/...?text=...`). Add-to-cart stays.

## What I Need From You

1. **Confirm enabling Lovable Cloud** (creates the DB/auth/storage automatically).
2. **Admin password** — should I pre-seed the account with `awaismalik.mtc1@` via the dashboard after Cloud is live, or will you sign up yourself at `/admin/login` → "create account" with your chosen password? Either works; the email is the only thing that grants admin role.
3. **WhatsApp number** for the inquiry button (e.g. `+92 3xx xxxxxxx`).
4. **Seed products?** — should I migrate the current hardcoded `src/data/products.ts` catalogue into the new `products` table so the storefront stays populated, or start with an empty DB you fill via the admin panel?

Once you confirm, I'll build it end-to-end in one pass.