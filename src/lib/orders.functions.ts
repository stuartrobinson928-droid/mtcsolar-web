// Client-side order API. RLS + a SECURITY DEFINER RPC handle permissions.
import { supabase } from "@/integrations/supabase/client";

export interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  city: string;
  delivery_address: string;
  permanent_address?: string | null;
  notes?: string | null;
  payment_method: "cod" | "bank_transfer" | "easypaisa" | "jazzcash";
  items: Array<{
    product_id?: string | null;
    product_name: string;
    quantity: number;
    unit_price: number;
  }>;
}

export async function createOrder(input: CreateOrderInput) {
  const { data, error } = await supabase.rpc("place_storefront_order", {
    _customer_name: input.customer_name,
    _customer_email: input.customer_email,
    _customer_phone: input.customer_phone,
    _city: input.city,
    _delivery_address: input.delivery_address,
    _permanent_address: input.permanent_address ?? null,
    _notes: input.notes ?? null,
    _payment_method: input.payment_method,
    _items: input.items,
  });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  return {
    id: row.id as string,
    order_number: row.order_number as string,
    total: Number(row.total),
  };
}

export async function listOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateOrderStatus(input: {
  id: string;
  status: "pending" | "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";
}) {
  const { error } = await supabase
    .from("orders")
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq("id", input.id);
  if (error) throw new Error(error.message);
  await supabase.from("activity_log").insert({
    type: "order_status",
    message: `Order ${input.id.slice(0, 8)} → ${input.status}`,
    meta: { order_id: input.id, status: input.status },
  });
  return { ok: true };
}
