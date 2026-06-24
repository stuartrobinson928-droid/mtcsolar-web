import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Check, Sun, Zap, Battery, Wrench, MessageCircle, Minus, ShieldCheck, Truck, BadgeCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useStore, priceFor, type Product } from "@/context/store";
import { ProductCard } from "@/components/ProductCard";
import { useInventoryProducts, useInventoryProduct } from "@/hooks/use-inventory-products";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product | MTC Solar | Premium Solar Store" },
      { name: "description", content: "Premium solar hardware from MTC Solar — panels, inverters, lithium storage and accessories." },
    ],
  }),
  component: ProductPage,
});

const categoryMeta: Record<Product["category"], { label: string; Icon: typeof Sun; unit: (w: number) => string }> = {
  panel: { label: "Photovoltaic Panel", Icon: Sun, unit: (w) => `${w} W` },
  inverter: { label: "Power Inverter", Icon: Zap, unit: (w) => `${(w / 1000).toFixed(1)} kW` },
  battery: { label: "Lithium Storage", Icon: Battery, unit: (w) => `${(w / 1000).toFixed(2)} kWh` },
  accessory: { label: "Accessory", Icon: Wrench, unit: (w) => `${w} W` },
};

const fmt = (n: number) => "Rs " + n.toLocaleString("en-PK");

function ProductPage() {
  const { id } = Route.useParams();
  const { data: product, isLoading, isError } = useInventoryProduct(id);
  const { data: all } = useInventoryProducts();
  const { add, state } = useStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) {
    return (
      <main className="grid min-h-[60vh] place-items-center pt-32">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </main>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold">Product not found</h1>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:border-gold/50"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to catalog
        </Link>
      </div>
    );
  }

  const meta = categoryMeta[product.category];
  const inCart = (state.items[product.id]?.qty ?? 0) > 0;
  const related = (all ?? []).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const gallery = [product.image];
  const unitPrice = priceFor(product);
  const stock = product.stock ?? 0;
  const outOfStock = stock <= 0;
  const lowStock = !outOfStock && stock <= (product.lowStockThreshold ?? 5);

  const addToCart = () => {
    if (outOfStock) return;
    const max = Math.max(0, Math.min(qty, stock));
    for (let i = 0; i < max; i++) add(product);
  };

  const whatsapp = () => {
    const msg = encodeURIComponent(
      `Hi MTC Solar — I'd like more info on the ${product.name} (SKU ${product.id}). Pricing: ${fmt(unitPrice)}.`,
    );
    window.open(`https://wa.me/923000000000?text=${msg}`, "_blank", "noopener");
  };

  return (
    <main className="pt-28 pb-24 md:pt-36">
      <div className="mx-auto max-w-7xl px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to catalog
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface-elevated">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "var(--gradient-hero)" }} />
              <img
                src={gallery[activeImg]}
                alt={product.name}
                className={`relative aspect-[4/3] w-full object-cover ${outOfStock ? "grayscale" : ""}`}
              />
              {outOfStock ? (
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-400 ring-1 ring-red-500/30 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Out of stock
                </div>
              ) : (
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/30 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {lowStock ? `Only ${stock} left` : "In stock"}
                </div>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <section className="rounded-2xl border border-border/60 bg-surface-elevated/40 p-5">
                <h3 className="text-[10px] uppercase tracking-widest text-gold">Technical specs</h3>
                <dl className="mt-4 divide-y divide-border/40 text-sm">
                  <SpecRow k="Category" v={product.category} />
                  {product.watts !== undefined && <SpecRow k="Rating" v={meta.unit(product.watts)} />}
                  {product.series && <SpecRow k="Series" v={product.series} />}
                  <SpecRow k="SKU" v={product.id} mono />
                  <SpecRow k="Warranty" v="Manufacturer backed" />
                </dl>
              </section>
              <section className="rounded-2xl border border-border/60 bg-surface-elevated/40 p-5">
                <h3 className="text-[10px] uppercase tracking-widest text-gold">Highlights</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {product.tags.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <BadgeCheck className="mt-0.5 h-4 w-4 flex-none text-gold" />
                      <span>{t}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <Truck className="mt-0.5 h-4 w-4 flex-none text-gold" />
                    <span>Pre-tested and pre-sized for MTC Solar system stacks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-gold" />
                    <span>Genuine, traceable serials — no grey-market units.</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold">
                <meta.Icon className="h-3 w-3" /> {meta.label}
              </div>
              {product.series && (
                <p className="mt-5 text-[10px] uppercase tracking-widest text-muted-foreground">{product.series}</p>
              )}
              <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                {product.name}
              </h1>

              {product.watts !== undefined && (
                <p className="mt-4 font-display text-2xl font-semibold text-gold">
                  {meta.unit(product.watts)}
                </p>
              )}

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-3xl font-semibold text-foreground">{fmt(unitPrice)}</span>
                <span className="text-xs text-muted-foreground">inclusive of GST</span>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Engineered as part of MTC Solar's curated system library. Ships ready to integrate
                with our pre-sized inverter and storage stacks — no quote calls, no surprises.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="inline-flex items-center rounded-full border border-border/60 bg-surface-elevated/40">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={outOfStock}
                    className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm tabular-nums">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(stock || q + 1, q + 1))}
                    aria-label="Increase quantity"
                    disabled={outOfStock || qty >= stock}
                    className="grid h-10 w-10 place-items-center text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Line total <span className="ml-1 font-display text-sm font-semibold text-foreground">{fmt(unitPrice * qty)}</span>
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={addToCart}
                  disabled={outOfStock}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                >
                  {outOfStock ? (
                    "Out of stock"
                  ) : (
                    <>
                      {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {inCart ? "Add another" : "Add to system"}
                    </>
                  )}
                </button>
                <button
                  onClick={whatsapp}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/15 hover:border-emerald-500/60"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp inquiry
                </button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border/60 pt-6 text-center text-[11px] text-muted-foreground">
                <div className="space-y-1">
                  <Truck className="mx-auto h-4 w-4 text-gold" />
                  <p>Nationwide delivery</p>
                </div>
                <div className="space-y-1">
                  <ShieldCheck className="mx-auto h-4 w-4 text-gold" />
                  <p>Warranty backed</p>
                </div>
                <div className="space-y-1">
                  <BadgeCheck className="mx-auto h-4 w-4 text-gold" />
                  <p>Genuine sourcing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Related hardware</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function SpecRow({ k, v, mono = false }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className={`text-right ${mono ? "font-mono text-xs" : "font-display text-sm font-semibold"} capitalize`}>{v}</dd>
    </div>
  );
}
