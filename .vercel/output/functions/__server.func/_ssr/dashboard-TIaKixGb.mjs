import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { m as useServerFn, a as adminSummary } from "./router-BV9kdTog.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { r as ShoppingBag, e as Clock, c as CircleCheck, d as CircleX, P as Package, B as Banknote, w as TriangleAlert } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
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
const fmt = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");
function Dashboard() {
  const fn = useServerFn(adminSummary);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-summary"],
    queryFn: () => fn({}),
    refetchInterval: 3e4
  });
  if (isLoading || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading dashboard…" });
  const cards = [{
    label: "Total Orders",
    value: data.counts.total,
    icon: ShoppingBag,
    tone: "text-foreground"
  }, {
    label: "Pending",
    value: data.counts.pending,
    icon: Clock,
    tone: "text-amber-400"
  }, {
    label: "Completed",
    value: data.counts.delivered,
    icon: CircleCheck,
    tone: "text-emerald-400"
  }, {
    label: "Cancelled",
    value: data.counts.cancelled,
    icon: CircleX,
    tone: "text-rose-400"
  }, {
    label: "Total Products",
    value: data.totalProducts,
    icon: Package,
    tone: "text-foreground"
  }, {
    label: "Revenue",
    value: fmt(data.revenue),
    icon: Banknote,
    tone: "text-gold"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-gold", children: "Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold tracking-tight", children: "Admin Dashboard" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6", children: cards.map((c) => {
      const Icon = c.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-surface p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: c.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${c.tone}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-2 font-display text-2xl font-semibold ${c.tone}`, children: c.value })
      ] }, c.label);
    }) }),
    data.lowStock.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2 text-amber-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider", children: "Low stock alert" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-sm", children: data.lowStock.slice(0, 6).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between border-b border-border/40 py-1.5 last:border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-amber-400", children: [
          p.stock_quantity,
          " left"
        ] })
      ] }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/60 bg-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-base font-semibold", children: "Recent Orders" }),
        data.recentOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border/40", children: data.recentOrders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-3 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: o.order_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: o.customer_name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: o.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "w-24 text-right font-mono text-xs tabular-nums", children: fmt(Number(o.total_amount)) })
        ] }, o.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-border/60 bg-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-base font-semibold", children: "Recent Activity" }),
        data.activity.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No activity yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: data.activity.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-gold" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate", children: a.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: new Date(a.created_at).toLocaleString() })
          ] })
        ] }, a.id)) })
      ] })
    ] })
  ] });
}
function StatusBadge({
  status
}) {
  const map = {
    pending: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
    processing: "bg-sky-500/15 text-sky-400 ring-sky-500/30",
    confirmed: "bg-indigo-500/15 text-indigo-400 ring-indigo-500/30",
    shipped: "bg-violet-500/15 text-violet-400 ring-violet-500/30",
    delivered: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
    cancelled: "bg-rose-500/15 text-rose-400 ring-rose-500/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${map[status] || "bg-muted text-muted-foreground ring-border"}`, children: status });
}
export {
  StatusBadge,
  Dashboard as component
};
