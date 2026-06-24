import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Upload, ImageOff, X, Save, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCatalog, type CatalogItem, INVENTORY_API_BASE } from "@/hooks/use-inventory-products";
import { compressImage } from "@/lib/image-compress";
import type { Category } from "@/context/store";

export const Route = createFileRoute("/_admin/admin/products")({
  component: ProductsPage,
});

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "battery", label: "Batteries / Storage" },
  { id: "panel", label: "Solar Panels" },
  { id: "inverter", label: "Inverters" },
  { id: "accessory", label: "Accessories" },
];

const fmtPkr = (n: number) => "Rs " + Number(n || 0).toLocaleString("en-PK");

type FilterCat = "all" | Category | "unmapped";

function ProductsPage() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useCatalog();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<FilterCat>("all");
  const [onlyVisible, setOnlyVisible] = useState(false);
  const [editing, setEditing] = useState<CatalogItem | null>(null);

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: items.length, unmapped: 0, panel: 0, inverter: 0, battery: 0, accessory: 0, visible: 0 };
    for (const it of items) {
      if (it.visible) out.visible++;
      if (it.category) out[it.category]++;
      else out.unmapped++;
    }
    return out;
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((it) => {
      if (onlyVisible && !it.visible) return false;
      if (cat === "unmapped" && it.category !== null) return false;
      else if (cat !== "all" && cat !== "unmapped" && it.category !== cat) return false;
      if (!needle) return true;
      return (
        it.name.toLowerCase().includes(needle) ||
        (it.series ?? "").toLowerCase().includes(needle) ||
        it.inventoryCategory.toLowerCase().includes(needle)
      );
    });
  }, [items, q, cat, onlyVisible]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["catalog"] });
  };

  const saveOverride = async (
    inventory_id: string,
    patch: { visible?: boolean; image_url?: string | null; category_override?: Category | null },
  ) => {
    const existing = items.find((i) => i.id === inventory_id);
    const payload = {
      inventory_id,
      visible: patch.visible ?? existing?.visible ?? false,
      image_url: patch.image_url !== undefined ? patch.image_url : existing?.imageOverride ?? null,
      category_override: patch.category_override !== undefined ? patch.category_override : existing?.categoryOverride ?? null,
    };
    const { error } = await supabase.from("storefront_products").upsert(payload, { onConflict: "inventory_id" });
    if (error) {
      toast.error(error.message);
      return;
    }
    invalidate();
  };

  const toggleVisible = async (it: CatalogItem) => {
    if (!it.visible && !it.category) {
      toast.error("Set a category first — this item has no category from the inventory.");
      setEditing(it);
      return;
    }
    await saveOverride(it.id, { visible: !it.visible });
    toast.success(!it.visible ? `${it.name} is now live` : `${it.name} hidden`);
  };

  const uploadImage = async (rawFile: File): Promise<string> => {
    const file = await compressImage(rawFile, { maxDim: 1400, quality: 0.82 });
    const path = `storefront/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, {
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gold">Catalogue · live inventory sync</p>
          <h1 className="font-display text-2xl font-semibold">Storefront Products</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {counts.all} items from inventory · {counts.visible} live on website · toggle items on, set a category and upload product photos.
          </p>
        </div>
      </header>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-surface p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, brand, inventory category…"
            className="w-full rounded-xl border border-border/60 bg-surface-elevated/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-gold/60"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {([
            { id: "all", label: `All (${counts.all})` },
            ...CATEGORIES.map((c) => ({ id: c.id, label: `${c.label} (${counts[c.id] ?? 0})` })),
            { id: "unmapped", label: `Unmapped (${counts.unmapped})` },
          ] as { id: FilterCat; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setCat(t.id)}
              className={`rounded-full px-3 py-1.5 text-[11px] transition-colors ${
                cat === t.id ? "bg-gold/15 text-gold ring-1 ring-gold/30" : "border border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <label className="inline-flex flex-none cursor-pointer items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 text-[11px] text-muted-foreground">
          <input type="checkbox" checked={onlyVisible} onChange={(e) => setOnlyVisible(e.target.checked)} className="accent-[var(--gold)]" />
          Visible only
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated/60 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-center">Show on site</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Loading from Inventory API…</td></tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No matches.</td></tr>
            )}
            {filtered.map((it) => (
              <tr key={it.id} className="hover:bg-surface-elevated/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {it.imageOverride ? (
                      <img src={it.imageOverride} alt="" loading="lazy" className="h-12 w-12 flex-none rounded-lg object-cover ring-1 ring-border/60" />
                    ) : (
                      <div className="grid h-12 w-12 flex-none place-items-center rounded-lg bg-surface-elevated text-muted-foreground"><ImageOff className="h-4 w-4" /></div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{it.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{it.series ?? "—"} · {it.inventoryCategory}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {it.category ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-elevated px-2 py-0.5 text-[11px] capitalize text-foreground">
                      {it.category}
                      {it.categoryOverride && <span className="text-[9px] uppercase tracking-wider text-gold">override</span>}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-400 ring-1 ring-amber-500/30">
                      unmapped
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{fmtPkr(it.price)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{it.stock}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => toggleVisible(it)}
                    role="switch"
                    aria-checked={it.visible}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${it.visible ? "bg-gold-gradient shadow-gold" : "bg-surface-elevated ring-1 ring-border/60"}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-background shadow-sm transition-transform ${it.visible ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditing(it)}
                    className="rounded-full border border-border/60 px-3 py-1.5 text-[11px] text-muted-foreground hover:text-gold hover:border-gold/50"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-right text-[10px] text-muted-foreground">
        Source: <span className="font-mono">{INVENTORY_API_BASE}/api/public/catalog/products</span>
      </p>

      {editing && (
        <EditDrawer
          item={editing}
          onClose={() => setEditing(null)}
          onSave={async (patch) => {
            await saveOverride(editing.id, patch);
            toast.success("Saved");
            setEditing(null);
          }}
          uploadImage={uploadImage}
        />
      )}
    </div>
  );
}

function EditDrawer({
  item,
  onClose,
  onSave,
  uploadImage,
}: {
  item: CatalogItem;
  onClose: () => void;
  onSave: (patch: { visible?: boolean; image_url?: string | null; category_override?: Category | null }) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(item.imageOverride);
  const [category, setCategory] = useState<Category | null>(item.categoryOverride ?? item.category);
  const [visible, setVisible] = useState(item.visible);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const url = await uploadImage(f);
      setImageUrl(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave({
        visible,
        image_url: imageUrl,
        category_override: category === item.category && !item.categoryOverride ? null : category,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-background/70 backdrop-blur" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-xl flex-col border-l border-border/60 bg-surface shadow-gold animate-in slide-in-from-right duration-200">
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-gold">Storefront override</p>
            <h2 className="truncate font-display text-lg font-semibold">{item.name}</h2>
            <p className="truncate text-[11px] text-muted-foreground">{item.series ?? "—"} · {item.inventoryCategory}</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Image */}
          <section>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Product image</p>
            <div className="flex items-start gap-4">
              <label className="group relative grid h-36 w-36 flex-none cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-border/60 bg-surface-elevated/40 hover:border-gold/60">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 grid place-items-center bg-background/60 opacity-0 transition group-hover:opacity-100">
                      <Upload className="h-5 w-5 text-gold" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Upload className="h-5 w-5" />
                    <span className="text-[10px] uppercase tracking-wider">Upload</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={onFile} className="hidden" />
              </label>
              <div className="flex-1 space-y-2 text-xs text-muted-foreground">
                <p>Auto-compressed to WebP, max 1400px on long edge.</p>
                {imageUrl && (
                  <button type="button" onClick={() => setImageUrl(null)} className="text-rose-400 hover:underline">Remove image</button>
                )}
                {!imageUrl && (
                  <p className="text-[11px]">A category placeholder will be used until you upload one.</p>
                )}
              </div>
            </div>
          </section>

          {/* Category */}
          <section>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Category on website</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                    category === c.id
                      ? "bg-gold-gradient text-background shadow-gold"
                      : "border border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {!item.category && (
              <p className="mt-2 text-[11px] text-amber-400">
                Inventory category “{item.inventoryCategory}” didn't auto-map. Pick a category to show this on the site.
              </p>
            )}
          </section>

          {/* Visibility */}
          <section className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface-elevated/40 p-4">
            <div>
              <p className="text-sm font-medium">Show this product on the website</p>
              <p className="text-[11px] text-muted-foreground">
                {visible ? "Live — customers can see it in the catalog." : "Hidden — only visible here in admin."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              disabled={!category}
              role="switch"
              aria-checked={visible}
              className={`relative inline-flex h-7 w-12 flex-none items-center rounded-full transition-colors disabled:opacity-50 ${visible ? "bg-gold-gradient shadow-gold" : "bg-surface ring-1 ring-border/60"}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-background shadow-sm transition-transform ${visible ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </section>

          {/* Read-only inventory snapshot */}
          <section className="rounded-2xl border border-border/60 bg-surface-elevated/40 p-4 text-sm">
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">From inventory (read-only)</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <dt className="text-muted-foreground">Price</dt><dd className="text-right font-mono">{fmtPkr(item.price)}</dd>
              <dt className="text-muted-foreground">Stock</dt><dd className="text-right font-mono">{item.stock}</dd>
              <dt className="text-muted-foreground">Low stock at</dt><dd className="text-right font-mono">{item.lowStockThreshold}</dd>
              <dt className="text-muted-foreground">Watts (parsed)</dt><dd className="text-right font-mono">{item.watts ?? "—"}</dd>
            </dl>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Price &amp; stock come live from the MTC inventory system — edit them there.
            </p>
          </section>
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-border/60 bg-surface px-6 py-3">
          <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            {visible ? <Eye className="h-3 w-3 text-emerald-400" /> : <EyeOff className="h-3 w-3" />}
            {uploading ? "Uploading…" : visible ? "Will be live" : "Hidden"}
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-full border border-border/60 px-4 py-2 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
            <button
              onClick={save}
              disabled={uploading || saving}
              className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2 text-xs font-semibold text-background shadow-gold disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" /> Save
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
