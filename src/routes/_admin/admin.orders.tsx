import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listOrders, updateOrderStatus } from "@/lib/orders.functions";
import { useState } from "react";
import { StatusBadge } from "./admin.dashboard";
import { toast } from "sonner";
import { X } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/orders")({
  component: OrdersPage,
});

const fmt = (n: number) => "Rs " + Number(n || 0).toLocaleString("en-PK");
const STATUSES = ["pending", "processing", "confirmed", "shipped", "delivered", "cancelled"] as const;

function OrdersPage() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: listOrders,
    refetchInterval: 30_000,
  });
  const [open, setOpen] = useState<any | null>(null);

  const setStatus = async (id: string, status: (typeof STATUSES)[number]) => {
    try {
      await updateOrderStatus({ id, status });
      toast.success("Order updated");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-summary"] });
      if (open?.id === id) setOpen({ ...open, status });
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-gold">Orders</p>
        <h1 className="font-display text-2xl font-semibold">Order Management</h1>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated/60 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {!isLoading && orders.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">No orders yet.</td></tr>
            )}
            {orders.map((o: any) => (
              <tr key={o.id} className="hover:bg-surface-elevated/40">
                <td className="px-4 py-3 font-mono text-xs">{o.order_number}</td>
                <td className="px-4 py-3">{o.customer_name}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{o.customer_phone}</td>
                <td className="px-4 py-3 text-xs uppercase">{o.payment_method}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{fmt(Number(o.total_amount))}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setOpen(o)} className="text-xs text-gold hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/70 backdrop-blur" onClick={() => setOpen(null)} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-gold">
            <header className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold">Order details</p>
                <h2 className="font-display text-lg font-semibold">{open.order_number}</h2>
              </div>
              <button onClick={() => setOpen(null)} className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 text-sm">
              <Field label="Customer" v={open.customer_name} />
              <Field label="Phone" v={open.customer_phone} />
              <Field label="Email" v={open.customer_email} />
              <Field label="City" v={open.city} />
              <Field label="Delivery Address" v={open.delivery_address} className="sm:col-span-2" />
              {open.permanent_address && <Field label="Permanent Address" v={open.permanent_address} className="sm:col-span-2" />}
              {open.notes && <Field label="Notes" v={open.notes} className="sm:col-span-2" />}
              <Field label="Payment" v={String(open.payment_method).toUpperCase()} />
              <Field label="Total" v={fmt(Number(open.total_amount))} />
            </div>
            <div className="border-t border-border/60 px-5 py-4">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Items</p>
              <ul className="space-y-1.5 text-sm">
                {(open.order_items || []).map((it: any) => (
                  <li key={it.id} className="flex justify-between">
                    <span>{it.quantity} × {it.product_name}</span>
                    <span className="font-mono tabular-nums">{fmt(Number(it.line_total))}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 px-5 py-4">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Set status:</span>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(open.id, s)}
                  className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wider ring-1 transition-all ${
                    open.status === s ? "bg-gold/15 text-gold ring-gold/40" : "text-muted-foreground ring-border hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, v, className = "" }: { label: string; v: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-foreground">{v}</p>
    </div>
  );
}
