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
  image_url?: string | null;
};

export interface InventoryResponse {
  products: InventoryProduct[];
  total: number;
}

export async function fetchInventoryProducts(signal?: AbortSignal): Promise<InventoryResponse> {
  const pageSize = 100;
  let page = 1;
  const all: InventoryProduct[] = [];
  let total = 0;
  // Inventory API caps pageSize at 100; loop through pages until we have everything.
  // Hard safety cap of 50 pages (5,000 products).
  while (page <= 50) {
    const res = await fetch(
      `${BASE}/api/public/catalog/products?pageSize=${pageSize}&page=${page}`,
      { signal, headers: { accept: "application/json" } },
    );
    if (!res.ok) throw new Error(`Inventory API returned ${res.status}`);
    const json = (await res.json()) as InventoryResponse & { page?: number; pageSize?: number };
    total = json.total ?? all.length + json.products.length;
    all.push(...json.products);
    if (all.length >= total || json.products.length < pageSize) break;
    page += 1;
  }
  return { products: all, total };
}
