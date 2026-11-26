import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

// Points next-intl at src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // Opt-in caching model: everything is dynamic unless marked with "use cache".
  cacheComponents: true,
  // Prefetch only the static shell of links; dynamic parts load on navigation.
  partialPrefetching: true,
  // Automatic memoization (babel-plugin-react-compiler).
  reactCompiler: true,
}

export default withNextIntl(nextConfig)
