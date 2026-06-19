import { c as createServerRpc, s as supabaseAdmin } from "./client.server-Ze5KUKea.mjs";
import { a as createServerFn } from "./server-W7L2fyHk.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-5C9Ki1_H.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType, b as arrayType, e as enumType } from "../_libs/zod.mjs";
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
const itemSchema = objectType({
  product_id: stringType().nullable().optional(),
  product_name: stringType().min(1).max(255),
  quantity: numberType().int().min(1).max(1e3),
  unit_price: numberType().min(0)
});
const createOrderSchema = objectType({
  customer_name: stringType().trim().min(1).max(200),
  customer_email: stringType().trim().email().max(255),
  customer_phone: stringType().trim().min(7).max(40),
  city: stringType().trim().min(1).max(120),
  delivery_address: stringType().trim().min(5).max(1e3),
  permanent_address: stringType().trim().max(1e3).optional().nullable(),
  notes: stringType().trim().max(1e3).optional().nullable(),
  payment_method: enumType(["cod", "bank_transfer", "easypaisa", "jazzcash"]),
  items: arrayType(itemSchema).min(1).max(100)
});
const createOrder_createServerFn_handler = createServerRpc({
  id: "7f92d135aa3763ddd5bf6d4d9f84832b6b591cbaa35dcc4048b4b1beed8e7bf3",
  name: "createOrder",
  filename: "src/lib/orders.functions.ts"
}, (opts) => createOrder.__executeServer(opts));
const createOrder = createServerFn({
  method: "POST"
}).inputValidator((input) => createOrderSchema.parse(input)).handler(createOrder_createServerFn_handler, async ({
  data
}) => {
  const total = data.items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const {
    data: order,
    error
  } = await supabaseAdmin.from("orders").insert({
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone,
    city: data.city,
    delivery_address: data.delivery_address,
    permanent_address: data.permanent_address ?? null,
    notes: data.notes ?? null,
    payment_method: data.payment_method,
    total_amount: total
  }).select("id, order_number").single();
  if (error || !order) throw new Error(error?.message ?? "Failed to create order");
  const items = data.items.map((i) => ({
    order_id: order.id,
    product_id: i.product_id ?? null,
    product_name: i.product_name,
    quantity: i.quantity,
    unit_price: i.unit_price,
    line_total: i.unit_price * i.quantity
  }));
  const {
    error: itemsErr
  } = await supabaseAdmin.from("order_items").insert(items);
  if (itemsErr) throw new Error(itemsErr.message);
  await supabaseAdmin.from("activity_log").insert({
    type: "order_created",
    message: `New order ${order.order_number} from ${data.customer_name}`,
    meta: {
      order_id: order.id,
      total
    }
  });
  return {
    id: order.id,
    order_number: order.order_number,
    total
  };
});
const listOrders_createServerFn_handler = createServerRpc({
  id: "e004c3669ad9314e0f13dd8e45194bd1d7a95f814599b1d8484097691817695f",
  name: "listOrders",
  filename: "src/lib/orders.functions.ts"
}, (opts) => listOrders.__executeServer(opts));
const listOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listOrders_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("orders").select("*, order_items(*)").order("created_at", {
    ascending: false
  }).limit(500);
  if (error) throw new Error(error.message);
  return data ?? [];
});
const updateOrderStatus_createServerFn_handler = createServerRpc({
  id: "ce3247af923fb83e1b50e04a2d3399abe6b8ac7e9c8330b2019de9668492b17f",
  name: "updateOrderStatus",
  filename: "src/lib/orders.functions.ts"
}, (opts) => updateOrderStatus.__executeServer(opts));
const updateOrderStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  id: stringType().uuid(),
  status: enumType(["pending", "processing", "confirmed", "shipped", "delivered", "cancelled"])
}).parse(input)).handler(updateOrderStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("orders").update({
    status: data.status,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await supabaseAdmin.from("activity_log").insert({
    type: "order_status",
    message: `Order ${data.id.slice(0, 8)} → ${data.status}`,
    meta: {
      order_id: data.id,
      status: data.status
    }
  });
  return {
    ok: true
  };
});
export {
  createOrder_createServerFn_handler,
  listOrders_createServerFn_handler,
  updateOrderStatus_createServerFn_handler
};
