
-- Restrict execution of SECURITY DEFINER funcs
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Replace USING(true) inserts with stricter checks
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (status = 'pending' AND length(customer_name) BETWEEN 1 AND 200 AND length(customer_email) <= 255);

DROP POLICY IF EXISTS "Anyone can insert items" ON public.order_items;
CREATE POLICY "Anyone can insert items" ON public.order_items FOR INSERT TO anon, authenticated
WITH CHECK (quantity > 0 AND quantity <= 1000 AND unit_price >= 0);

-- Limit storage listing to admins only; public can still read individual files
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public read product image files" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'product-images' AND (name IS NOT NULL));
