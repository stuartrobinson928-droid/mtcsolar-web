import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Carousel } from "./Carousel";
import { SectionHeader, SectionSkeleton, EmptyState } from "./PanelsSection";
import { useInventoryProducts } from "@/hooks/use-inventory-products";
import type { Product } from "@/context/store";

type Tab = "hybrid" | "ongrid";

function isOnGrid(p: Product) {
  const blob = `${p.name} ${p.tags.join(" ")}`.toLowerCase();
  return blob.includes("on-grid") || blob.includes("on grid") || blob.includes("ongrid") || blob.includes("grid-tie");
}
function isHybrid(p: Product) {
  const blob = `${p.name} ${p.tags.join(" ")}`.toLowerCase();
  return blob.includes("hybrid") || blob.includes("off-grid") || (!isOnGrid(p));
}

export function InvertersSection() {
  const [tab, setTab] = useState<Tab>("hybrid");
  const { data, isLoading } = useInventoryProducts();

  const inverters = useMemo(() => (data ?? []).filter((p) => p.category === "inverter"), [data]);
  const list = useMemo(
    () => (tab === "ongrid" ? inverters.filter(isOnGrid) : inverters.filter((p) => !isOnGrid(p) && isHybrid(p))),
    [tab, inverters],
  );

  return (
    <section id="inverters" className="relative bg-surface-elevated/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          kicker="02 · Power Conversion"
          title="Inverter cores for any load."
          subtitle="From a 1.6 kW Veyron in a balcony cabinet to a 136 kW Nitrox feeding a factory bus-bar."
        />

        <div className="mb-8 inline-flex rounded-full border border-border/60 bg-surface p-1">
          {([
            { id: "hybrid", label: "Hybrid Models" },
            { id: "ongrid", label: "On-Grid Systems" },
          ] as { id: Tab; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative rounded-full px-5 py-2 text-xs font-medium transition-colors ${
                tab === t.id
                  ? "bg-gold-gradient text-background shadow-gold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <SectionSkeleton />
        ) : list.length === 0 ? (
          <EmptyState label="No inverters in this category right now." />
        ) : (
          <Carousel>
            {list.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                accent={p.watts ? `${(p.watts / 1000).toFixed(p.watts >= 10000 ? 0 : 1)}kW` : undefined}
              />
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
}
