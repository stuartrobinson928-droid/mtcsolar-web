import { panels } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function PanelsSection() {
  return (
    <section id="panels" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          kicker="01 · Photovoltaic"
          title="Bifacial arrays, steel-framed."
          subtitle="N-Type cells from Inverex Mustang, JA Solar and Longi — sized for serious roofs."
        />

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2">
          {/* Feature tile */}
          <div className="relative md:col-span-3 md:row-span-2 overflow-hidden rounded-3xl border border-border/60 bg-surface-elevated p-8">
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "var(--gradient-hero)" }} />
            <div className="relative flex h-full flex-col">
              <p className="text-[10px] uppercase tracking-widest text-gold">Flagship</p>
              <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Mustang 720W Steel Frame
              </h3>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Industrial-grade bifacial module engineered for high yield in dust and heat.
                30-year linear performance guarantee.
              </p>
              <div className="mt-auto pt-6">
                <img src={panels[2].image} alt="Mustang 720W" loading="lazy" className="aspect-[16/10] w-full rounded-xl object-cover" />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="md:col-span-3 md:row-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {panels.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Secondary row */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {panels.slice(3).map((p) => (
            <ProductCard key={p.id} product={p} accent={p.series} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return (
    <div className="mb-12 flex flex-col gap-3 md:mb-16 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{kicker}</p>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          {title}
        </h2>
      </div>
      <p className="max-w-md text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
