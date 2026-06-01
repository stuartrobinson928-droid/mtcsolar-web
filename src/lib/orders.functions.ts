import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const itemSchema = z.object({
  product_id: z.string().nullable().optional(),
  product_name: z.string().min(1).max(255),
  quantity: z.number().int().min(1).max(1000),
  unit_price: z.number().min(0),
});

const createOrderSchema = z.object({
  customer_name: z.string().trim().min(1).max(200),
  customer_email: z.string().trim().email().max(255),
  customer_phone: z.string().trim().min(7).max(40),
  city: z.string().trim().min(1).max(120),
  delivery_address: z.string().trim().min(5).max(1000),
  permanent_address: z.string().trim().max(1000).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
  payment_method: z.enum(["cod", "bank_transfer", "easypaisa", "jazzcash"]),
  items: z.array(itemSchema).min(1).max(100),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => createOrderSchema.parse(input))
  .handler(async ({ data }) => {
    const total = data.items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        city: data.city,
        delivery_address: data.delivery_address,
        permanent_address: data.permanent_address ?? null,
        notes: data.notes ?? null,
        payment_method: data.payment_method,
        total_amount: total,
      })
      .select("id, order_number")
      .single();
    if (error || !order) throw new Error(error?.message ?? "Failed to create order");

    const items = data.items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id ?? null,
      product_name: i.product_name,
      quantity: i.quantity,
      unit_price: i.unit_price,
      line_total: i.unit_price * i.quantity,
    }));
    const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(items);
    if (itemsErr) throw new Error(itemsErr.message);

    await supabaseAdmin.from("activity_log").insert({
      type: "order_created",
      message: `New order ${order.order_number} from ${data.customer_name}`,
      meta: { order_id: order.id, total },
    });

    return { id: order.id, order_number: order.order_number, total };
  });

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum([
          "pending",
          "processing",
          "confirmed",
          "shipped",
          "delivered",
          "cancelled",
        ]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("activity_log").insert({
      type: "order_status",
      message: `Order ${data.id.slice(0, 8)} → ${data.status}`,
      meta: { order_id: data.id, status: data.status },
    });
    return { ok: true };
  });
