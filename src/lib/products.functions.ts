// Client-side admin API. RLS enforces admin permissions on the server.
import { supabase } from "@/integrations/supabase/client";

export async function checkIsAdmin(): Promise<{ isAdmin: boolean }> {
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) return { isAdmin: false };
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userRes.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.error("[checkIsAdmin]", error);
    return { isAdmin: false };
  }
  return { isAdmin: !!data };
}

export async function adminSummary() {
  const [ordersRes, productsRes, activityRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id,status,total_amount,created_at,order_number,customer_name")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("products").select("id,title,stock_quantity,status,updated_at"),
    supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(15),
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
  const lowStock = products.filter(
    (p) => p.status !== "hidden" && (p.stock_quantity ?? 0) < 5,
  );

  return {
    counts,
    revenue,
    totalProducts: products.length,
    lowStock,
    recentOrders: orders.slice(0, 8),
    activity: activityRes.data ?? [],
  };
}
