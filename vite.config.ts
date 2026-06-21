// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

/**
 * Strips module-level "use client" and "use server" directives from node_modules
 * before Rollup processes them. Required because Nitro sets noExternal: true in
 * production (bundles everything), and Rollup chokes on bare directive prologues
 * in packages that aren't expecting RSC bundling.
 *
 * Safe for TanStack Start (non-RSC) on both Vercel (Node) and Cloudflare targets.
 */
function stripUseClientDirectives(): Plugin {
  return {
    name: "strip-use-client-directives",
    enforce: "pre",
    transform(code: string, id: string) {
      if (!id.includes("node_modules")) return null;
      // Only act if the file actually contains a directive we care about
      if (!/^\s*["']use (client|server)["']\s*;?/m.test(code)) return null;
      // Remove every top-level "use client" / "use server" directive line
      const stripped = code.replace(
        /^(\s*["']use (client|server)["']\s*;?\s*\n?)/gm,
        "",
      );
      return { code: stripped, map: null };
    },
  };
}

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  nitro: {
    preset: "vercel",
  },

  tanstackStart: {
    server: { entry: "server" },
  },

  vite: {
    plugins: [stripUseClientDirectives()],
  },
});
