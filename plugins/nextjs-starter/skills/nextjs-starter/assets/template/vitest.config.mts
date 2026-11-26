import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // @i18n-start
    // next-intl imports "next/navigation" without a file extension, which Node rejects; let Vite resolve it.
    server: { deps: { inline: ["next-intl"] } },
    // @i18n-end
  },
})
