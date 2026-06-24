import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminSummary } from "@/lib/products.functions";
import { ShoppingBag, Clock, CheckCircle2, XCircle, Package, Banknote, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/dashboard")({
  component: Dashboard,
});

const fmt = (n: number) => "Rs " + Number(n || 0).toLocaleString("en-PK");

function Dashboard() {
  const fn = useServerFn(adminSummary);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-summary"],
    queryFn: () => fn({}),
    refetchInterval: 30_000,
  });

  if (isLoading || !data) return <p className="text-sm text-muted-foreground">Loading dashboard…</p>;

  const cards = [
    { label: "Total Orders", value: data.counts.total, icon: ShoppingBag, tone: "text-foreground" },
    { label: "Pending", value: data.counts.pending, icon: Clock, tone: "text-amber-400" },
    { label: "Completed", value: data.counts.delivered, icon: CheckCircle2, tone: "text-emerald-400" },
    { label: "Cancelled", value: data.counts.cancelled, icon: XCircle, tone: "text-rose-400" },
    { label: "Total Products", value: data.totalProducts, icon: Package, tone: "text-foreground" },
    { label: "Revenue", value: fmt(data.revenue), icon: Banknote, tone: "text-gold" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-gold">Overview</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-border/60 bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.label}</p>
                <Icon className={`h-4 w-4 ${c.tone}`} />
              </div>
              <p className={`mt-2 font-display text-2xl font-semibold ${c.tone}`}>{c.value}</p>
            </div>
          );
        })}
      </div>

      {data.lowStock.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">Low stock alert</p>
          </div>
          <ul className="text-sm">
            {data.lowStock.slice(0, 6).map((p) => (
              <li key={p.id} className="flex justify-between border-b border-border/40 py-1.5 last:border-0">
                <span>{p.title}</span>
                <span className="font-mono text-amber-400">{p.stock_quantity} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/60 bg-surface p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Recent Orders</h2>
          {data.recentOrders.length === 0 ? (
            <p className="text-xs text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-border/40">
              {data.recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{o.order_number}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{o.customer_name}</p>
                  </div>
                  <StatusBadge status={o.status as string} />
                  <p className="w-24 text-right font-mono text-xs tabular-nums">{fmt(Number(o.total_amount))}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border/60 bg-surface p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Recent Activity</h2>
          {data.activity.length === 0 ? (
            <p className="text-xs text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.activity.map((a) => (
                <li key={a.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{a.message}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
    processing: "bg-sky-500/15 text-sky-400 ring-sky-500/30",
    confirmed: "bg-indigo-500/15 text-indigo-400 ring-indigo-500/30",
    shipped: "bg-violet-500/15 text-violet-400 ring-violet-500/30",
    delivered: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
    cancelled: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${map[status] || "bg-muted text-muted-foreground ring-border"}`}>
      {status}
    </span>
  );
}
