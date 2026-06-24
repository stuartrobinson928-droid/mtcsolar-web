import { useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { SectionHeader, SectionSkeleton, EmptyState } from "./PanelsSection";
import { useInventoryProducts } from "@/hooks/use-inventory-products";

export function AccessoriesSection() {
  const { data, isLoading } = useInventoryProducts();
  const items = useMemo(() => (data ?? []).filter((p) => p.category === "accessory"), [data]);

  return (
    <section id="accessories" className="relative bg-surface-elevated/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          kicker="04 · Balance of System"
          title="Cables, mounts, breakers, connectors."
          subtitle="The small parts that make a system survive 25 years on a Pakistani rooftop."
        />

        {isLoading ? (
          <SectionSkeleton />
        ) : items.length === 0 ? (
          <EmptyState label="No accessories available right now." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
