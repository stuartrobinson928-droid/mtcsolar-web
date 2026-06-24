import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminSummary } from "@/lib/products.functions";
import { Bell, AlertTriangle, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";

const SEEN_KEY = "mtc.admin.lastSeenOrderId";

export function AdminNotifications() {
  const { data } = useQuery({
    queryKey: ["admin-summary"],
    queryFn: adminSummary,
    refetchInterval: 30_000,
  });
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const prevTopId = useRef<string | null>(null);

  useEffect(() => {
    setLastSeen(localStorage.getItem(SEEN_KEY));
  }, []);

  // toast on new orders arriving while admin watches
  useEffect(() => {
    const topId = data?.recentOrders?.[0]?.id ?? null;
    if (!topId) return;
    if (prevTopId.current && topId !== prevTopId.current) {
      const o = data!.recentOrders[0];
      toast.success(`New order ${o.order_number} from ${o.customer_name}`);
    }
    prevTopId.current = topId;
  }, [data]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const newOrders = useMemo(() => {
    if (!data?.recentOrders) return [];
    if (!lastSeen) return data.recentOrders.slice(0, 5);
    const idx = data.recentOrders.findIndex((o: any) => o.id === lastSeen);
    return idx === -1 ? data.recentOrders.slice(0, 5) : data.recentOrders.slice(0, idx);
  }, [data, lastSeen]);

  const lowStock = data?.lowStock ?? [];
  const count = newOrders.length + lowStock.length;

  const markRead = () => {
    const topId = data?.recentOrders?.[0]?.id;
    if (topId) {
      localStorage.setItem(SEEN_KEY, topId);
      setLastSeen(topId);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-surface/60 text-muted-foreground transition-all hover:text-foreground hover:border-gold/50"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-gradient px-1 text-[10px] font-semibold text-background shadow-gold">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-gold">
          <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gold">Notifications</p>
              <p className="font-display text-sm font-semibold">{count} unread</p>
            </div>
            <div className="flex items-center gap-1">
              {count > 0 && (
                <button onClick={markRead} className="text-[11px] text-muted-foreground hover:text-gold">
                  Mark read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>

          <div className="max-h-96 overflow-y-auto">
            {count === 0 && (
              <p className="px-4 py-8 text-center text-xs text-muted-foreground">All caught up.</p>
            )}

            {newOrders.length > 0 && (
              <section className="px-2 py-2">
                <p className="px-2 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground">New orders</p>
                {newOrders.map((o: any) => (
                  <div key={o.id} className="flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-surface-elevated/60">
                    <ShoppingBag className="mt-0.5 h-4 w-4 flex-none text-gold" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{o.order_number}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{o.customer_name} · Rs {Number(o.total_amount).toLocaleString("en-PK")}</p>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {lowStock.length > 0 && (
              <section className="border-t border-border/40 px-2 py-2">
                <p className="px-2 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Low stock</p>
                {lowStock.slice(0, 6).map((p: any) => (
                  <div key={p.id} className="flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-surface-elevated/60">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-amber-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="text-[11px] text-amber-400">{p.stock_quantity} left</p>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
