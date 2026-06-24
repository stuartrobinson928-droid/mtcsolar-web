import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/products.functions";
import { toast } from "sonner";
import { Lock, Mail, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already signed in & admin, bounce to dashboard
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      try {
        const res = await checkIsAdmin();
        if (res.isAdmin) nav({ to: "/admin/dashboard" });
      } catch (err) {
        console.error("[admin/login] existing isAdmin error:", err);
      }
    })();
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin/login` },
        });
        if (error) throw error;
      }
      const { error: sErr } = await supabase.auth.signInWithPassword({ email, password });
      if (sErr) throw sErr;
      const res = await checkIsAdmin();
      if (!res.isAdmin) {
        await supabase.auth.signOut();
        toast.error("This account does not have admin access.");
        return;
      }
      toast.success("Welcome back, admin.");
      nav({ to: "/admin/dashboard" });
    } catch (err) {
      console.error("[admin/login] submit error:", err);
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-surface p-8 shadow-gold">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-gradient text-background shadow-gold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold">MTC Solar</p>
            <h1 className="font-display text-xl font-semibold">Admin Portal</h1>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="relative block">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email"
              className="block w-full rounded-2xl border border-border/60 bg-surface-elevated/40 pl-10 pr-3 py-3 text-sm outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            />
          </label>
          <label className="relative block">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              required
              type={showPassword ? "text" : "password"}
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="block w-full rounded-2xl border border-border/60 bg-surface-elevated/40 pl-10 pr-10 py-3 text-sm outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </label>
          <button
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-gradient py-3 text-sm font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create admin account & sign in"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <button
            onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            className="hover:text-gold"
          >
            {mode === "signin" ? "First time? Create admin account" : "Already have an account? Sign in"}
          </button>
          <Link to="/" className="hover:text-gold">← Back to store</Link>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
          Only the designated admin email is granted dashboard access. Other accounts will be rejected automatically.
        </p>
      </div>
    </div>
  );
}
