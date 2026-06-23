import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function requireAdmin(userId: string) {
  console.log("[products.functions] requireAdmin called for user:", userId);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  console.log("[products.functions] requireAdmin query result:", { data, error });
  if (error || !data) {
    console.error("[products.functions] admin check failed:", { userId, error, data });
    throw new Error("This account does not have admin access.");
  }

  return supabaseAdmin;
}

const productSchema = z.object({
  title: z.string().trim().min(1).max(200),
  category: z.enum(["panel", "inverter", "battery", "accessory"]),
  brand: z.string().trim().max(120).optional().nullable(),
  model_number: z.string().trim().max(120).optional().nullable(),
  description: z.string().trim().max(5000).optional().nullable(),
  specifications: z.record(z.string(), z.any()).optional().default({}),
  features: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  image_url: z.string().url().optional().nullable(),
  gallery: z.array(z.string().url()).optional().default([]),
  price: z.number().min(0),
  sale_price: z.number().min(0).optional().nullable(),
  stock_quantity: z.number().int().min(0).default(0),
  status: z.enum(["active", "out_of_stock", "draft", "hidden"]).default("active"),
  featured: z.boolean().default(false),
});

export const listProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => productSchema.parse(input))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("activity_log").insert({
      type: "product_created",
      message: `Product added: ${data.title}`,
      meta: { product_id: row.id },
    });
    return row;
  });

export const updateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ id: z.string().uuid(), patch: productSchema.partial() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("products")
      .update({ ...data.patch, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("activity_log").insert({
      type: "product_updated",
      message: `Product updated`,
      meta: { product_id: data.id },
    });
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("activity_log").insert({
      type: "product_deleted",
      message: `Product deleted`,
      meta: { product_id: data.id },
    });
    return { ok: true };
  });

export const adminSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await requireAdmin(context.userId);
    const [ordersRes, productsRes, activityRes] = await Promise.all([
      supabaseAdmin.from("orders").select("id,status,total_amount,created_at,order_number,customer_name").order("created_at", { ascending: false }).limit(200),
      supabaseAdmin.from("products").select("id,title,stock_quantity,status,updated_at"),
      supabaseAdmin.from("activity_log").select("*").order("created_at", { ascending: false }).limit(15),
    ]);
    if (ordersRes.error) throw new Error(ordersRes.error.message);
    if (productsRes.error) throw new Error(productsRes.error.message);
    if (activityRes.error) throw new Error(activityRes.error.message);

    const orders = ordersRes.data ?? [];
    const products = productsRes.data ?? [];
    const counts = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + Number(o.total_amount || 0), 0);
    const lowStock = products.filter((p) => p.status !== "hidden" && p.stock_quantity < 5);

    return {
      counts,
      revenue,
      totalProducts: products.length,
      lowStock,
      recentOrders: orders.slice(0, 8),
      activity: activityRes.data ?? [],
    };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      await requireAdmin(context.userId);
      return { isAdmin: true };
    } catch {
      return { isAdmin: false };
    }
  });
