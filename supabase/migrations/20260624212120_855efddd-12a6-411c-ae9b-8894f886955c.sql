
-- Allow anon and authenticated users to place orders directly (storefront checkout)
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can create order items" ON public.order_items
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow anon and authenticated to log activity (order placement, etc.)
CREATE POLICY "Anyone can write activity" ON public.activity_log
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Grants
GRANT SELECT, INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

GRANT SELECT, INSERT ON public.order_items TO anon;
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;

GRANT INSERT ON public.activity_log TO anon;
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
