// Read-only client pointing at the MTC Energy Collective inventory database.
// Uses the publishable (anon) key only — safe in the client bundle.
import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_INVENTORY_SUPABASE_URL as string;
const KEY = import.meta.env.VITE_INVENTORY_SUPABASE_PUBLISHABLE_KEY as string;

export const inventorySupabase = createClient(URL, KEY, {
  auth: {
    storage: undefined,
    persistSession: false,
    autoRefreshToken: false,
  },
});

export type InventoryRow = {
  id: string;
  name: string;
  category: string;
  company: string | null;
  specifications: string | null;
  quantity: number;
  selling_price: number;
  low_stock_threshold: number;
  status: string;
};
