import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { R as Route$4, n as useStore, b as allProducts } from "./router-BV9kdTog.mjs";
import { P as ProductCard } from "./ProductCard-DzNcbU95.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { b as Battery, Z as Zap, v as Sun, A as ArrowLeft, C as Check, p as Plus } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
const categoryMeta = {
  panel: {
    label: "Photovoltaic Panel",
    Icon: Sun,
    unit: (w) => `${w} W`
  },
  inverter: {
    label: "Power Inverter",
    Icon: Zap,
    unit: (w) => `${(w / 1e3).toFixed(1)} kW`
  },
  battery: {
    label: "Lithium Storage",
    Icon: Battery,
    unit: (w) => `${(w / 1e3).toFixed(2)} kWh`
  }
};
function ProductPage() {
  const {
    product
  } = Route$4.useLoaderData();
  const {
    add,
    state
  } = useStore();
  const meta = categoryMeta[product.category];
  const inCart = (state.items[product.id]?.qty ?? 0) > 0;
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "pt-28 pb-24 md:pt-36", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
      " Back to catalog"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-3xl border border-border/60 bg-surface-elevated", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-40", style: {
          backgroundImage: "var(--gradient-hero)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, alt: product.name, className: "relative aspect-[4/3] w-full object-cover" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-background/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(meta.Icon, { className: "h-3 w-3" }),
          " ",
          meta.label
        ] }),
        product.series && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-[10px] uppercase tracking-widest text-muted-foreground", children: product.series }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl", children: product.name }),
        product.watts !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-display text-2xl font-semibold text-gold", children: meta.unit(product.watts) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex flex-wrap gap-1.5", children: product.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground", children: t }, t)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-sm leading-relaxed text-muted-foreground", children: "Engineered as part of MTC Solar's curated system library. Ships ready to integrate with our pre-sized inverter and storage stacks — no quote calls, no surprises." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => add(product), className: "inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5", children: [
          inCart ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          inCart ? "Added — add another" : "Add to system"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-10 grid grid-cols-2 gap-6 border-t border-border/60 pt-6 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "mt-1 font-display font-semibold capitalize", children: product.category })
          ] }),
          product.watts !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Rating" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "mt-1 font-display font-semibold", children: meta.unit(product.watts) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "SKU" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "mt-1 font-mono text-xs", children: product.id })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Warranty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "mt-1 font-display font-semibold", children: "Manufacturer backed" })
          ] })
        ] })
      ] })
    ] }),
    related.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold tracking-tight", children: "Related hardware" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3", children: related.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) })
    ] })
  ] }) });
}
export {
  ProductPage as component
};
