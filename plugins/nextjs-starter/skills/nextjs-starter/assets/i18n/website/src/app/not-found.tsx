import { site } from "@/config/site"
import "./globals.css"

// Only for URLs outside a locale; localized 404s live in app/[locale]/not-found.tsx.
export default function NotFound() {
  return (
    <html lang="%%DEFAULT_LOCALE%%" dir="%%DEFAULT_DIR%%">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center font-sans antialiased">
        <p className="text-4xl font-semibold">404</p>
        <a href="/" className="text-accent underline">{site.name}</a>
      </body>
    </html>
  )
}
