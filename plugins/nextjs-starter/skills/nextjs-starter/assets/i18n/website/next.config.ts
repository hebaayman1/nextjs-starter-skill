import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

// Points next-intl at src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  reactCompiler: true,
}

export default withNextIntl(nextConfig)
