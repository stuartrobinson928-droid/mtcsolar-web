import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { p as panels, i as invertersHybrid, h as invertersOnGrid, d as batteriesOutdoor, c as batteriesIndoor } from "./router-BV9kdTog.mjs";
import { P as ProductCard } from "./ProductCard-DzNcbU95.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { a as ArrowRight, v as Sun, f as Cpu, b as Battery, S as Shield, H as House } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./client-CyomZAIz.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-W7L2fyHk.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-5C9Ki1_H.mjs";
import "../_libs/zod.mjs";
const heroPanels = "/assets/hero-panels-DLvqvT8Y.jpg";
const balcony = "/assets/balcony-bundle-Sf94CYNe.jpg";
const slides = [
  {
    img: balcony,
    badge: "Balcony Special",
    title: "1kW Balcony System + 2kWh IP21 Storage",
    bullets: ["Plug-and-play install", "2.0 kWh integrated LFP", "Zero permits required"],
    spec: "1.0 kW · 2.0 kWh"
  },
  {
    img: heroPanels,
    badge: "Premium Residential",
    title: "10kW Nitrox Hybrid + 10kWh + 16x Mustang 610W",
    bullets: ["3-phase Nitrox hybrid core", "IP65 outdoor LFP shield", "9.76 kW peak array"],
    spec: "10.0 kW · 10 kWh"
  }
];
function Hero() {
  const [idx, setIdx] = reactExports.useState(0);
  const tiltRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);
  const onMove = (e) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateZ(0)`;
  };
  const onLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "perspective(1100px) rotateY(0deg) rotateX(0deg)";
  };
  const s = slides[idx];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid-bg pointer-events-none absolute inset-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "pointer-events-none absolute inset-0",
        style: { backgroundImage: "var(--gradient-hero)" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-6 animate-welcome-rise", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-surface/50 px-3 py-1 text-xs text-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-gold" }),
          "Pre-Engineered Solar Stacks · 2026"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl", children: [
          "Engineered ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold", children: "sunlight" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "for serious homes."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-lg text-base text-muted-foreground md:text-lg", children: "Premium inverters, bifacial arrays and lithium storage — curated into ready-to-ship systems. No quote calls. No surprises." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "#shop",
              className: "group inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-medium text-background shadow-gold transition-transform hover:-translate-y-0.5",
              children: [
                "Browse hardware",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "#contact",
              className: "inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-gold/50",
              children: "Talk to engineering"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border/60 pt-8", children: [
          { k: "595–720W", v: "Panel range", Icon: Sun },
          { k: "1.6–136kW", v: "Inverter range", Icon: Cpu },
          { k: "100–314Ah", v: "Battery cells", Icon: Battery }
        ].map(({ k, v, Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "mb-2 h-4 w-4 text-gold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-display text-lg font-semibold tracking-tight", children: k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-xs text-muted-foreground", children: v })
        ] }, v)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-6", style: { perspective: "1100px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative animate-welcome-rise animate-float [transform-style:preserve-3d] [will-change:transform]",
          style: { animationDelay: "120ms" },
          onMouseMove: onMove,
          onMouseLeave: onLeave,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-6 rounded-3xl bg-gold/10 blur-3xl", "aria-hidden": true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                ref: tiltRef,
                className: "relative overflow-hidden rounded-3xl border border-border/60 bg-surface shadow-gold transition-transform duration-300 ease-out [transform-style:preserve-3d] [will-change:transform]",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/3]", children: [
                  slides.map((sl, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: sl.img,
                      alt: sl.title,
                      width: 1536,
                      height: 1280,
                      className: `absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"}`
                    },
                    sl.title
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full border border-gold/40 bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold backdrop-blur", children: s.badge }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-display text-xl font-semibold tracking-tight md:text-2xl", children: s.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", children: s.bullets.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full bg-gold" }),
                        " ",
                        b
                      ] }, b)) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-semibold text-gold", children: s.spec })
                    ] })
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex items-center justify-center gap-2", children: slides.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setIdx(i),
                "aria-label": `Slide ${i + 1}`,
                className: `h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-gold" : "w-1.5 bg-border"}`
              },
              i
            )) })
          ]
        }
      ) })
    ] })
  ] });
}
function PanelsSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "panels", className: "relative py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionHeader,
      {
        kicker: "01 · Photovoltaic",
        title: "Bifacial arrays, steel-framed.",
        subtitle: "N-Type cells from Inverex Mustang, JA Solar and Longi — sized for serious roofs."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative md:col-span-3 md:row-span-2 overflow-hidden rounded-3xl border border-border/60 bg-surface-elevated p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-40", style: { backgroundImage: "var(--gradient-hero)" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-full flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-gold", children: "Flagship" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl", children: "Mustang 720W Steel Frame" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-sm text-sm text-muted-foreground", children: "Industrial-grade bifacial module engineered for high yield in dust and heat. 30-year linear performance guarantee." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: panels[2].image, alt: "Mustang 720W", loading: "lazy", className: "aspect-[16/10] w-full rounded-xl object-cover" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-3 md:row-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2", children: panels.slice(0, 4).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3", children: panels.slice(3).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, accent: p.series }, p.id)) })
  ] }) });
}
function SectionHeader({ kicker, title, subtitle }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12 flex flex-col gap-3 md:mb-16 md:flex-row md:items-end md:justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-[0.2em] text-gold", children: kicker }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-sm text-muted-foreground", children: subtitle })
  ] });
}
function Carousel({ children }) {
  const ref = reactExports.useRef(null);
  const [centerIdx, setCenterIdx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      Array.from(el.children).forEach((c, i) => {
        const r = c;
        const mid = r.offsetLeft + r.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setCenterIdx(best);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: "no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 py-2",
      style: { scrollBehavior: "smooth" },
      children: children.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `shrink-0 snap-center transition-transform duration-500 ease-out ${i === centerIdx ? "scale-[1.02]" : "scale-100 opacity-80"}`,
          style: { width: "min(320px, 80vw)" },
          children: c
        },
        i
      ))
    }
  );
}
function InvertersSection() {
  const [tab, setTab] = reactExports.useState("hybrid");
  const list = tab === "hybrid" ? invertersHybrid : invertersOnGrid;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "inverters", className: "relative bg-surface-elevated/40 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionHeader,
      {
        kicker: "02 · Power Conversion",
        title: "Inverter cores for any load.",
        subtitle: "From a 1.6 kW Veyron in a balcony cabinet to a 136 kW Nitrox feeding a factory bus-bar."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 inline-flex rounded-full border border-border/60 bg-surface p-1", children: [
      { id: "hybrid", label: "Hybrid Models" },
      { id: "ongrid", label: "On-Grid Systems" }
    ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setTab(t.id),
        className: `relative rounded-full px-5 py-2 text-xs font-medium transition-colors ${tab === t.id ? "bg-gold-gradient text-background shadow-gold" : "text-muted-foreground hover:text-foreground"}`,
        children: t.label
      },
      t.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Carousel, { children: list.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, accent: `${(p.watts ?? 0) / 1e3}kW` }, p.id)) })
  ] }) });
}
function BatteriesSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "batteries", className: "relative py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionHeader,
      {
        kicker: "03 · Lithium Storage",
        title: "Energy reservoirs, rated for weather.",
        subtitle: "LFP cells, 6,000-cycle warranty, IP-rated enclosures for outdoor or indoor walls."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        BatteryBlock,
        {
          title: "IP65 Weatherproof Storage",
          badge: "Outdoor Shield",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
          items: batteriesOutdoor
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        BatteryBlock,
        {
          title: "IP21 Indoor Lithium-ion",
          badge: "Wall Mount",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4" }),
          items: batteriesIndoor
        }
      )
    ] })
  ] }) });
}
function BatteryBlock({
  title,
  badge,
  icon,
  items
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border/60 bg-surface-elevated/60 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold tracking-tight", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold", children: [
        icon,
        " ",
        badge
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) })
  ] });
}
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { id: "shop", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PanelsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InvertersSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BatteriesSection, {})
  ] });
}
export {
  Index as component
};
