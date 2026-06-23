UPDATE auth.users
SET encrypted_password = crypt('awaismalik.Mtc1@', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE lower(email) = lower('awaismalik.mtc1@gmail.com');

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE lower(email) = lower('awaismalik.mtc1@gmail.com')
ON CONFLICT DO NOTHING;