import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useNavigate, e as useRouterState, L as Link, O as Outlet } from "./_libs/tanstack__react-router.mjs";
import { s as supabase } from "./_ssr/client-CyomZAIz.mjs";
import { m as useServerFn, e as checkIsAdmin } from "./_ssr/router-BV9kdTog.mjs";
import "./_libs/sonner.mjs";
import "./_libs/seroval.mjs";
import { g as LoaderCircle, q as ShieldCheck, L as LayoutDashboard, P as Package, r as ShoppingBag, i as LogOut } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_ssr/server-W7L2fyHk.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_ssr/auth-middleware-5C9Ki1_H.mjs";
import "./_libs/zod.mjs";
function AdminLayout() {
  const nav = useNavigate();
  const loc = useRouterState({
    select: (s) => s.location.pathname
  });
  const isAdminFn = useServerFn(checkIsAdmin);
  const [status, setStatus] = reactExports.useState("checking");
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data
      } = await supabase.auth.getSession();
      if (!data.session) {
        if (!cancelled) nav({
          to: "/admin/login"
        });
        return;
      }
      try {
        const res = await isAdminFn({});
        if (cancelled) return;
        if (!res.isAdmin) {
          await supabase.auth.signOut();
          nav({
            to: "/admin/login"
          });
        } else {
          setStatus("ok");
        }
      } catch {
        if (!cancelled) {
          await supabase.auth.signOut();
          nav({
            to: "/admin/login"
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nav, isAdminFn]);
  if (status === "checking") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-gold" }) });
  }
  const navItems = [{
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  }, {
    to: "/admin/products",
    label: "Products",
    icon: Package
  }, {
    to: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden w-64 flex-none flex-col border-r border-border/60 bg-surface lg:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/60 px-5 py-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-2xl bg-gold-gradient text-background shadow-gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-gold", children: "MTC Solar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold", children: "Admin ERP" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 space-y-1 px-3 py-4", children: navItems.map((n) => {
        const active = loc.startsWith(n.to);
        const Icon = n.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: n.to, className: `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${active ? "bg-gold/10 text-gold ring-1 ring-gold/30" : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          n.label
        ] }, n.to);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/60 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
        await supabase.auth.signOut();
        nav({
          to: "/admin/login"
        });
      }, className: "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-elevated hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        " Sign out"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-surface/80 px-6 py-3 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 place-items-center rounded-xl bg-gold-gradient text-background shadow-gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold", children: "MTC Admin" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex items-center gap-1 lg:hidden", children: navItems.map((n) => {
          const active = loc.startsWith(n.to);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: n.to, className: `rounded-lg px-3 py-1.5 text-xs ${active ? "bg-gold/15 text-gold" : "text-muted-foreground"}`, children: n.label }, n.to);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-xs text-muted-foreground hover:text-gold", children: "↗ View storefront" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto px-4 py-6 sm:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AdminLayout as component
};
