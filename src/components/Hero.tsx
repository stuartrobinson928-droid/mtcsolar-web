import { useEffect, useState } from "react";
import { ArrowRight, Sun, Battery, Cpu } from "lucide-react";
import heroPanels from "@/assets/hero-panels.jpg";
import balcony from "@/assets/balcony-bundle.jpg";
import logoMark from "@/assets/mtc-logo-mark.png";
import logoMarkDark from "@/assets/mtc-logo-mark-dark.png";
import { useTheme } from "@/context/store";

const slides = [
  {
    img: balcony,
    badge: "Balcony Special",
    title: "1kW Balcony System + 2kWh IP21 Storage",
    bullets: ["Plug-and-play install", "2.0 kWh integrated LFP", "Zero permits required"],
    spec: "1.0 kW · 2.0 kWh",
  },
  {
    img: heroPanels,
    badge: "Premium Residential",
    title: "10kW Nitrox Hybrid + 10kWh + 16x Mustang 610W",
    bullets: ["3-phase Nitrox hybrid core", "IP65 outdoor LFP shield", "9.76 kW peak array"],
    spec: "10.0 kW · 10 kWh",
  },
];

export function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);
  const s = slides[idx];

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12">
        <div className="lg:col-span-6 animate-welcome-rise">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-surface/50 px-3 py-1 text-xs text-gold">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            Pre-Engineered Solar Stacks · 2026
          </div>
          <h1 className="text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Engineered <span className="text-gold">sunlight</span><br />
            for serious homes.
          </h1>
          <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
            Premium inverters, bifacial arrays and lithium storage —
            curated into ready-to-ship systems. No quote calls. No surprises.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#shop"
              className="group inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-medium text-background shadow-gold transition-transform hover:-translate-y-0.5"
            >
              Browse hardware
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#faq"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-gold/50"
            >
              How sizing works
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border/60 pt-8">
            {[
              { k: "595–720W", v: "Panel range", Icon: Sun },
              { k: "1.6–136kW", v: "Inverter range", Icon: Cpu },
              { k: "100–314Ah", v: "Battery cells", Icon: Battery },
            ].map(({ k, v, Icon }) => (
              <div key={v}>
                <Icon className="mb-2 h-4 w-4 text-gold" />
                <dt className="font-display text-lg font-semibold tracking-tight">{k}</dt>
                <dd className="text-xs text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-6">
          <div className="relative animate-welcome-rise" style={{ animationDelay: "120ms" }}>
            <div className="absolute -inset-6 rounded-3xl bg-gold/10 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface shadow-gold">
              <div className="relative aspect-[4/3]">
                {slides.map((sl, i) => (
                  <img
                    key={sl.title}
                    src={sl.img}
                    alt={sl.title}
                    width={1536}
                    height={1280}
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                      i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block rounded-full border border-gold/40 bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur">
                    {s.badge}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight md:text-2xl">
                    {s.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-gold" /> {b}
                        </li>
                      ))}
                    </ul>
                    <span className="font-display text-sm font-semibold text-gold">{s.spec}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-8 bg-gold" : "w-1.5 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
