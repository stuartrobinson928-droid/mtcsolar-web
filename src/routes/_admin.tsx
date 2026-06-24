import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/products.functions";
import { LayoutDashboard, Package, ShoppingBag, LogOut, ShieldCheck, Loader2 } from "lucide-react";
import { AdminNotifications } from "@/components/AdminNotifications";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const nav = useNavigate();
  const loc = useRouterState({ select: (s) => s.location.pathname });
  const [status, setStatus] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (!cancelled) nav({ to: "/admin/login" });
        return;
      }
      try {
        const res = await checkIsAdmin();
        if (cancelled) return;
        if (!res.isAdmin) {
          await supabase.auth.signOut();
          nav({ to: "/admin/login" });
        } else {
          setStatus("ok");
        }
      } catch (err) {
        console.error("[admin/layout] checkIsAdmin error:", err);
        if (!cancelled) {
          await supabase.auth.signOut();
          nav({ to: "/admin/login" });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nav]);

  if (status === "checking") {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 flex-none flex-col border-r border-border/60 bg-surface lg:flex">
        <div className="flex items-center gap-3 border-b border-border/60 px-5 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gold-gradient text-background shadow-gold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold">MTC Solar</p>
            <p className="font-display text-sm font-semibold">Admin ERP</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((n) => {
            const active = loc.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-gold/10 text-gold ring-1 ring-gold/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-3">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              nav({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-surface/80 px-6 py-3 backdrop-blur">
          <div className="lg:hidden">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-gold-gradient text-background shadow-gold">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="font-display text-sm font-semibold">MTC Admin</p>
            </div>
          </div>
          <nav className="flex items-center gap-1 lg:hidden">
            {navItems.map((n) => {
              const active = loc.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-lg px-3 py-1.5 text-xs ${
                    active ? "bg-gold/15 text-gold" : "text-muted-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <AdminNotifications />
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-gold"
            >
              ↗ View storefront
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
