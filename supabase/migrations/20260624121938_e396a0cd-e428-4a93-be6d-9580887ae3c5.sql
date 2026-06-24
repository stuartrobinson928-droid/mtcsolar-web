
DO $$ BEGIN
  CREATE TYPE public.storefront_category AS ENUM ('panel','inverter','battery','accessory');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.storefront_products (
  inventory_id uuid PRIMARY KEY,
  visible boolean NOT NULL DEFAULT false,
  image_url text,
  category_override public.storefront_category,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.storefront_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.storefront_products TO authenticated;
GRANT ALL ON public.storefront_products TO service_role;

ALTER TABLE public.storefront_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read storefront products"
  ON public.storefront_products FOR SELECT TO anon USING (true);

CREATE POLICY "auth read storefront products"
  ON public.storefront_products FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin insert storefront products"
  ON public.storefront_products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update storefront products"
  ON public.storefront_products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete storefront products"
  ON public.storefront_products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER storefront_products_touch
  BEFORE UPDATE ON public.storefront_products
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
