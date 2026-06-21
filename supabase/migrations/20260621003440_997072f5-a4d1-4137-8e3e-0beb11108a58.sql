
-- Remove public insert policies; orders are inserted server-side via service role
DROP POLICY IF EXISTS "Anyone can insert items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Lock user_roles writes to admins only
CREATE POLICY "Admins manage roles insert" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles update" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles delete" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Restrict EXECUTE on has_role: only postgres/service_role need it (used inside RLS via SECURITY DEFINER context)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
