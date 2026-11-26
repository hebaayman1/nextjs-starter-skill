import Link from "next/link"
import "./globals.css"

// Only for URLs outside a locale; localized 404s live in app/[locale]/(app)/not-found.tsx.
export default function NotFound() {
  return (
    <html lang="%%DEFAULT_LOCALE%%" dir="%%DEFAULT_DIR%%">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-s p-l text-center">
        <p className="text-display font-semibold text-content-primary">404</p>
        <Link href="/" className="text-body text-content-brand underline">
          %%APP_NAME%%
        </Link>
      </body>
    </html>
  )
}
