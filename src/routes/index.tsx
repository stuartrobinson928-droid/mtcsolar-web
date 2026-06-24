import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { PanelsSection } from "@/components/PanelsSection";
import { InvertersSection } from "@/components/InvertersSection";
import { BatteriesSection } from "@/components/BatteriesSection";
import { AccessoriesSection } from "@/components/AccessoriesSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MTC Solar | Premium Solar Store" },
      { name: "description", content: "Engineered solar systems: bifacial panels, hybrid inverters, IP-rated lithium storage and accessories." },
      { property: "og:title", content: "MTC Solar — Premium Solar Hardware" },
      { property: "og:description", content: "Curated solar systems for serious homes and industries." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main id="shop">
      <Hero />
      <PanelsSection />
      <InvertersSection />
      <BatteriesSection />
      <AccessoriesSection />
    </main>
  );
}


