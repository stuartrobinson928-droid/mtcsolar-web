## Seed the admin account so login works immediately

The credentials `awaismalik.Mtc1@gmail.com` / `awaismalik.Mtc1@` fail because no such user exists in Lovable Cloud yet — the auth logs show `invalid_credentials`. The DB trigger already grants the `admin` role automatically when this email signs up; we just need to create the user.

### Steps

1. **Seed migration** — insert the admin user directly into `auth.users` with the hashed password and `email_confirmed_at` set, using `pgcrypto`'s `crypt(..., gen_salt('bf'))`. `ON CONFLICT (email) DO NOTHING` keeps it idempotent.
2. **Ensure admin role row** — `INSERT INTO public.user_roles (user_id, role) SELECT id, 'admin' FROM auth.users WHERE lower(email) = lower('awaismalik.mtc1@gmail.com') ON CONFLICT DO NOTHING`, in case the trigger didn't fire for a pre-existing row.
3. **Verify** — after migration runs, you sign in at `/admin/login` with the exact credentials from your spec.

### Out of scope

- No code, route, or UI changes.
- No new auth providers, no disabling signup.
- Password is stored exactly as specified; you can change it later from the admin UI / auth settings.
