import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { m as useServerFn, l as listOrders, u as updateOrderStatus, S as StatusBadge } from "./router-BV9kdTog.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { X } from "../_libs/lucide-react.mjs";
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
const STATUSES = ["pending", "processing", "confirmed", "shipped", "delivered", "cancelled"];
function OrdersPage() {
  const fn = useServerFn(listOrders);
  const updateFn = useServerFn(updateOrderStatus);
  const qc = useQueryClient();
  const {
    data: orders = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => fn({}),
    refetchInterval: 3e4
  });
  const [open, setOpen] = reactExports.useState(null);
  const setStatus = async (id, status) => {
    try {
      await updateFn({
        data: {
          id,
          status
        }
      });
      toast.success("Order updated");
      qc.invalidateQueries({
        queryKey: ["admin-orders"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-summary"]
      });
      if (open?.id === id) setOpen({
        ...open,
        status
      });
    } catch (e) {
      toast.error(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-gold", children: "Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Order Management" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-2xl border border-border/60 bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-surface-elevated/60 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Order #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Payment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/40", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-6 text-center text-muted-foreground", children: "Loading…" }) }),
        !isLoading && orders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-6 text-center text-muted-foreground", children: "No orders yet." }) }),
        orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-surface-elevated/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs", children: o.order_number }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: o.customer_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: o.customer_phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs uppercase", children: o.payment_method }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono tabular-nums", children: fmt(Number(o.total_amount)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: o.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: new Date(o.created_at).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(o), className: "text-xs text-gold hover:underline", children: "View" }) })
        ] }, o.id))
      ] })
    ] }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[80] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/70 backdrop-blur", onClick: () => setOpen(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-gold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between border-b border-border/60 px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-gold", children: "Order details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: open.order_number })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(null), className: "grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Customer", v: open.customer_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", v: open.customer_phone }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", v: open.customer_email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "City", v: open.city }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Delivery Address", v: open.delivery_address, className: "sm:col-span-2" }),
          open.permanent_address && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Permanent Address", v: open.permanent_address, className: "sm:col-span-2" }),
          open.notes && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Notes", v: open.notes, className: "sm:col-span-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Payment", v: String(open.payment_method).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Total", v: fmt(Number(open.total_amount)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[10px] uppercase tracking-widest text-muted-foreground", children: "Items" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 text-sm", children: (open.order_items || []).map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              it.quantity,
              " × ",
              it.product_name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono tabular-nums", children: fmt(Number(it.line_total)) })
          ] }, it.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 border-t border-border/60 px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "Set status:" }),
          STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatus(open.id, s), className: `rounded-full px-3 py-1 text-[11px] uppercase tracking-wider ring-1 transition-all ${open.status === s ? "bg-gold/15 text-gold ring-gold/40" : "text-muted-foreground ring-border hover:text-foreground"}`, children: s }, s))
        ] })
      ] })
    ] })
  ] });
}
function Field({
  label,
  v,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-foreground", children: v })
  ] });
}
export {
  OrdersPage as component
};
