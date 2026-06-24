// REST client for the MTC Energy Collective inventory project's public catalog API.
// Server-side endpoint there projects only safe fields (no cost price).

const BASE = (import.meta.env.VITE_INVENTORY_API_URL as string).replace(/\/$/, "");

export const INVENTORY_API_BASE = BASE;

export type InventoryProduct = {
  id: string;
  name: string;
  category: string; // "Batteries" | "Solar Panels" | "Inverters" | "Accessories" | other
  category_id: string | null;
  model: string | null;
  capacity: string | null;
  product_type: string | null;
  warranty: string | null;
  specifications: string | null;
  selling_price: number;
  quantity: number;
  in_stock: boolean;
  status: string;
  created_at: string;
};

export interface InventoryResponse {
  products: InventoryProduct[];
  total: number;
}

export async function fetchInventoryProducts(signal?: AbortSignal): Promise<InventoryResponse> {
  const res = await fetch(`${BASE}/api/public/catalog/products`, {
    signal,
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Inventory API returned ${res.status}`);
  }
  return (await res.json()) as InventoryResponse;
}
