import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, d as useRouter, L as Link, e as useRouterState, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent, u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { E as notFound, y as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster, t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-CyomZAIz.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, b as getServerFnById } from "./server-W7L2fyHk.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-5C9Ki1_H.mjs";
import { v as Sun, m as Moon, s as ShoppingCart, U as User, q as ShieldCheck, i as LogOut, I as Instagram, F as Facebook, k as MessageCircle, o as Phone, M as Mail, j as MapPin, Z as Zap, b as Battery, a as ArrowRight, X, T as Trash2, l as Minus, p as Plus, C as Check, x as Truck, W as Wallet, B as Banknote, t as Smartphone, D as Download, A as ArrowLeft } from "../_libs/lucide-react.mjs";
import { o as objectType, b as arrayType, e as enumType, s as stringType, n as numberType, c as booleanType, r as recordType, a as anyType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function useServerFn(serverFn) {
  const router2 = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router2.stores.location.get();
        return router2.navigate(router2.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router2, serverFn]);
}
const appCss = "/assets/styles-B57HlDY2.css";
const initial = { items: {} };
function reducer(state, action) {
  switch (action.type) {
    case "add": {
      const cur = state.items[action.product.id];
      return { items: { ...state.items, [action.product.id]: { product: action.product, qty: (cur?.qty ?? 0) + 1 } } };
    }
    case "remove": {
      const cur = state.items[action.id];
      if (!cur) return state;
      const next = { ...state.items };
      if (cur.qty <= 1) delete next[action.id];
      else next[action.id] = { ...cur, qty: cur.qty - 1 };
      return { items: next };
    }
    case "removeAll": {
      const next = { ...state.items };
      delete next[action.id];
      return { items: next };
    }
    case "setQty": {
      const cur = state.items[action.id];
      if (!cur) return state;
      const next = { ...state.items };
      if (action.qty <= 0) delete next[action.id];
      else next[action.id] = { ...cur, qty: action.qty };
      return { items: next };
    }
    case "clear":
      return { items: {} };
  }
}
const StoreCtx = reactExports.createContext(null);
function StoreProvider({ children }) {
  const [state, dispatch] = reactExports.useReducer(reducer, initial);
  const [cartOpen, setCartOpen] = reactExports.useState(false);
  const [checkoutOpen, setCheckoutOpen] = reactExports.useState(false);
  const [bounceKey, setBounceKey] = reactExports.useState(0);
  const totals = reactExports.useMemo(() => {
    let panels2 = 0, inverters = 0, batteries = 0, panelW = 0, inverterW = 0;
    for (const { product, qty } of Object.values(state.items)) {
      if (product.category === "panel") {
        panels2 += qty;
        panelW += (product.watts ?? 0) * qty;
      }
      if (product.category === "inverter") {
        inverters += qty;
        inverterW += (product.watts ?? 0) * qty;
      }
      if (product.category === "battery") {
        batteries += qty;
      }
    }
    const kw = Math.max(panelW, inverterW) / 1e3;
    return { panels: panels2, inverters, batteries, kw, count: panels2 + inverters + batteries };
  }, [state]);
  const items = reactExports.useMemo(() => Object.values(state.items), [state]);
  const value = {
    state,
    items,
    add: (p) => {
      dispatch({ type: "add", product: p });
      setBounceKey((k) => k + 1);
    },
    remove: (id) => dispatch({ type: "remove", id }),
    removeAll: (id) => dispatch({ type: "removeAll", id }),
    setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
    clear: () => dispatch({ type: "clear" }),
    totals,
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    toggleCart: () => setCartOpen((v) => !v),
    checkoutOpen,
    openCheckout: () => {
      setCartOpen(false);
      setCheckoutOpen(true);
    },
    closeCheckout: () => setCheckoutOpen(false),
    bounceKey
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(StoreCtx.Provider, { value, children });
}
function priceFor(p) {
  const w = p.watts ?? 0;
  const ratePerW = p.category === "panel" ? 38 : p.category === "inverter" ? 55 : 42;
  const base = Math.round(w * ratePerW / 100) * 100;
  return Math.max(base, 8500);
}
function useStore() {
  const c = reactExports.useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
const ThemeCtx = reactExports.createContext(null);
function ThemeProvider({ children }) {
  const [theme, dispatch] = reactExports.useReducer(
    (s) => s === "dark" ? "light" : "dark",
    "dark"
  );
  reactExports.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeCtx.Provider, { value: { theme, toggle: () => dispatch() }, children });
}
function useTheme() {
  const c = reactExports.useContext(ThemeCtx);
  if (!c) throw new Error("useTheme outside provider");
  return c;
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const productSchema = objectType({
  title: stringType().trim().min(1).max(200),
  category: enumType(["panel", "inverter", "battery", "accessory"]),
  brand: stringType().trim().max(120).optional().nullable(),
  model_number: stringType().trim().max(120).optional().nullable(),
  description: stringType().trim().max(5e3).optional().nullable(),
  specifications: recordType(stringType(), anyType()).optional().default({}),
  features: arrayType(stringType()).optional().default([]),
  tags: arrayType(stringType()).optional().default([]),
  image_url: stringType().url().optional().nullable(),
  gallery: arrayType(stringType().url()).optional().default([]),
  price: numberType().min(0),
  sale_price: numberType().min(0).optional().nullable(),
  stock_quantity: numberType().int().min(0).default(0),
  status: enumType(["active", "out_of_stock", "draft", "hidden"]).default("active"),
  featured: booleanType().default(false)
});
const listProducts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("51ad93d03c52987e0e52d0164e41771f8765a8919d8a537367eaf795dff9b9d8"));
const createProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => productSchema.parse(input)).handler(createSsrRpc("acc80f592bb436c21cdce6e1d5d6087ef2a2f0e66f3aa25c96c83356a4766324"));
const updateProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid(),
  patch: productSchema.partial()
}).parse(input)).handler(createSsrRpc("f60c4de8a0e072d909272f117a614a338a7ea53e6c76d97da6da447680f2ec9c"));
const deleteProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("154b8633eea94111b40f7036631572cb49e5f458d27dce468c3338ae0c0dc0db"));
const adminSummary = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a1b2950455ed9af494bbb9cddc219eb98df158b8da641138885ccbf422199842"));
const checkIsAdmin = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("26bfd577b6f062bf54ad107598db01ac3781476dd6f4f4b32646516c46d7d386"));
const logoLight = "/assets/mtc-logo-full-DW305s-Y.png";
const logoDark = "/assets/mtc-logo-dark-9oK8cx60.png";
const links = [
  { href: "#panels", label: "Panels" },
  { href: "#inverters", label: "Inverters" },
  { href: "#batteries", label: "Storage" },
  { href: "#contact", label: "Contact" }
];
function Navbar() {
  const [scrolled, setScrolled] = reactExports.useState(false);
  const { totals, toggleCart, bounceKey } = useStore();
  const { theme, toggle } = useTheme();
  const navRef = reactExports.useRef(null);
  const [pill, setPill] = reactExports.useState({ left: 0, width: 0, opacity: 0 });
  const [activeHash, setActiveHash] = reactExports.useState("");
  const navigate = useNavigate();
  const isAdminFn = useServerFn(checkIsAdmin);
  const [user, setUser] = reactExports.useState(null);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  const [userMenuOpen, setUserMenuOpen] = reactExports.useState(false);
  const userMenuRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    let mounted = true;
    const refresh = async (session) => {
      if (!session) {
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
        }
        return;
      }
      if (mounted) setUser({ email: session.user.email ?? null });
      try {
        const res = await isAdminFn({});
        if (mounted) setIsAdmin(!!res.isAdmin);
      } catch {
        if (mounted) setIsAdmin(false);
      }
    };
    supabase.auth.getSession().then(({ data }) => refresh(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => refresh(session));
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isAdminFn]);
  reactExports.useEffect(() => {
    const onDoc = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  reactExports.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let current = "";
      for (const l of links) {
        const el = document.querySelector(l.href);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 140 && r.bottom > 140) current = l.href;
        }
      }
      setActiveHash(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  reactExports.useEffect(() => {
    const nav = navRef.current;
    if (!nav || !activeHash) {
      setPill((p) => ({ ...p, opacity: 0 }));
      return;
    }
    const el = nav.querySelector(`a[data-href="${activeHash}"]`);
    if (!el) return;
    const nr = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPill({ left: r.left - nr.left, width: r.width, opacity: 1 });
  }, [activeHash, scrolled]);
  const onEnter = (e) => {
    const nav = navRef.current;
    if (!nav) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nr = nav.getBoundingClientRect();
    setPill({ left: r.left - nr.left, width: r.width, opacity: 1 });
  };
  const onLeaveNav = () => {
    if (!activeHash) setPill((p) => ({ ...p, opacity: 0 }));
    else {
      const nav = navRef.current;
      const el = nav?.querySelector(`a[data-href="${activeHash}"]`);
      if (el && nav) {
        const r = el.getBoundingClientRect();
        const nr = nav.getBoundingClientRect();
        setPill({ left: r.left - nr.left, width: r.width, opacity: 1 });
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "header",
    {
      className: `fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out ${scrolled ? "glass border-b border-border/40 py-2.5" : "bg-transparent py-5"}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: theme === "dark" ? logoDark : logoLight,
            alt: "MTC Solar",
            className: `w-auto transition-all duration-300 ${scrolled ? "h-8" : "h-10"}`
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "nav",
          {
            ref: navRef,
            onMouseLeave: onLeaveNav,
            className: "relative hidden items-center gap-1 md:flex",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  "aria-hidden": true,
                  className: "pointer-events-none absolute top-1/2 h-8 -translate-y-1/2 rounded-full bg-gold/15 ring-1 ring-gold/30 transition-all duration-300 ease-out",
                  style: { left: pill.left, width: pill.width, opacity: pill.opacity }
                }
              ),
              links.map((l) => {
                const active = activeHash === l.href;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: l.href,
                    "data-href": l.href,
                    onMouseEnter: onEnter,
                    className: `relative z-10 px-4 py-2 text-sm transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                    children: l.label
                  },
                  l.href
                );
              })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: toggle,
              "aria-label": "Toggle theme",
              className: "grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-surface/60 text-muted-foreground transition-all hover:text-foreground hover:border-gold/50",
              children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: toggleCart,
              "aria-label": "Cart",
              className: "relative grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-surface/60 text-foreground transition-all hover:border-gold/50",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex animate-cart-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4" }) }, `icon-${bounceKey}`),
                totals.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "absolute -right-1 -top-1 grid h-5 min-w-5 animate-cart-bounce place-items-center rounded-full bg-gold-gradient px-1 text-[10px] font-semibold text-background shadow-gold",
                    children: totals.count
                  },
                  `badge-${bounceKey}`
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: userMenuRef, className: "relative", children: user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setUserMenuOpen((o) => !o),
                "aria-label": "Account",
                className: "grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-surface/60 text-foreground transition-all hover:border-gold/50",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" })
              }
            ),
            userMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border/60 px-4 py-3 text-xs text-muted-foreground truncate", children: user.email }),
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => {
                    setUserMenuOpen(false);
                    navigate({ to: "/admin/dashboard" });
                  },
                  className: "flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-surface-elevated/60",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-gold" }),
                    "Admin Dashboard"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: async () => {
                    setUserMenuOpen(false);
                    await supabase.auth.signOut();
                  },
                  className: "flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-surface-elevated/60",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
                    "Sign Out"
                  ]
                }
              )
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/admin/login",
              "aria-label": "Sign in",
              className: "grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-surface/60 text-muted-foreground transition-all hover:text-foreground hover:border-gold/50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" })
            }
          ) })
        ] })
      ] })
    }
  );
}
const products = [
  { label: "Solar Panels", href: "#panels" },
  { label: "Hybrid Inverters", href: "#inverters" },
  { label: "On-Grid Inverters", href: "#inverters" },
  { label: "Lithium Batteries", href: "#batteries" }
];
const corporate = [
  { label: "Customer Support", href: "#contact" },
  { label: "Terms of Service", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Admin Portal", href: "/admin" }
];
const socials = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: MessageCircle, href: "#", label: "WhatsApp" }
];
const linkClass = "text-sm text-muted-foreground transition-colors duration-200 hover:text-gold";
function Footer() {
  const { theme } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { id: "contact", className: "relative mt-24 border-t border-border/60 bg-surface/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: theme === "dark" ? logoDark : logoLight,
            alt: "MTC Solar",
            className: "h-10 w-auto"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground", children: "Engineered solar hardware for serious homes and industries — sized, shipped, supported." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex items-center gap-2", children: socials.map(({ Icon, href, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href,
            "aria-label": label,
            className: "grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background/60 text-muted-foreground transition-all duration-200 hover:border-gold/50 hover:text-gold",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" })
          },
          label
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground", children: "Core Products" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 space-y-3", children: products.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: l.href, className: linkClass, children: l.label }) }, l.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground", children: "Corporate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 space-y-3", children: corporate.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: l.href, className: linkClass, children: l.label }) }, l.label)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground", children: "Store Info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-5 space-y-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "mt-0.5 h-4 w-4 shrink-0 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:+923000000000", className: "transition-colors hover:text-gold", children: "+92 300 000 0000" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "mt-0.5 h-4 w-4 shrink-0 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:hello@mtcsolar.pk", className: "transition-colors hover:text-gold", children: "hello@mtcsolar.pk" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "mt-0.5 h-4 w-4 shrink-0 text-gold" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "MTC Solar HQ, Main Boulevard, Lahore, Pakistan" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 md:flex-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "© 2026 MTC Solar. All rights reserved." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative grid h-2.5 w-2.5 place-items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-emerald-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "System Status: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-emerald-400", children: "Optimal" })
        ] })
      ] })
    ] })
  ] }) });
}
function SummaryBar() {
  const { totals, clear, openCheckout } = useStore();
  const visible = totals.count > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transition-all duration-500 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-auto flex items-center gap-3 rounded-full border border-border/60 glass px-3 py-2 shadow-gold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden items-center gap-4 px-2 text-xs sm:flex", children: [
          totals.panels > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-3.5 w-3.5" }), label: `${totals.panels} Panels` }),
          totals.inverters > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }), label: `${totals.inverters} Inverter${totals.inverters > 1 ? "s" : ""}` }),
          totals.batteries > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Battery, { className: "h-3.5 w-3.5" }), label: `${totals.batteries} Battery` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 border-l border-border/60 pl-4 text-muted-foreground", children: [
            "Est. ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-sm font-semibold text-foreground", children: [
              totals.kw.toFixed(1),
              " kW"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: clear,
            className: "hidden rounded-full px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground sm:inline",
            children: "Clear"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: openCheckout,
            className: "inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5",
            children: [
              "Checkout",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
            ]
          }
        )
      ] })
    }
  );
}
function Chip({ icon, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-surface-elevated/80 px-2.5 py-1 text-[11px] font-medium text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gold", children: icon }),
    " ",
    label
  ] });
}
function CartDrawer() {
  const { cartOpen, closeCart, items, setQty, remove, removeAll, clear, totals, openCheckout } = useStore();
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onClick: closeCart,
        className: `fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${cartOpen ? "opacity-100" : "pointer-events-none opacity-0"}`,
        "aria-hidden": !cartOpen
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        role: "dialog",
        "aria-label": "Your system cart",
        className: `fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-border/60 bg-surface shadow-gold transition-transform duration-500 ease-out ${cartOpen ? "translate-x-0" : "translate-x-full"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between border-b border-border/60 px-6 py-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-gold", children: "Your system" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-semibold tracking-tight", children: [
                totals.count,
                " item",
                totals.count === 1 ? "" : "s"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: closeCart,
                "aria-label": "Close cart",
                className: "grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-gold/50",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-6 py-4", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 grid h-14 w-14 place-items-center rounded-full border border-border/60 bg-surface-elevated text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold", children: "Your cart is empty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-xs text-sm text-muted-foreground", children: "Add panels, an inverter and storage to build your system." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: items.map(({ product, qty }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex gap-3 rounded-2xl border border-border/60 bg-surface-elevated/60 p-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: product.image,
                    alt: product.name,
                    className: "h-20 w-20 flex-none rounded-xl object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      product.series && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[10px] uppercase tracking-widest text-muted-foreground", children: product.series }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "truncate font-display text-sm font-semibold", children: product.name })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => removeAll(product.id),
                        "aria-label": `Remove ${product.name}`,
                        className: "grid h-7 w-7 flex-none place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface p-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => remove(product.id),
                          "aria-label": "Decrease quantity",
                          className: "grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "number",
                          min: 1,
                          value: qty,
                          onChange: (e) => setQty(product.id, parseInt(e.target.value, 10) || 0),
                          className: "w-8 bg-transparent text-center text-xs font-semibold tabular-nums focus:outline-none"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => setQty(product.id, qty + 1),
                          "aria-label": "Increase quantity",
                          className: "grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
                        }
                      )
                    ] }),
                    product.watts !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: product.category === "battery" ? `${(product.watts * qty / 1e3).toFixed(1)} kWh` : `${(product.watts * qty / 1e3).toFixed(2)} kW` })
                  ] })
                ] })
              ]
            },
            product.id
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border/60 px-6 py-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Estimated system size" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-base font-semibold text-foreground", children: [
                totals.kw.toFixed(1),
                " kW"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: clear,
                  disabled: items.length === 0,
                  className: "rounded-full border border-border/60 px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
                  children: "Clear"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: openCheckout,
                  disabled: items.length === 0,
                  className: "inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50",
                  children: [
                    "Proceed to Checkout",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
                  ]
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
}
const itemSchema = objectType({
  product_id: stringType().nullable().optional(),
  product_name: stringType().min(1).max(255),
  quantity: numberType().int().min(1).max(1e3),
  unit_price: numberType().min(0)
});
const createOrderSchema = objectType({
  customer_name: stringType().trim().min(1).max(200),
  customer_email: stringType().trim().email().max(255),
  customer_phone: stringType().trim().min(7).max(40),
  city: stringType().trim().min(1).max(120),
  delivery_address: stringType().trim().min(5).max(1e3),
  permanent_address: stringType().trim().max(1e3).optional().nullable(),
  notes: stringType().trim().max(1e3).optional().nullable(),
  payment_method: enumType(["cod", "bank_transfer", "easypaisa", "jazzcash"]),
  items: arrayType(itemSchema).min(1).max(100)
});
const createOrder = createServerFn({
  method: "POST"
}).inputValidator((input) => createOrderSchema.parse(input)).handler(createSsrRpc("7f92d135aa3763ddd5bf6d4d9f84832b6b591cbaa35dcc4048b4b1beed8e7bf3"));
const listOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("e004c3669ad9314e0f13dd8e45194bd1d7a95f814599b1d8484097691817695f"));
const updateOrderStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid(),
  status: enumType(["pending", "processing", "confirmed", "shipped", "delivered", "cancelled"])
}).parse(input)).handler(createSsrRpc("ce3247af923fb83e1b50e04a2d3399abe6b8ac7e9c8330b2019de9668492b17f"));
const fmt = (n) => "Rs " + n.toLocaleString("en-PK");
const payToDb = (p) => p === "bank" ? "bank_transfer" : p;
function CheckoutModal() {
  const { checkoutOpen, closeCheckout, items, totals, clear } = useStore();
  const createOrderFn = useServerFn(createOrder);
  const [step, setStep] = reactExports.useState(0);
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [city, setCity] = reactExports.useState("");
  const [shipping, setShipping] = reactExports.useState("standard");
  const [pay, setPay] = reactExports.useState("bank");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [orderId, setOrderId] = reactExports.useState("MTC-PENDING");
  const subtotal = reactExports.useMemo(
    () => items.reduce((s, { product, qty }) => s + priceFor(product) * qty, 0),
    [items]
  );
  const shipCost = shipping === "express" ? 4500 : shipping === "install" ? 12500 : 2500;
  const tax = Math.round(subtotal * 0.05);
  const grand = subtotal + shipCost + tax;
  reactExports.useEffect(() => {
    if (!checkoutOpen) {
      const t = setTimeout(() => setStep(0), 300);
      return () => clearTimeout(t);
    }
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [checkoutOpen]);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeCheckout();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCheckout]);
  const canNext = step === 0 ? items.length > 0 : step === 1 ? name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(email) && /^[0-9+\-\s]{7,}$/.test(phone) && address.trim().length > 5 && city.trim().length > 1 : step === 2 ? true : false;
  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const downloadInvoice = () => {
    const lines = [];
    lines.push("MTC SOLAR — TAX INVOICE");
    lines.push("Order: " + orderId);
    lines.push("Date: " + (/* @__PURE__ */ new Date()).toLocaleString());
    lines.push("");
    lines.push("Customer: " + name);
    lines.push("Email: " + email);
    lines.push("Phone: " + phone);
    lines.push("Address: " + address + ", " + city);
    lines.push("");
    lines.push("Items:");
    items.forEach(({ product, qty }) => {
      lines.push(`  ${qty} x ${product.name} @ ${fmt(priceFor(product))}  =  ${fmt(priceFor(product) * qty)}`);
    });
    lines.push("");
    lines.push("Subtotal:  " + fmt(subtotal));
    lines.push("Shipping:  " + fmt(shipCost) + "  (" + shipping + ")");
    lines.push("GST (5%):  " + fmt(tax));
    lines.push("GRAND TOTAL: " + fmt(grand));
    lines.push("");
    lines.push("Payment: " + payLabel(pay));
    lines.push("");
    lines.push("Thank you for choosing MTC Solar.");
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${orderId}-invoice.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const confirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await createOrderFn({
        data: {
          customer_name: name.trim(),
          customer_email: email.trim(),
          customer_phone: phone.trim(),
          city: city.trim(),
          delivery_address: address.trim(),
          notes: `Shipping: ${shipping}. Subtotal ${subtotal}, ship ${shipCost}, tax ${tax}, total ${grand}`,
          payment_method: payToDb(pay),
          items: items.map(({ product, qty }) => ({
            product_id: null,
            product_name: product.name,
            quantity: qty,
            unit_price: priceFor(product)
          }))
        }
      });
      setOrderId(res.order_number);
      toast.success("Order placed: " + res.order_number);
      setStep(3);
    } catch (e) {
      toast.error(e.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };
  const finish = () => {
    clear();
    closeCheckout();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onClick: closeCheckout,
        className: `fixed inset-0 z-[80] bg-background/70 backdrop-blur-md transition-opacity duration-300 ${checkoutOpen ? "opacity-100" : "pointer-events-none opacity-0"}`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        role: "dialog",
        "aria-label": "Checkout",
        className: `fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6 transition-all duration-300 ${checkoutOpen ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-full max-h-[860px] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border/60 bg-surface shadow-gold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between border-b border-border/60 px-6 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-gold", children: "Secure checkout" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold tracking-tight", children: "Complete your order" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: closeCheckout,
                "aria-label": "Close checkout",
                className: "grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-gold/50",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border/60 px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex items-center gap-3", children: ["Customer", "Shipping", "Payment", "Done"].map((label, i) => {
            const done = step > i;
            const active = step === i;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex flex-1 items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `grid h-7 w-7 flex-none place-items-center rounded-full text-[11px] font-semibold transition-all ${done ? "bg-gold-gradient text-background shadow-gold" : active ? "border border-gold/60 bg-gold/10 text-gold" : "border border-border bg-surface-elevated text-muted-foreground"}`,
                  children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) : i + 1
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `hidden text-xs sm:inline ${active ? "text-foreground" : "text-muted-foreground"}`, children: label }),
              i < 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-px flex-1 ${done ? "bg-gold/60" : "bg-border"}` })
            ] }, label);
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_360px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-y-auto px-6 py-6", children: [
              step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "Your system" }),
                items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Cart is empty. Add hardware to continue." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: items.map(({ product, qty }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-4 rounded-2xl border border-border/60 bg-surface-elevated/60 p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, alt: product.name, className: "h-16 w-16 flex-none rounded-xl object-cover" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-display text-sm font-semibold", children: product.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
                      qty,
                      " × ",
                      fmt(priceFor(product))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold tabular-nums", children: fmt(priceFor(product) * qty) })
                ] }, product.id)) })
              ] }),
              step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "flex items-center gap-2 font-display text-lg font-semibold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-gold" }),
                  " Customer information"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FloatField, { label: "Full name", value: name, onChange: setName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FloatField, { label: "Email address", value: email, onChange: setEmail }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FloatField, { label: "Phone (e.g. 03xx-xxxxxxx)", value: phone, onChange: setPhone }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FloatField, { label: "City", value: city, onChange: setCity }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FloatField, { label: "Detailed shipping address", value: address, onChange: setAddress, className: "sm:col-span-2", textarea: true })
                ] })
              ] }),
              step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-fade-in", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-3 flex items-center gap-2 font-display text-lg font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-gold" }),
                    " Delivery & installation"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShipOption, { v: "standard", cur: shipping, set: setShipping, title: "Standard freight", sub: "5–8 days · nationwide", price: 2500 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShipOption, { v: "express", cur: shipping, set: setShipping, title: "Express freight", sub: "2–3 days · priority", price: 4500 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShipOption, { v: "install", cur: shipping, set: setShipping, title: "Install team", sub: "Mount + commission", price: 12500 })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-3 flex items-center gap-2 font-display text-lg font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-gold" }),
                    " Payment method"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PayOption, { v: "bank", cur: pay, set: setPay, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "h-4 w-4" }), title: "Direct Bank Transfer", sub: "Meezan · HBL · UBL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PayOption, { v: "cod", cur: pay, set: setPay, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }), title: "Cash on Delivery", sub: "Verified before dispatch" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PayOption, { v: "easypaisa", cur: pay, set: setPay, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" }), title: "EasyPaisa Wallet", sub: "Instant confirmation" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PayOption, { v: "jazzcash", cur: pay, set: setPay, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" }), title: "JazzCash Wallet", sub: "Instant confirmation" })
                  ] })
                ] })
              ] }),
              step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center px-4 py-10 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mb-6 grid h-24 w-24 place-items-center rounded-full bg-gold-gradient shadow-gold animate-success-pop", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 48 48", className: "h-12 w-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: "M12 24 L21 33 L36 16",
                    fill: "none",
                    stroke: "oklch(0.18 0.02 260)",
                    strokeWidth: "4",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "48",
                    className: "animate-check-draw"
                  }
                ) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-semibold", children: "Order confirmed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 max-w-md text-sm text-muted-foreground", children: [
                  "Thank you, ",
                  name || "customer",
                  ". Order ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-gold", children: orderId }),
                  " has been logged to the MTC ledger. Our team will reach out on ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: phone }),
                  " shortly."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-center justify-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: downloadInvoice,
                      className: "inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-5 py-2.5 text-xs font-semibold text-foreground hover:border-gold/50",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
                        " Download invoice"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: finish,
                      className: "inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5",
                      children: [
                        "Continue browsing",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            step !== 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden border-l border-border/60 bg-surface-elevated/60 px-6 py-6 lg:block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Order summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "mt-1 font-display text-lg font-semibold", children: [
                totals.count,
                " item",
                totals.count === 1 ? "" : "s",
                " · ",
                totals.kw.toFixed(1),
                " kW"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 max-h-64 space-y-2 overflow-y-auto pr-2 text-xs", children: items.map(({ product, qty }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between gap-3 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                  qty,
                  " × ",
                  product.name
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums text-foreground", children: fmt(priceFor(product) * qty) })
              ] }, product.id)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-2 border-t border-border/60 pt-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Subtotal", value: fmt(subtotal) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: `Shipping (${shipping})`, value: fmt(shipCost) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "GST (5%)", value: fmt(tax) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-baseline justify-between border-t border-border/60 pt-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Grand total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-semibold text-gold", children: fmt(grand) })
                ] })
              ] })
            ] })
          ] }),
          step !== 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "flex items-center justify-between gap-3 border-t border-border/60 px-6 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: back,
                disabled: step === 0,
                className: "inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
                  " Back"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground lg:hidden", children: [
              "Total ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-semibold text-foreground", children: fmt(grand) })
            ] }),
            step < 2 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: next,
                disabled: !canNext,
                className: "inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40",
                children: [
                  "Continue ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: confirm,
                disabled: submitting,
                className: "inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60",
                children: [
                  submitting ? "Placing…" : "Place order",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" })
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function payLabel(p) {
  return p === "bank" ? "Direct Bank Transfer" : p === "cod" ? "Cash on Delivery" : p === "easypaisa" ? "EasyPaisa Wallet" : "JazzCash Wallet";
}
function Row({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums text-foreground", children: value })
  ] });
}
function FloatField({
  label,
  value,
  onChange,
  className = "",
  textarea = false
}) {
  const filled = value.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `relative block ${className}`, children: [
    textarea ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        rows: 3,
        className: "peer block w-full resize-none rounded-2xl border border-border/60 bg-surface px-4 pb-3 pt-6 text-sm text-foreground outline-none transition-all placeholder-transparent focus:border-gold/60 focus:ring-2 focus:ring-gold/20",
        placeholder: label
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        className: "peer block w-full rounded-2xl border border-border/60 bg-surface px-4 pb-2 pt-6 text-sm text-foreground outline-none transition-all placeholder-transparent focus:border-gold/60 focus:ring-2 focus:ring-gold/20",
        placeholder: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `pointer-events-none absolute left-4 top-2 text-[10px] uppercase tracking-widest text-muted-foreground transition-all ${filled ? "opacity-100" : "opacity-0 translate-y-2"} peer-focus:opacity-100 peer-focus:translate-y-0 peer-focus:text-gold`,
        children: label
      }
    )
  ] });
}
function ShipOption({
  v,
  cur,
  set,
  title,
  sub,
  price
}) {
  const active = cur === v;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => set(v),
      className: `group relative flex flex-col rounded-2xl border p-4 text-left transition-all ${active ? "border-gold/60 bg-gold/5 shadow-gold" : "border-border/60 bg-surface hover:border-gold/40"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-semibold", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 text-[11px] text-muted-foreground", children: sub }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 font-display text-base font-semibold text-gold", children: fmt(price) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full border transition-all ${active ? "border-gold bg-gold-gradient" : "border-border"}`,
            children: active && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-background" })
          }
        )
      ]
    }
  );
}
function PayOption({
  v,
  cur,
  set,
  title,
  sub,
  icon
}) {
  const active = cur === v;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => set(v),
      className: `flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${active ? "border-gold/60 bg-gold/5 shadow-gold" : "border-border/60 bg-surface hover:border-gold/40"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `grid h-9 w-9 flex-none place-items-center rounded-full ${active ? "bg-gold-gradient text-background" : "bg-surface-elevated text-gold"}`, children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-display text-sm font-semibold", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] text-muted-foreground", children: sub })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `grid h-5 w-5 flex-none place-items-center rounded-full border ${active ? "border-gold bg-gold-gradient" : "border-border"}`, children: active && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-background" }) })
      ]
    }
  );
}
function ScrollProgress() {
  const [progress, setProgress] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "aria-hidden": true,
      className: "fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent pointer-events-none",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full bg-gold-gradient shadow-gold transition-[width] duration-150 ease-out",
          style: { width: `${progress}%` }
        }
      )
    }
  );
}
const sections = [
  { id: "panels", label: "Panels" },
  { id: "inverters", label: "Inverters" },
  { id: "batteries", label: "Storage" },
  { id: "contact", label: "Contact" }
];
function SideNav() {
  const [active, setActive] = reactExports.useState("");
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
      let current = "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 160 && r.bottom > 160) current = s.id;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "aside",
    {
      "aria-label": "Section navigation",
      className: `fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 rounded-full border border-gold/40 bg-surface/70 px-2 py-3 shadow-gold backdrop-blur-md transition-all duration-500 md:flex ${visible ? "opacity-100 translate-x-0" : "pointer-events-none opacity-0 translate-x-4"}`,
      children: sections.map((s) => {
        const isActive = active === s.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => scrollTo(s.id),
            "aria-label": s.label,
            className: "group relative grid h-4 w-4 place-items-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `block rounded-full transition-all duration-300 ${isActive ? "h-3.5 w-3.5 bg-gold-gradient shadow-gold ring-2 ring-gold/40 animate-gold-pulse" : "h-2 w-2 bg-gold/50 group-hover:h-3 group-hover:w-3 group-hover:bg-gold group-hover:shadow-gold"}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border border-gold/40 bg-surface/95 px-2 py-1 text-xs font-medium text-gold opacity-0 shadow-gold backdrop-blur transition-opacity duration-200 group-hover:opacity-100", children: s.label })
            ]
          },
          s.id
        );
      })
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$7 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MTC Solar | Premium Solar Store" },
      { name: "description", content: "MTC Solar — premium solar panels, hybrid inverters and lithium storage." },
      { property: "og:site_name", content: "MTC Solar" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "MTC Solar | Premium Solar Store" },
      { name: "twitter:title", content: "MTC Solar | Premium Solar Store" },
      { property: "og:description", content: "MTC Solar — premium solar panels, hybrid inverters and lithium storage." },
      { name: "twitter:description", content: "MTC Solar — premium solar panels, hybrid inverters and lithium storage." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/1kiQpu6jQZVrWJsY8RgLBwhPjXm2/social-images/social-1779442379244-favicon.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/1kiQpu6jQZVrWJsY8RgLBwhPjXm2/social-images/social-1779442379244-favicon.webp" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$7.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = path.startsWith("/admin") || path.startsWith("/_admin");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StoreProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-background text-foreground", children: [
    !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollProgress, {}),
    !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(SideNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryBar, {}),
    !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(CartDrawer, {}),
    !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(CheckoutModal, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-right", theme: "dark" })
  ] }) }) }) });
}
const $$splitComponentImporter$6 = () => import("../_admin-KDrHLF7b.mjs");
const Route$6 = createFileRoute("/_admin")({
  head: () => ({
    meta: [{
      title: "MTC Solar | Admin ERP Dashboard"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./index-DyWRGGk1.mjs");
const Route$5 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "MTC Solar | Premium Solar Store"
    }, {
      name: "description",
      content: "Engineered solar systems: bifacial panels, hybrid inverters and IP-rated lithium storage."
    }, {
      property: "og:title",
      content: "MTC Solar — Premium Solar Hardware"
    }, {
      property: "og:description",
      content: "Curated solar systems for serious homes and industries."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const panelImg = "/assets/panel-CEo1Ef3t.jpg";
const inverterImg = "/assets/inverter-Bt7nEj8Q.jpg";
const batteryImg = "/assets/battery-DIWiuY5v.jpg";
const panels = [
  { id: "mustang-595", name: "Inverex Mustang 595W", series: "Mustang Series", category: "panel", watts: 595, tags: ["Bifacial", "N-Type", "Steel Frame"], image: panelImg },
  { id: "mustang-610", name: "Inverex Mustang 610W", series: "Mustang Series", category: "panel", watts: 610, tags: ["Bifacial", "N-Type", "Steel Frame"], image: panelImg },
  { id: "mustang-720", name: "Inverex Mustang 720W", series: "Mustang Series", category: "panel", watts: 720, tags: ["Bifacial", "Steel Frame"], image: panelImg },
  { id: "ja-580", name: "JA Solar DeepBlue 580W", series: "DeepBlue 4.0", category: "panel", watts: 580, tags: ["N-Type", "Mono PERC"], image: panelImg },
  { id: "longi-himo7", name: "Longi Hi-MO 7 590W", series: "Hi-MO 7", category: "panel", watts: 590, tags: ["Bifacial", "HPBC"], image: panelImg },
  { id: "longi-himox10", name: "Longi Hi-MO X10 660W", series: "Hi-MO X10", category: "panel", watts: 660, tags: ["Back-Contact", "HPDC"], image: panelImg }
];
const invertersHybrid = [
  { id: "veyron-1.6", name: "Veyron II 1.6kW", series: "Veyron II", category: "inverter", watts: 1600, tags: ["Hybrid", "1-Phase"], image: inverterImg },
  { id: "veyron-3", name: "Veyron II 3kW", series: "Veyron II", category: "inverter", watts: 3e3, tags: ["Hybrid", "1-Phase"], image: inverterImg },
  { id: "veyron-6", name: "Veyron II 6kW", series: "Veyron II", category: "inverter", watts: 6e3, tags: ["Hybrid", "1-Phase"], image: inverterImg },
  { id: "yukon-5", name: "Yukon II 5kW", series: "Yukon II", category: "inverter", watts: 5e3, tags: ["Hybrid", "Wifi"], image: inverterImg },
  { id: "nitrox-10", name: "Nitrox Hybrid 10kW", series: "Nitrox", category: "inverter", watts: 1e4, tags: ["Hybrid", "3-Phase"], image: inverterImg }
];
const invertersOnGrid = [
  { id: "nitrox-25", name: "Nitrox On-Grid 25kW", series: "Nitrox", category: "inverter", watts: 25e3, tags: ["On-Grid", "3-Phase"], image: inverterImg },
  { id: "nitrox-60", name: "Nitrox On-Grid 60kW", series: "Nitrox", category: "inverter", watts: 6e4, tags: ["On-Grid", "3-Phase"], image: inverterImg },
  { id: "nitrox-136", name: "Nitrox On-Grid 136kW", series: "Nitrox", category: "inverter", watts: 136e3, tags: ["On-Grid", "Industrial"], image: inverterImg }
];
const batteriesOutdoor = [
  { id: "bat-ip65-200", name: "Aegis 200Ah IP65", category: "battery", watts: 10240, tags: ["IP65", "Outdoor Shield", "LFP"], image: batteryImg },
  { id: "bat-ip65-280", name: "Aegis 280Ah IP65", category: "battery", watts: 14336, tags: ["IP65", "Outdoor Shield", "LFP"], image: batteryImg },
  { id: "bat-ip65-314", name: "Aegis 314Ah IP65", category: "battery", watts: 16077, tags: ["IP65", "Outdoor Shield", "LFP"], image: batteryImg }
];
const batteriesIndoor = [
  { id: "bat-ip21-100", name: "Aegis 100Ah IP21", category: "battery", watts: 5120, tags: ["IP21", "Indoor", "LFP"], image: batteryImg },
  { id: "bat-ip21-200", name: "Aegis 200Ah IP21", category: "battery", watts: 10240, tags: ["IP21", "Indoor", "LFP"], image: batteryImg },
  { id: "bat-ip21-280", name: "Aegis 280Ah IP21", category: "battery", watts: 14336, tags: ["IP21", "Indoor", "LFP"], image: batteryImg }
];
const allProducts = [
  ...panels,
  ...invertersHybrid,
  ...invertersOnGrid,
  ...batteriesOutdoor,
  ...batteriesIndoor
];
function findProduct(id) {
  return allProducts.find((p) => p.id === id);
}
const $$splitNotFoundComponentImporter = () => import("./product._id-XkhmqmTp.mjs");
const $$splitComponentImporter$4 = () => import("./product._id-CGIc8QFL.mjs");
const Route$4 = createFileRoute("/product/$id")({
  loader: ({
    params
  }) => {
    const product = findProduct(params.id);
    if (!product) throw notFound();
    return {
      product
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: loaderData ? [{
      title: `${loaderData.product.name} | MTC Solar | Premium Solar Store`
    }, {
      name: "description",
      content: `${loaderData.product.name} — ${loaderData.product.tags.join(", ")}`
    }, {
      property: "og:title",
      content: `${loaderData.product.name} | MTC Solar`
    }, {
      property: "og:image",
      content: loaderData.product.image
    }] : []
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const $$splitComponentImporter$3 = () => import("./admin.login-BW94Z7ks.mjs");
const Route$3 = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{
      title: "MTC Solar | Admin Login"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./products-BJLAskKJ.mjs");
const Route$2 = createFileRoute("/_admin/products")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./orders-BVohw6oZ.mjs");
const Route$1 = createFileRoute("/_admin/orders")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./dashboard-TIaKixGb.mjs");
const Route = createFileRoute("/_admin/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
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
const AdminRoute = Route$6.update({
  id: "/_admin",
  getParentRoute: () => Route$7
});
const IndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$7
});
const ProductIdRoute = Route$4.update({
  id: "/product/$id",
  path: "/product/$id",
  getParentRoute: () => Route$7
});
const AdminLoginRoute = Route$3.update({
  id: "/admin/login",
  path: "/admin/login",
  getParentRoute: () => Route$7
});
const AdminProductsRoute = Route$2.update({
  id: "/products",
  path: "/products",
  getParentRoute: () => AdminRoute
});
const AdminOrdersRoute = Route$1.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AdminRoute
});
const AdminDashboardRoute = Route.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AdminRoute
});
const AdminRouteChildren = {
  AdminDashboardRoute,
  AdminOrdersRoute,
  AdminProductsRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  AdminLoginRoute,
  ProductIdRoute
};
const routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$4 as R,
  StatusBadge as S,
  adminSummary as a,
  allProducts as b,
  batteriesIndoor as c,
  batteriesOutdoor as d,
  checkIsAdmin as e,
  createProduct as f,
  deleteProduct as g,
  invertersOnGrid as h,
  invertersHybrid as i,
  listProducts as j,
  updateProduct as k,
  listOrders as l,
  useServerFn as m,
  useStore as n,
  panels as p,
  router as r,
  updateOrderStatus as u
};
