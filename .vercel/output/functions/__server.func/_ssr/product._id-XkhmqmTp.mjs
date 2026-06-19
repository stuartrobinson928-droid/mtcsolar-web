import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { R as Route$4 } from "./router-BV9kdTog.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft } from "../_libs/lucide-react.mjs";
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
const SplitNotFoundComponent = () => {
  const {
    id
  } = Route$4.useParams();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 pt-32 pb-24 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-[0.2em] text-gold", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-3 font-display text-3xl font-semibold", children: [
      'Product "',
      id,
      '" not found'
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:border-gold/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
      " Back to catalog"
    ] })
  ] });
};
export {
  SplitNotFoundComponent as notFoundComponent
};
