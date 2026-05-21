import { createFileRoute } from "@tanstack/react-router";
import { StoreProvider, ThemeProvider } from "@/context/store";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PanelsSection } from "@/components/PanelsSection";
import { InvertersSection } from "@/components/InvertersSection";
import { BatteriesSection } from "@/components/BatteriesSection";
import { FaqSection } from "@/components/FaqSection";
import { SummaryBar } from "@/components/SummaryBar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Helios — Premium Solar Hardware Store" },
      { name: "description", content: "Engineered solar systems: bifacial panels, hybrid inverters and IP-rated lithium storage. Curated bundles, no quote calls." },
      { property: "og:title", content: "Helios — Premium Solar Hardware" },
      { property: "og:description", content: "Curated solar systems for serious homes and industries." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <div className="relative min-h-screen bg-background text-foreground">
          <Navbar />
          <main id="shop">
            <Hero />
            <PanelsSection />
            <InvertersSection />
            <BatteriesSection />
            <FaqSection />
          </main>
          <Footer />
          <SummaryBar />
        </div>
      </StoreProvider>
    </ThemeProvider>
  );
}
