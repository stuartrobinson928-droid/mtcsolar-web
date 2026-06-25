import { useQuery } from "@tanstack/react-query";
import { fetchInventoryProducts, type InventoryProduct, INVENTORY_API_BASE } from "@/integrations/inventory/api";
import { supabase } from "@/integrations/supabase/client";
import type { Category, Product } from "@/context/store";
import panelImg from "@/assets/panel.jpg";
import inverterImg from "@/assets/inverter.jpg";
import batteryImg from "@/assets/battery.jpg";
import accessoryImg from "@/assets/accessory.jpg";

export { INVENTORY_API_BASE };

export interface CatalogItem extends Omit<Product, "category"> {
  category: Category | null;
  price: number;
  stock: number;
  lowStockThreshold: number;
  visible: boolean;
  inventoryCategory: string;
  imageOverride: string | null;
  categoryOverride: Category | null;
  inStock: boolean;
}

export interface StorefrontProduct extends Product {
  price: number;
  stock: number;
  lowStockThreshold: number;
}

const fallbackImg: Record<Category, string> = {
  panel: panelImg,
  inverter: inverterImg,
  battery: batteryImg,
  accessory: accessoryImg,
};

function normalizeCategory(raw: string): Category | null {
  const c = (raw ?? "").toLowerCase().trim();
  if (c.includes("panel") || c.includes("module") || /\bpv\b/.test(c)) return "panel";
  if (c.includes("invert")) return "inverter";
  if (c.includes("batter") || c.includes("storage") || c.includes("lfp")) return "battery";
  if (c.includes("access") || c.includes("cable") || c.includes("mount") || c.includes("connector") || c.includes("breaker")) return "accessory";
  return null;
}

function parseWatts(row: InventoryProduct, category: Category | null): number | undefined {
  if (!category) return undefined;
  const candidates = [row.capacity, row.specifications, row.model, row.name].filter(Boolean) as string[];
  for (const s of candidates) {
    const kw = s.match(/(\d+(?:\.\d+)?)\s*k\s*w(?!h)/i);
    if (kw) return Math.round(parseFloat(kw[1]) * 1000);
    const w = s.match(/(\d+(?:\.\d+)?)\s*w(?!h)/i);
    if (w) return Math.round(parseFloat(w[1]));
    if (category === "battery") {
      const kwh = s.match(/(\d+(?:\.\d+)?)\s*k\s*wh/i);
      if (kwh) return Math.round(parseFloat(kwh[1]) * 1000);
    }
  }
  return undefined;
}

function parseTags(row: InventoryProduct): string[] {
  const out: string[] = [];
  const push = (v: string | null | undefined) => {
    if (!v) return;
    const t = v.trim();
    if (t && t.length <= 28 && !out.includes(t)) out.push(t);
  };
  push(row.product_type);
  push(row.capacity);
  push(row.warranty);
  if (row.specifications) {
    for (const piece of row.specifications.split(/[,;|\n]/)) push(piece);
  }
  return out.slice(0, 3);
}

type Override = {
  inventory_id: string;
  visible: boolean;
  image_url: string | null;
  category_override: Category | null;
  sort_order: number;
};

async function fetchAllCatalog(): Promise<CatalogItem[]> {
  const [invRes, ovrRes] = await Promise.all([
    fetchInventoryProducts(),
    supabase
      .from("storefront_products")
      .select("inventory_id, visible, image_url, category_override, sort_order"),
  ]);
  if (ovrRes.error) throw ovrRes.error;

  const ovrMap = new Map<string, Override>();
  for (const o of (ovrRes.data ?? []) as Override[]) ovrMap.set(o.inventory_id, o);

  return invRes.products.map((row) => {
    const ovr = ovrMap.get(row.id);
    const category = (ovr?.category_override as Category | null) ?? normalizeCategory(row.category);
    const watts = parseWatts(row, category);
    const stock = row.quantity ?? 0;
    return {
      id: row.id,
      name: row.name,
      series: row.model ?? undefined,
      category,
      watts,
      tags: parseTags(row),
      image: ovr?.image_url ?? (category ? fallbackImg[category] : fallbackImg.accessory),
      price: Number(row.selling_price ?? 0),
      stock,
      lowStockThreshold: 5,
      visible: ovr?.visible ?? true,
      inventoryCategory: row.category,
      imageOverride: ovr?.image_url ?? null,
      categoryOverride: (ovr?.category_override as Category | null) ?? null,
      inStock: row.in_stock,
    } satisfies CatalogItem;
  });
}

export function useCatalog() {
  return useQuery({
    queryKey: ["catalog", "all"],
    queryFn: fetchAllCatalog,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

// Storefront-facing: only items toggled visible and mapped to a category.
export function useInventoryProducts() {
  const q = useCatalog();
  const data = (q.data ?? [])
    .filter((p): p is CatalogItem & { category: Category } =>
      p.visible && p.category !== null && p.inStock && p.stock > 0,
    )
    .map<StorefrontProduct>((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      watts: p.watts,
      tags: p.tags,
      image: p.image,
      series: p.series,
      price: p.price,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
    }));
  return { ...q, data };
}

export function useInventoryProduct(id: string) {
  const q = useInventoryProducts();
  return { ...q, data: q.data?.find((p) => p.id === id) };
}
