import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

// Next.js proxy (formerly middleware): adds the locale prefix to every page URL ("/" -> "/%%DEFAULT_LOCALE%%").
export default createMiddleware(routing)

export const config = {
  // Skip API routes, Next internals, the generated social image, and files with an extension (robots.txt, icon.svg…).
  matcher: "/((?!api|_next|_vercel|opengraph-image|.*\\..*).*)",
}
