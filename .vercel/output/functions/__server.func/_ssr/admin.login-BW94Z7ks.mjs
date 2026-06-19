import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-CyomZAIz.mjs";
import { m as useServerFn, e as checkIsAdmin } from "./router-BV9kdTog.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { q as ShieldCheck, M as Mail, h as Lock, g as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-W7L2fyHk.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-5C9Ki1_H.mjs";
import "../_libs/zod.mjs";
function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState("signin");
  const [busy, setBusy] = reactExports.useState(false);
  const isAdminFn = useServerFn(checkIsAdmin);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data
      } = await supabase.auth.getSession();
      if (!data.session) return;
      try {
        const res = await isAdminFn({});
        if (res.isAdmin) nav({
          to: "/admin/dashboard"
        });
      } catch {
      }
    })();
  }, [nav, isAdminFn]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/login`
          }
        });
        if (error) throw error;
      }
      const {
        error: sErr
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (sErr) throw sErr;
      const res = await isAdminFn({});
      if (!res.isAdmin) {
        await supabase.auth.signOut();
        toast.error("This account does not have admin access.");
        return;
      }
      toast.success("Welcome back, admin.");
      nav({
        to: "/admin/dashboard"
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-background px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-3xl border border-border/60 bg-surface p-8 shadow-gold", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-11 w-11 place-items-center rounded-2xl bg-gold-gradient text-background shadow-gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-gold", children: "MTC Solar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-semibold", children: "Admin Portal" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "relative block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Admin email", className: "block w-full rounded-2xl border border-border/60 bg-surface-elevated/40 pl-10 pr-3 py-3 text-sm outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "relative block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "password", minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Password", className: "block w-full rounded-2xl border border-border/60 bg-surface-elevated/40 pl-10 pr-3 py-3 text-sm outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: busy, className: "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-gradient py-3 text-sm font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5 disabled:opacity-60", children: [
        busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        mode === "signin" ? "Sign in" : "Create admin account & sign in"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode((m) => m === "signin" ? "signup" : "signin"), className: "hover:text-gold", children: mode === "signin" ? "First time? Create admin account" : "Already have an account? Sign in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-gold", children: "← Back to store" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-[11px] leading-relaxed text-muted-foreground", children: "Only the designated admin email is granted dashboard access. Other accounts will be rejected automatically." })
  ] }) });
}
export {
  AdminLogin as component
};
