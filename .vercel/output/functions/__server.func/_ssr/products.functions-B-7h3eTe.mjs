import { c as createServerRpc, s as supabaseAdmin } from "./client.server-Ze5KUKea.mjs";
import { a as createServerFn } from "./server-W7L2fyHk.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-5C9Ki1_H.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, c as booleanType, e as enumType, n as numberType, b as arrayType, s as stringType, r as recordType, a as anyType } from "../_libs/zod.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const productSchema = objectType({
  title: stringType().trim().min(1).max(200),
  category: enumType(["panel", "inverter", "battery", "accessory"]),
  brand: stringType().trim().max(120).optional().nullable(),
  model_number: stringType().trim().max(120).optional().nullable(),
  description: stringType().trim().max(5e3).optional().nullable(),
  specifications: recordType(stringType(), anyType()).optional().default({}),
  features: arrayType(stringType()).optional().default([]),
  tags: arrayType(stringType()).optional().default([]),
  image_url: stringType().url().optional().nullable(),
  gallery: arrayType(stringType().url()).optional().default([]),
  price: numberType().min(0),
  sale_price: numberType().min(0).optional().nullable(),
  stock_quantity: numberType().int().min(0).default(0),
  status: enumType(["active", "out_of_stock", "draft", "hidden"]).default("active"),
  featured: booleanType().default(false)
});
const listProducts_createServerFn_handler = createServerRpc({
  id: "51ad93d03c52987e0e52d0164e41771f8765a8919d8a537367eaf795dff9b9d8",
  name: "listProducts",
  filename: "src/lib/products.functions.ts"
}, (opts) => listProducts.__executeServer(opts));
const listProducts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listProducts_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("products").select("*").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const createProduct_createServerFn_handler = createServerRpc({
  id: "acc80f592bb436c21cdce6e1d5d6087ef2a2f0e66f3aa25c96c83356a4766324",
  name: "createProduct",
  filename: "src/lib/products.functions.ts"
}, (opts) => createProduct.__executeServer(opts));
const createProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => productSchema.parse(input)).handler(createProduct_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: row,
    error
  } = await context.supabase.from("products").insert(data).select().single();
  if (error) throw new Error(error.message);
  await supabaseAdmin.from("activity_log").insert({
    type: "product_created",
    message: `Product added: ${data.title}`,
    meta: {
      product_id: row.id
    }
  });
  return row;
});
const updateProduct_createServerFn_handler = createServerRpc({
  id: "f60c4de8a0e072d909272f117a614a338a7ea53e6c76d97da6da447680f2ec9c",
  name: "updateProduct",
  filename: "src/lib/products.functions.ts"
}, (opts) => updateProduct.__executeServer(opts));
const updateProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid(),
  patch: productSchema.partial()
}).parse(input)).handler(updateProduct_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("products").update({
    ...data.patch,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await supabaseAdmin.from("activity_log").insert({
    type: "product_updated",
    message: `Product updated`,
    meta: {
      product_id: data.id
    }
  });
  return {
    ok: true
  };
});
const deleteProduct_createServerFn_handler = createServerRpc({
  id: "154b8633eea94111b40f7036631572cb49e5f458d27dce468c3338ae0c0dc0db",
  name: "deleteProduct",
  filename: "src/lib/products.functions.ts"
}, (opts) => deleteProduct.__executeServer(opts));
const deleteProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(deleteProduct_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("products").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await supabaseAdmin.from("activity_log").insert({
    type: "product_deleted",
    message: `Product deleted`,
    meta: {
      product_id: data.id
    }
  });
  return {
    ok: true
  };
});
const adminSummary_createServerFn_handler = createServerRpc({
  id: "a1b2950455ed9af494bbb9cddc219eb98df158b8da641138885ccbf422199842",
  name: "adminSummary",
  filename: "src/lib/products.functions.ts"
}, (opts) => adminSummary.__executeServer(opts));
const adminSummary = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminSummary_createServerFn_handler, async ({
  context
}) => {
  const [ordersRes, productsRes, activityRes] = await Promise.all([context.supabase.from("orders").select("id,status,total_amount,created_at,order_number,customer_name").order("created_at", {
    ascending: false
  }).limit(200), context.supabase.from("products").select("id,title,stock_quantity,status,updated_at"), context.supabase.from("activity_log").select("*").order("created_at", {
    ascending: false
  }).limit(15)]);
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
    cancelled: orders.filter((o) => o.status === "cancelled").length
  };
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const lowStock = products.filter((p) => p.status !== "hidden" && p.stock_quantity < 5);
  return {
    counts,
    revenue,
    totalProducts: products.length,
    lowStock,
    recentOrders: orders.slice(0, 8),
    activity: activityRes.data ?? []
  };
});
const checkIsAdmin_createServerFn_handler = createServerRpc({
  id: "26bfd577b6f062bf54ad107598db01ac3781476dd6f4f4b32646516c46d7d386",
  name: "checkIsAdmin",
  filename: "src/lib/products.functions.ts"
}, (opts) => checkIsAdmin.__executeServer(opts));
const checkIsAdmin = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(checkIsAdmin_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (error) return {
    isAdmin: false
  };
  return {
    isAdmin: !!data
  };
});
export {
  adminSummary_createServerFn_handler,
  checkIsAdmin_createServerFn_handler,
  createProduct_createServerFn_handler,
  deleteProduct_createServerFn_handler,
  listProducts_createServerFn_handler,
  updateProduct_createServerFn_handler
};
