import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { n as useStore } from "./router-BV9kdTog.mjs";
import { p as Plus } from "../_libs/lucide-react.mjs";
function ProductCard({ product, accent }) {
  const { add } = useStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/product/$id",
      params: { id: product.id },
      className: "group relative block overflow-hidden rounded-2xl border border-border/60 bg-surface transition-all duration-300 ease-out hover:-translate-y-2 hover:border-gold/50 hover:shadow-gold",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/3] overflow-hidden bg-surface-elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.image,
              alt: product.name,
              loading: "lazy",
              className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" }),
          accent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-3 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold backdrop-blur", children: accent })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
          product.series && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: product.series }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-1 font-display text-base font-semibold tracking-tight", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: product.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground",
              children: t
            },
            t
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              add(product);
            },
            className: "absolute inset-x-4 bottom-4 flex translate-y-[120%] items-center justify-center gap-1.5 rounded-full bg-gold-gradient py-2.5 text-xs font-semibold text-background opacity-0 shadow-gold transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add to system"
            ]
          }
        )
      ]
    }
  );
}
export {
  ProductCard as P
};
