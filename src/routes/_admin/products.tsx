import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listProducts, createProduct, updateProduct, deleteProduct } from "@/lib/products.functions";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/products")({
  component: ProductsPage,
});

const fmt = (n: number) => "Rs " + Number(n || 0).toLocaleString("en-PK");
const CATEGORIES = ["panel", "inverter", "battery", "accessory"] as const;
const STATUSES = ["active", "out_of_stock", "draft", "hidden"] as const;

type FormState = {
  id?: string;
  title: string;
  category: (typeof CATEGORIES)[number];
  brand: string;
  model_number: string;
  description: string;
  features: string;
  tags: string;
  image_url: string;
  gallery: string;
  price: string;
  sale_price: string;
  stock_quantity: string;
  status: (typeof STATUSES)[number];
  featured: boolean;
};

const empty: FormState = {
  title: "", category: "panel", brand: "", model_number: "", description: "",
  features: "", tags: "", image_url: "", gallery: "",
  price: "0", sale_price: "", stock_quantity: "0", status: "active", featured: false,
};

function ProductsPage() {
  const listFn = useServerFn(listProducts);
  const createFn = useServerFn(createProduct);
  const updateFn = useServerFn(updateProduct);
  const deleteFn = useServerFn(deleteProduct);
  const qc = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => listFn({}),
  });

  const [form, setForm] = useState<FormState | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const open = (p?: any) => {
    if (!p) return setForm(empty);
    setForm({
      id: p.id,
      title: p.title, category: p.category, brand: p.brand ?? "", model_number: p.model_number ?? "",
      description: p.description ?? "",
      features: (p.features || []).join("\n"),
      tags: (p.tags || []).join(", "),
      image_url: p.image_url ?? "", gallery: (p.gallery || []).join("\n"),
      price: String(p.price ?? 0), sale_price: p.sale_price ? String(p.sale_price) : "",
      stock_quantity: String(p.stock_quantity ?? 0),
      status: p.status, featured: !!p.featured,
    });
  };

  const upload = async (file: File): Promise<string> => {
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const onMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f || !form) return;
    setUploading(true);
    try { setForm({ ...form, image_url: await upload(f) }); }
    catch (err) { toast.error((err as Error).message); }
    finally { setUploading(false); }
  };
  const onGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files || []); if (!fs.length || !form) return;
    setUploading(true);
    try {
      const urls = await Promise.all(fs.map(upload));
      const cur = form.gallery.split("\n").filter(Boolean);
      setForm({ ...form, gallery: [...cur, ...urls].join("\n") });
    } catch (err) { toast.error((err as Error).message); }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!form) return;
    const payload = {
      title: form.title,
      category: form.category,
      brand: form.brand || null,
      model_number: form.model_number || null,
      description: form.description || null,
      specifications: {},
      features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      image_url: form.image_url || null,
      gallery: form.gallery.split("\n").map((s) => s.trim()).filter(Boolean),
      price: Number(form.price) || 0,
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      stock_quantity: Number(form.stock_quantity) || 0,
      status: form.status,
      featured: form.featured,
    };
    try {
      if (form.id) await updateFn({ data: { id: form.id, patch: payload as any } });
      else await createFn({ data: payload as any });
      toast.success(form.id ? "Product updated" : "Product added");
      setForm(null);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-summary"] });
    } catch (e) { toast.error((e as Error).message); }
  };

  const remove = async (id: string) => {
    try {
      await deleteFn({ data: { id } });
      toast.success("Deleted");
      setConfirmDel(null);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gold">Catalogue</p>
          <h1 className="font-display text-2xl font-semibold">Product Management</h1>
        </div>
        <button onClick={() => open()} className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5">
          <Plus className="h-3.5 w-3.5" /> Add product
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated/60 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Loading…</td></tr>}
            {!isLoading && products.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">No products yet. Click “Add product”.</td></tr>}
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-surface-elevated/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url ? <img src={p.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <div className="h-10 w-10 rounded-lg bg-surface-elevated" />}
                    <div className="min-w-0">
                      <p className="truncate font-medium flex items-center gap-1.5">{p.title} {p.featured && <Star className="h-3 w-3 fill-gold text-gold" />}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{p.brand} {p.model_number}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs capitalize">{p.category}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{fmt(Number(p.sale_price || p.price))}</td>
                <td className="px-4 py-3 text-right tabular-nums">{p.stock_quantity}</td>
                <td className="px-4 py-3 text-xs capitalize">{p.status.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => open(p)} className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 text-muted-foreground hover:text-gold"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setConfirmDel(p.id)} className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 text-muted-foreground hover:text-rose-400"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/70 backdrop-blur" onClick={() => setForm(null)} />
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border/60 bg-surface shadow-gold">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-surface px-5 py-4">
              <h2 className="font-display text-lg font-semibold">{form.id ? "Edit product" : "Add product"}</h2>
              <button onClick={() => setForm(null)} className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground"><X className="h-4 w-4" /></button>
            </header>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <FInput label="Title" v={form.title} onChange={(v: string) => setForm({ ...form, title: v })} className="sm:col-span-2" />
              <FSel label="Category" v={form.category} options={CATEGORIES as any} onChange={(v) => setForm({ ...form, category: v as any })} />
              <FSel label="Status" v={form.status} options={STATUSES as any} onChange={(v) => setForm({ ...form, status: v as any })} />
              <FInput label="Brand" v={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
              <FInput label="Model #" v={form.model_number} onChange={(v) => setForm({ ...form, model_number: v })} />
              <FInput label="Price (Rs)" v={form.price} type="number" onChange={(v) => setForm({ ...form, price: v })} />
              <FInput label="Sale Price (Rs)" v={form.sale_price} type="number" onChange={(v) => setForm({ ...form, sale_price: v })} />
              <FInput label="Stock Qty" v={form.stock_quantity} type="number" onChange={(v) => setForm({ ...form, stock_quantity: v })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[var(--gold)]" />
                Featured product
              </label>
              <FTA label="Description" v={form.description} onChange={(v) => setForm({ ...form, description: v })} className="sm:col-span-2" />
              <FTA label="Features (one per line)" v={form.features} onChange={(v) => setForm({ ...form, features: v })} className="sm:col-span-2" />
              <FInput label="Tags (comma separated)" v={form.tags} onChange={(v) => setForm({ ...form, tags: v })} className="sm:col-span-2" />

              <div className="sm:col-span-2">
                <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Main image</p>
                <div className="flex items-center gap-3">
                  {form.image_url && <img src={form.image_url} alt="" className="h-16 w-16 rounded-xl object-cover" />}
                  <input type="file" accept="image/*" onChange={onMainUpload} className="text-xs" />
                  <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="or paste URL" className="flex-1 rounded-xl border border-border/60 bg-surface-elevated/40 px-3 py-2 text-xs" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">Gallery (URLs, one per line)</p>
                <input type="file" accept="image/*" multiple onChange={onGalleryUpload} className="mb-2 text-xs" />
                <textarea value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} rows={3} className="w-full rounded-xl border border-border/60 bg-surface-elevated/40 px-3 py-2 text-xs" />
              </div>
            </div>
            <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-border/60 bg-surface px-5 py-3">
              <button onClick={() => setForm(null)} className="rounded-full border border-border/60 px-4 py-2 text-xs text-muted-foreground hover:text-foreground">Cancel</button>
              <button onClick={save} disabled={uploading} className="rounded-full bg-gold-gradient px-5 py-2 text-xs font-semibold text-background shadow-gold disabled:opacity-60">
                {form.id ? "Save changes" : "Create product"}
              </button>
            </footer>
          </div>
        </div>
      )}

      {confirmDel && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4">
          <div className="absolute inset-0 bg-background/70 backdrop-blur" onClick={() => setConfirmDel(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-border/60 bg-surface p-6 text-center shadow-gold">
            <h3 className="font-display text-lg font-semibold">Delete this product?</h3>
            <p className="mt-1 text-xs text-muted-foreground">This cannot be undone.</p>
            <div className="mt-5 flex justify-center gap-2">
              <button onClick={() => setConfirmDel(null)} className="rounded-full border border-border/60 px-4 py-2 text-xs">Cancel</button>
              <button onClick={() => remove(confirmDel)} className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FInput({ label, v, onChange, type = "text", className = "" }: any) {
  return (
    <label className={`block ${className}`}>
      <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <input type={type} value={v} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border/60 bg-surface-elevated/40 px-3 py-2 text-sm outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20" />
    </label>
  );
}
function FTA({ label, v, onChange, className = "" }: any) {
  return (
    <label className={`block ${className}`}>
      <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <textarea value={v} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full rounded-xl border border-border/60 bg-surface-elevated/40 px-3 py-2 text-sm outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20" />
    </label>
  );
}
function FSel({ label, v, options, onChange }: any) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <select value={v} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border/60 bg-surface-elevated/40 px-3 py-2 text-sm outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20">
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
