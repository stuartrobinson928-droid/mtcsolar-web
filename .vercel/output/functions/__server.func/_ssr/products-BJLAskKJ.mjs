import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { m as useServerFn, j as listProducts, f as createProduct, k as updateProduct, g as deleteProduct } from "./router-BV9kdTog.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-CyomZAIz.mjs";
import "../_libs/seroval.mjs";
import { p as Plus, u as Star, n as Pencil, T as Trash2, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./server-W7L2fyHk.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-5C9Ki1_H.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
const fmt = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");
const CATEGORIES = ["panel", "inverter", "battery", "accessory"];
const STATUSES = ["active", "out_of_stock", "draft", "hidden"];
const empty = {
  title: "",
  category: "panel",
  brand: "",
  model_number: "",
  description: "",
  features: "",
  tags: "",
  image_url: "",
  gallery: "",
  price: "0",
  sale_price: "",
  stock_quantity: "0",
  status: "active",
  featured: false
};
function ProductsPage() {
  const listFn = useServerFn(listProducts);
  const createFn = useServerFn(createProduct);
  const updateFn = useServerFn(updateProduct);
  const deleteFn = useServerFn(deleteProduct);
  const qc = useQueryClient();
  const {
    data: products = [],
    isLoading
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => listFn({})
  });
  const [form, setForm] = reactExports.useState(null);
  const [confirmDel, setConfirmDel] = reactExports.useState(null);
  const [uploading, setUploading] = reactExports.useState(false);
  const open = (p) => {
    if (!p) return setForm(empty);
    setForm({
      id: p.id,
      title: p.title,
      category: p.category,
      brand: p.brand ?? "",
      model_number: p.model_number ?? "",
      description: p.description ?? "",
      features: (p.features || []).join("\n"),
      tags: (p.tags || []).join(", "),
      image_url: p.image_url ?? "",
      gallery: (p.gallery || []).join("\n"),
      price: String(p.price ?? 0),
      sale_price: p.sale_price ? String(p.sale_price) : "",
      stock_quantity: String(p.stock_quantity ?? 0),
      status: p.status,
      featured: !!p.featured
    });
  };
  const upload = async (file) => {
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const {
      error
    } = await supabase.storage.from("product-images").upload(path, file, {
      upsert: false
    });
    if (error) throw error;
    const {
      data
    } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };
  const onMainUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f || !form) return;
    setUploading(true);
    try {
      setForm({
        ...form,
        image_url: await upload(f)
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };
  const onGalleryUpload = async (e) => {
    const fs = Array.from(e.target.files || []);
    if (!fs.length || !form) return;
    setUploading(true);
    try {
      const urls = await Promise.all(fs.map(upload));
      const cur = form.gallery.split("\n").filter(Boolean);
      setForm({
        ...form,
        gallery: [...cur, ...urls].join("\n")
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
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
      featured: form.featured
    };
    try {
      if (form.id) await updateFn({
        data: {
          id: form.id,
          patch: payload
        }
      });
      else await createFn({
        data: payload
      });
      toast.success(form.id ? "Product updated" : "Product added");
      setForm(null);
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
      qc.invalidateQueries({
        queryKey: ["admin-summary"]
      });
    } catch (e) {
      toast.error(e.message);
    }
  };
  const remove = async (id) => {
    try {
      await deleteFn({
        data: {
          id
        }
      });
      toast.success("Deleted");
      setConfirmDel(null);
      qc.invalidateQueries({
        queryKey: ["admin-products"]
      });
    } catch (e) {
      toast.error(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-gold", children: "Catalogue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold", children: "Product Management" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => open(), className: "inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-xs font-semibold text-background shadow-gold transition-transform hover:-translate-y-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
        " Add product"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-2xl border border-border/60 bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-surface-elevated/60 text-[11px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-border/40", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-6 text-center text-muted-foreground", children: "Loading…" }) }),
        !isLoading && products.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-6 text-center text-muted-foreground", children: "No products yet. Click “Add product”." }) }),
        products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-surface-elevated/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            p.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image_url, alt: "", className: "h-10 w-10 rounded-lg object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-surface-elevated" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate font-medium flex items-center gap-1.5", children: [
                p.title,
                " ",
                p.featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-gold text-gold" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[11px] text-muted-foreground", children: [
                p.brand,
                " ",
                p.model_number
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs capitalize", children: p.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono tabular-nums", children: fmt(Number(p.sale_price || p.price)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right tabular-nums", children: p.stock_quantity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs capitalize", children: p.status.replace("_", " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => open(p), className: "grid h-8 w-8 place-items-center rounded-lg border border-border/60 text-muted-foreground hover:text-gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmDel(p.id), className: "grid h-8 w-8 place-items-center rounded-lg border border-border/60 text-muted-foreground hover:text-rose-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
          ] }) })
        ] }, p.id))
      ] })
    ] }) }),
    form && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[80] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/70 backdrop-blur", onClick: () => setForm(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border/60 bg-surface shadow-gold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-surface px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: form.id ? "Edit product" : "Add product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm(null), className: "grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 p-5 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FInput, { label: "Title", v: form.title, onChange: (v) => setForm({
            ...form,
            title: v
          }), className: "sm:col-span-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FSel, { label: "Category", v: form.category, options: CATEGORIES, onChange: (v) => setForm({
            ...form,
            category: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FSel, { label: "Status", v: form.status, options: STATUSES, onChange: (v) => setForm({
            ...form,
            status: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FInput, { label: "Brand", v: form.brand, onChange: (v) => setForm({
            ...form,
            brand: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FInput, { label: "Model #", v: form.model_number, onChange: (v) => setForm({
            ...form,
            model_number: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FInput, { label: "Price (Rs)", v: form.price, type: "number", onChange: (v) => setForm({
            ...form,
            price: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FInput, { label: "Sale Price (Rs)", v: form.sale_price, type: "number", onChange: (v) => setForm({
            ...form,
            sale_price: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FInput, { label: "Stock Qty", v: form.stock_quantity, type: "number", onChange: (v) => setForm({
            ...form,
            stock_quantity: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: form.featured, onChange: (e) => setForm({
              ...form,
              featured: e.target.checked
            }), className: "accent-[var(--gold)]" }),
            "Featured product"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FTA, { label: "Description", v: form.description, onChange: (v) => setForm({
            ...form,
            description: v
          }), className: "sm:col-span-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FTA, { label: "Features (one per line)", v: form.features, onChange: (v) => setForm({
            ...form,
            features: v
          }), className: "sm:col-span-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FInput, { label: "Tags (comma separated)", v: form.tags, onChange: (v) => setForm({
            ...form,
            tags: v
          }), className: "sm:col-span-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-[11px] uppercase tracking-wider text-muted-foreground", children: "Main image" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              form.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.image_url, alt: "", className: "h-16 w-16 rounded-xl object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", onChange: onMainUpload, className: "text-xs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.image_url, onChange: (e) => setForm({
                ...form,
                image_url: e.target.value
              }), placeholder: "or paste URL", className: "flex-1 rounded-xl border border-border/60 bg-surface-elevated/40 px-3 py-2 text-xs" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-[11px] uppercase tracking-wider text-muted-foreground", children: "Gallery (URLs, one per line)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", multiple: true, onChange: onGalleryUpload, className: "mb-2 text-xs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.gallery, onChange: (e) => setForm({
              ...form,
              gallery: e.target.value
            }), rows: 3, className: "w-full rounded-xl border border-border/60 bg-surface-elevated/40 px-3 py-2 text-xs" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "sticky bottom-0 flex justify-end gap-2 border-t border-border/60 bg-surface px-5 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm(null), className: "rounded-full border border-border/60 px-4 py-2 text-xs text-muted-foreground hover:text-foreground", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, disabled: uploading, className: "rounded-full bg-gold-gradient px-5 py-2 text-xs font-semibold text-background shadow-gold disabled:opacity-60", children: form.id ? "Save changes" : "Create product" })
        ] })
      ] })
    ] }),
    confirmDel && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[80] grid place-items-center p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/70 backdrop-blur", onClick: () => setConfirmDel(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm rounded-2xl border border-border/60 bg-surface p-6 text-center shadow-gold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold", children: "Delete this product?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "This cannot be undone." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex justify-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmDel(null), className: "rounded-full border border-border/60 px-4 py-2 text-xs", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(confirmDel), className: "rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white", children: "Delete" })
        ] })
      ] })
    ] })
  ] });
}
function FInput({
  label,
  v,
  onChange,
  type = "text",
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `block ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-[11px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value: v, onChange: (e) => onChange(e.target.value), className: "w-full rounded-xl border border-border/60 bg-surface-elevated/40 px-3 py-2 text-sm outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20" })
  ] });
}
function FTA({
  label,
  v,
  onChange,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `block ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-[11px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: v, onChange: (e) => onChange(e.target.value), rows: 3, className: "w-full rounded-xl border border-border/60 bg-surface-elevated/40 px-3 py-2 text-sm outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20" })
  ] });
}
function FSel({
  label,
  v,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-[11px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: v, onChange: (e) => onChange(e.target.value), className: "w-full rounded-xl border border-border/60 bg-surface-elevated/40 px-3 py-2 text-sm outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20", children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o)) })
  ] });
}
export {
  ProductsPage as component
};
