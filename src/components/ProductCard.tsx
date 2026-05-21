import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useStore, type Product } from "@/context/store";

export function ProductCard({ product, accent }: { product: Product; accent?: string }) {
  const { add } = useStore();
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-surface transition-all duration-300 ease-out hover:-translate-y-2 hover:border-gold/50 hover:shadow-gold"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-elevated">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        {accent && (
          <span className="absolute left-3 top-3 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold backdrop-blur">
            {accent}
          </span>
        )}
      </div>

      <div className="p-5">
        {product.series && (
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{product.series}</p>
        )}
        <h4 className="mt-1 font-display text-base font-semibold tracking-tight">{product.name}</h4>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          add(product);
        }}
        className="absolute inset-x-4 bottom-4 flex translate-y-[120%] items-center justify-center gap-1.5 rounded-full bg-gold-gradient py-2.5 text-xs font-semibold text-background opacity-0 shadow-gold transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
      >
        <Plus className="h-3.5 w-3.5" /> Add to system
      </button>
    </Link>
  );
}
