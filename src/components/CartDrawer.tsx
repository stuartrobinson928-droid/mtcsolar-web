import { useEffect } from "react";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { useStore } from "@/context/store";

export function CartDrawer() {
  const { cartOpen, closeCart, items, setQty, remove, removeAll, clear, totals, openCheckout } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!cartOpen}
      />
      <aside
        role="dialog"
        aria-label="Your system cart"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-border/60 bg-surface shadow-gold transition-transform duration-500 ease-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold">Your system</p>
            <h2 className="font-display text-xl font-semibold tracking-tight">
              {totals.count} item{totals.count === 1 ? "" : "s"}
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-gold/50"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-full border border-border/60 bg-surface-elevated text-muted-foreground">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <p className="font-display text-base font-semibold">Your cart is empty</p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Add panels, an inverter and storage to build your system.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(({ product, qty }) => (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-2xl border border-border/60 bg-surface-elevated/60 p-3"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 flex-none rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {product.series && (
                          <p className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">
                            {product.series}
                          </p>
                        )}
                        <h4 className="truncate font-display text-sm font-semibold">{product.name}</h4>
                      </div>
                      <button
                        onClick={() => removeAll(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="grid h-7 w-7 flex-none place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface p-0.5">
                        <button
                          onClick={() => remove(product.id)}
                          aria-label="Decrease quantity"
                          className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={qty}
                          onChange={(e) => setQty(product.id, parseInt(e.target.value, 10) || 0)}
                          className="w-8 bg-transparent text-center text-xs font-semibold tabular-nums focus:outline-none"
                        />
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label="Increase quantity"
                          className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {product.watts !== undefined && (
                        <span className="text-[11px] text-muted-foreground">
                          {product.category === "battery"
                            ? `${((product.watts * qty) / 1000).toFixed(1)} kWh`
                            : `${((product.watts * qty) / 1000).toFixed(2)} kW`}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-border/60 px-6 py-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated system size</span>
            <span className="font-display text-base font-semibold text-foreground">
              {totals.kw.toFixed(1)} kW
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clear}
              disabled={items.length === 0}
              className="rounded-full border border-border/60 px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>
            <button
              onClick={openCheckout}
              disabled={items.length === 0}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proceed to Checkout
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}
