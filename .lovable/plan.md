# Why we should NOT copy lalamobiles' `package.json`

The two projects are on completely different stacks. Copying that `package.json` here would not "remove build errors" — it would break this app on boot.

| Area | lalamobiles (working) | This project |
|---|---|---|
| Framework | Vite 5 + plain React SPA | **TanStack Start** (SSR + server fns + Nitro) |
| React | 18.3 | **19** |
| Routing | `react-router-dom` v6 | `@tanstack/react-router` (file-based, generated route tree) |
| Tailwind | v3 + `tailwind.config.ts` + `autoprefixer` + `postcss` | **v4** via `@import` in `src/styles.css` (no config file, no postcss) |
| Build | `vite build` | `@lovable.dev/vite-tanstack-config` + `nitro/vite` (Vercel target) |
| Auth/server | `@lovable.dev/cloud-auth-js` client-side | `createServerFn` + `requireSupabaseAuth` middleware |

Our routes (`src/routes/*`, `routeTree.gen.ts`), server functions (`src/lib/*.functions.ts`), SSR entry (`src/server.ts`, `src/start.ts`), and Supabase integration files are all wired into the TanStack Start stack. Swapping in React 18 + react-router + Tailwind v3 + Vite 5 would invalidate every one of them.

# What I propose instead

Treat this as "find and fix the actual build errors," not a dependency swap.

## Steps

1. **Reproduce the failing build locally** — run `bun run build` and `bun run build:dev`, capture the exact error output. (Last time both passed after the `orders.functions.ts` fix — I want to see the *current* failure, not guess.)
2. **Categorize the failure** into one of:
   - Server-only module leaking into the client graph (same class as the `client.server` import issue we just fixed) → fix by moving the import inside a `.handler()` via `await import(...)`.
   - Missing route file referenced by a `<Link>` → create the route file.
   - Type error from `routeTree.gen.ts` mismatch → align `createFileRoute("...")` strings with filenames.
   - Missing dependency → `bun add` *that one* package (not 50).
   - Syntax / JSX balance error in a recently edited file → patch in place.
3. **Port only what's genuinely missing and compatible** from lalamobiles, if anything. Candidates that are safe to add here on demand (only if a component actually needs them):
   - Radix primitives we don't yet have (e.g. `@radix-ui/react-dialog`, `-dropdown-menu`, `-popover`) — these are version-agnostic.
   - `sonner`, `lucide-react`, `react-hook-form`, `@hookform/resolvers`, `zod`, `clsx`, `tailwind-merge`, `class-variance-authority`, `cmdk` — all stack-neutral.
   - `framer-motion` if we need animations.
4. **Explicitly do NOT port:** `react-router-dom`, `react`/`react-dom` v18, `vite` v5, `tailwindcss` v3, `autoprefixer`, `postcss`, `@vitejs/plugin-react-swc`, `lovable-tagger`, `@lovable.dev/cloud-auth-js`, `next-themes`, `tailwindcss-animate`, `@tailwindcss/typography`. Each of these conflicts with our current stack.
5. **Verify** with `bun run build` + `bun run build:dev` and a quick Playwright check on `/`, `/admin/login`, and `/_admin/dashboard` (with the injected admin session) before declaring it clean.

## Deliverable

A clean build (`bun run build` + `bun run build:dev` both green) with the existing TanStack Start architecture intact, plus a short note in chat listing exactly which error was fixed and which (if any) packages were added.

## If you'd still rather migrate to the lalamobiles stack

That's a separate, much larger project: rebuild every route under react-router, drop SSR/server functions, rewrite the admin auth flow client-side, downgrade React + Tailwind, and re-wire Supabase. I don't recommend it just to silence build errors — but say the word and I'll scope it as its own plan.
