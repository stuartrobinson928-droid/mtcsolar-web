import { Shield, Home } from "lucide-react";
import { batteriesIndoor, batteriesOutdoor } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { SectionHeader } from "./PanelsSection";

export function BatteriesSection() {
  return (
    <section id="batteries" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          kicker="03 · Lithium Storage"
          title="Energy reservoirs, rated for weather."
          subtitle="LFP cells, 6,000-cycle warranty, IP-rated enclosures for outdoor or indoor walls."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BatteryBlock
            title="IP65 Weatherproof Storage"
            badge="Outdoor Shield"
            icon={<Shield className="h-4 w-4" />}
            items={batteriesOutdoor}
          />
          <BatteryBlock
            title="IP21 Indoor Lithium-ion"
            badge="Wall Mount"
            icon={<Home className="h-4 w-4" />}
            items={batteriesIndoor}
          />
        </div>
      </div>
    </section>
  );
}

function BatteryBlock({
  title, badge, icon, items,
}: { title: string; badge: string; icon: React.ReactNode; items: typeof batteriesIndoor }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-surface-elevated/60 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold">
          {icon} {badge}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
