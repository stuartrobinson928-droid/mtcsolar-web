import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { PanelsSection } from "@/components/PanelsSection";
import { InvertersSection } from "@/components/InvertersSection";
import { BatteriesSection } from "@/components/BatteriesSection";
import { FaqSection } from "@/components/FaqSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MTC Solar — Premium Solar Hardware Store" },
      { name: "description", content: "Engineered solar systems: bifacial panels, hybrid inverters and IP-rated lithium storage." },
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
      <FaqSection />
    </main>
  );
}
