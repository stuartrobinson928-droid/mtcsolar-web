import { useState } from "react";
import { invertersHybrid, invertersOnGrid } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { Carousel } from "./Carousel";
import { SectionHeader } from "./PanelsSection";

type Tab = "hybrid" | "ongrid";

export function InvertersSection() {
  const [tab, setTab] = useState<Tab>("hybrid");
  const list = tab === "hybrid" ? invertersHybrid : invertersOnGrid;

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

        <Carousel>
          {list.map((p) => (
            <ProductCard key={p.id} product={p} accent={`${(p.watts ?? 0) / 1000}kW`} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
