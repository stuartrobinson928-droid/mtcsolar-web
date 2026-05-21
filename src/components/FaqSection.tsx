import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "What's the difference between IP65 and IP21 storage?", a: "IP65 enclosures are dust-tight and water-jet rated — safe for outdoor walls and unsheltered installs. IP21 is rated for indoor, climate-stable rooms only. Both use identical LFP chemistry." },
  { q: "Can I run net metering with a Nitrox On-Grid inverter?", a: "Yes. Every Nitrox On-Grid unit ships with anti-islanding and a CT clamp kit compliant with utility export protocols. Hybrid models additionally support zero-export firmware." },
  { q: "How do I size panels against my inverter?", a: "Target a DC/AC ratio of 1.1–1.3. The system summary bar tallies live wattage; if your panel kW exceeds inverter kW × 1.3, the bar will warn before checkout." },
  { q: "Is the Mustang 720W steel frame field-serviceable?", a: "Yes. The frame uses standard M8 fasteners and ships with a 30-year linear performance guarantee plus a 15-year mechanical warranty." },
  { q: "What's included with the Balcony Special bundle?", a: "1 kW micro-array, 2 kWh integrated LFP, plug-and-play AC cable, mounting clamps for railing depths 30–80mm, and an app-paired energy meter." },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">04 · Operating Notes</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Hardware questions, answered.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`rounded-2xl border bg-surface/60 transition-all duration-300 ${
                  isOpen ? "border-gold/60 shadow-gold" : "border-border/60"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className={`font-display text-base font-medium tracking-tight transition-colors ${isOpen ? "text-gold" : ""}`}>
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-gold" : "text-muted-foreground"}`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
