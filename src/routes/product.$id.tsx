import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Plus, Check, Sun, Zap, Battery } from "lucide-react";
import { findProduct, allProducts } from "@/data/products";
import { useStore, type Product } from "@/context/store";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = findProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — MTC Solar` },
          { name: "description", content: `${loaderData.product.name} — ${loaderData.product.tags.join(", ")}` },
          { property: "og:title", content: `${loaderData.product.name} — MTC Solar` },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: () => {
    const { id } = Route.useParams();
    return (
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold">Product "{id}" not found</h1>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:border-gold/50"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to catalog
        </Link>
      </div>
    );
  },
});

const categoryMeta: Record<Product["category"], { label: string; Icon: typeof Sun; unit: (w: number) => string }> = {
  panel: { label: "Photovoltaic Panel", Icon: Sun, unit: (w) => `${w} W` },
  inverter: { label: "Power Inverter", Icon: Zap, unit: (w) => `${(w / 1000).toFixed(1)} kW` },
  battery: { label: "Lithium Storage", Icon: Battery, unit: (w) => `${(w / 1000).toFixed(2)} kWh` },
};

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const { add, state } = useStore();
  const meta = categoryMeta[product.category];
  const inCart = (state.items[product.id]?.qty ?? 0) > 0;
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

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
                src={product.image}
                alt={product.name}
                className="relative aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
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

            <div className="mt-5 flex flex-wrap gap-1.5">
              {product.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Engineered as part of MTC Solar's curated system library. Ships ready to integrate
              with our pre-sized inverter and storage stacks — no quote calls, no surprises.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => add(product)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5"
              >
                {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {inCart ? "Added — add another" : "Add to system"}
              </button>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border/60 pt-6 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Category</dt>
                <dd className="mt-1 font-display font-semibold capitalize">{product.category}</dd>
              </div>
              {product.watts !== undefined && (
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Rating</dt>
                  <dd className="mt-1 font-display font-semibold">{meta.unit(product.watts)}</dd>
                </div>
              )}
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">SKU</dt>
                <dd className="mt-1 font-mono text-xs">{product.id}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Warranty</dt>
                <dd className="mt-1 font-display font-semibold">Manufacturer backed</dd>
              </div>
            </dl>
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
