CREATE OR REPLACE FUNCTION public.place_storefront_order(_customer_name text, _customer_email text, _customer_phone text, _city text, _delivery_address text, _permanent_address text, _notes text, _payment_method text, _items jsonb)
 RETURNS TABLE(id uuid, order_number text, total numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _order_id uuid;
  _order_number text;
  _total numeric := 0;
  _item jsonb;
BEGIN
  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _total := _total + (_item->>'unit_price')::numeric * (_item->>'quantity')::int;
  END LOOP;

  INSERT INTO public.orders (
    customer_name, customer_email, customer_phone, city,
    delivery_address, permanent_address, notes,
    payment_method, total_amount
  ) VALUES (
    _customer_name, _customer_email, _customer_phone, _city,
    _delivery_address, _permanent_address, _notes,
    _payment_method::public.payment_method, _total
  )
  RETURNING orders.id, orders.order_number INTO _order_id, _order_number;

  INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price, line_total)
  SELECT
    _order_id,
    NULLIF(it->>'product_id','')::uuid,
    it->>'product_name',
    (it->>'quantity')::int,
    (it->>'unit_price')::numeric,
    (it->>'quantity')::int * (it->>'unit_price')::numeric
  FROM jsonb_array_elements(_items) AS it;

  INSERT INTO public.activity_log (type, message, meta)
  VALUES ('order_created',
          'New order ' || _order_number || ' from ' || _customer_name,
          jsonb_build_object('order_id', _order_id, 'total', _total));

  RETURN QUERY SELECT _order_id, _order_number, _total;
END;
$function$;