import { useQuery } from "@tanstack/react-query";
import { inventorySupabase, type InventoryRow } from "@/integrations/inventory/client";
import { supabase } from "@/integrations/supabase/client";
import type { Category, Product } from "@/context/store";
import panelImg from "@/assets/panel.jpg";
import inverterImg from "@/assets/inverter.jpg";
import batteryImg from "@/assets/battery.jpg";
import accessoryImg from "@/assets/accessory.jpg";

export interface CatalogItem extends Omit<Product, "category"> {
  // category may be null in the admin view when the item is unmapped
  category: Category | null;
  price: number;
  stock: number;
  lowStockThreshold: number;
  visible: boolean;
  inventoryCategory: string;
  imageOverride: string | null;
  categoryOverride: Category | null;
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
  const c = (raw ?? "").toLowerCase();
  if (c.includes("panel") || c.includes("module") || /\bpv\b/.test(c)) return "panel";
  if (c.includes("invert")) return "inverter";
  if (c.includes("batter") || c.includes("storage") || c.includes("lfp")) return "battery";
  if (c.includes("access") || c.includes("cable") || c.includes("mount") || c.includes("connector") || c.includes("breaker")) return "accessory";
  return null;
}

function parseWatts(spec: string | null, category: Category | null): number | undefined {
  if (!spec || !category) return undefined;
  const kw = spec.match(/(\d+(?:\.\d+)?)\s*k\s*w(?!h)/i);
  if (kw) return Math.round(parseFloat(kw[1]) * 1000);
  const w = spec.match(/(\d+(?:\.\d+)?)\s*w(?!h)/i);
  if (w) return Math.round(parseFloat(w[1]));
  const kwh = spec.match(/(\d+(?:\.\d+)?)\s*k\s*wh/i);
  if (kwh && category === "battery") return Math.round(parseFloat(kwh[1]) * 1000);
  return undefined;
}

function parseTags(spec: string | null): string[] {
  if (!spec) return [];
  return spec
    .split(/[,;|\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length <= 28)
    .slice(0, 3);
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
    inventorySupabase
      .from("products")
      .select("id, name, category, company, specifications, quantity, selling_price, low_stock_threshold, status")
      .eq("status", "active")
      .order("name", { ascending: true }),
    supabase
      .from("storefront_products")
      .select("inventory_id, visible, image_url, category_override, sort_order"),
  ]);
  if (invRes.error) throw invRes.error;
  if (ovrRes.error) throw ovrRes.error;

  const ovrMap = new Map<string, Override>();
  for (const o of (ovrRes.data ?? []) as Override[]) ovrMap.set(o.inventory_id, o);

  return ((invRes.data ?? []) as InventoryRow[]).map((row) => {
    const ovr = ovrMap.get(row.id);
    const category = (ovr?.category_override as Category | null) ?? normalizeCategory(row.category);
    const watts = parseWatts(row.specifications, category);
    return {
      id: row.id,
      name: row.name,
      series: row.company ?? undefined,
      category,
      watts,
      tags: parseTags(row.specifications),
      image: ovr?.image_url ?? (category ? fallbackImg[category] : fallbackImg.accessory),
      price: Number(row.selling_price ?? 0),
      stock: row.quantity ?? 0,
      lowStockThreshold: row.low_stock_threshold ?? 5,
      visible: ovr?.visible ?? false,
      inventoryCategory: row.category,
      imageOverride: ovr?.image_url ?? null,
      categoryOverride: (ovr?.category_override as Category | null) ?? null,
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

// Storefront-facing hook: only items toggled visible and successfully mapped to a category
export function useInventoryProducts() {
  const q = useCatalog();
  const data = (q.data ?? [])
    .filter((p): p is CatalogItem & { category: Category } => p.visible && p.category !== null)
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
