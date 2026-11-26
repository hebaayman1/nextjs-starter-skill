import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    // @i18n-start
    // next-intl imports "next/navigation" without a file extension, which Node rejects; let Vite resolve it.
    server: { deps: { inline: ["next-intl"] } },
    // @i18n-end
  },
})
