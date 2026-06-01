import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  cloudflare: process.env.VERCEL ? false : undefined,

  tanstackStart: {
    target: process.env.VERCEL ? "vercel" : undefined,
    server: { entry: "server" },
  },
});
