import { useQuery } from "@tanstack/react-query";
import { inventorySupabase, type InventoryRow } from "@/integrations/inventory/client";
import type { Category, Product } from "@/context/store";
import panelImg from "@/assets/panel.jpg";
import inverterImg from "@/assets/inverter.jpg";
import batteryImg from "@/assets/battery.jpg";

export interface InventoryProduct extends Product {
  price: number;
  stock: number;
  lowStockThreshold: number;
}

const fallbackImg: Record<Category, string> = {
  panel: panelImg,
  inverter: inverterImg,
  battery: batteryImg,
};

function normalizeCategory(raw: string): Category | null {
  const c = raw.toLowerCase();
  if (c.includes("panel") || c.includes("module") || c.includes("pv")) return "panel";
  if (c.includes("invert")) return "inverter";
  if (c.includes("batter") || c.includes("storage") || c.includes("lfp")) return "battery";
  return null;
}

function parseWatts(spec: string | null, category: Category): number | undefined {
  if (!spec) return undefined;
  // Match "10 kW", "10kw", "595W", "5000 w", "10kWh", "200Ah"
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

function mapRow(row: InventoryRow): InventoryProduct | null {
  const category = normalizeCategory(row.category);
  if (!category) return null;
  const watts = parseWatts(row.specifications, category);
  return {
    id: row.id,
    name: row.name,
    series: row.company ?? undefined,
    category,
    watts,
    tags: parseTags(row.specifications),
    image: fallbackImg[category],
    price: Number(row.selling_price ?? 0),
    stock: row.quantity ?? 0,
    lowStockThreshold: row.low_stock_threshold ?? 5,
  };
}

async function fetchInventoryProducts(): Promise<InventoryProduct[]> {
  const { data, error } = await inventorySupabase
    .from("products")
    .select(
      "id, name, category, company, specifications, quantity, selling_price, low_stock_threshold, status",
    )
    .eq("status", "active")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data as InventoryRow[]).map(mapRow).filter((p): p is InventoryProduct => p !== null);
}

export function useInventoryProducts() {
  return useQuery({
    queryKey: ["inventory", "products"],
    queryFn: fetchInventoryProducts,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useInventoryProduct(id: string) {
  const q = useInventoryProducts();
  return {
    ...q,
    data: q.data?.find((p) => p.id === id),
  };
}
