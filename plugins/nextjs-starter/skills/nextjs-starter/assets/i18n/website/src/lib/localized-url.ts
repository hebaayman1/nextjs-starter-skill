import { routing } from "@/i18n/routing"

/** "/about" in "ar" -> "/ar/about"; "/" -> "/ar". */
export function localizedPath(locale: string, href: string) {
  return `/${locale}${href === "/" ? "" : href}`
}

/** Canonical URL plus hreflang links for a page's metadata (`alternates`). */
export function alternates(href: string, locale: string) {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((code) => [code, localizedPath(code, href)]),
  )
  languages["x-default"] = localizedPath(routing.defaultLocale, href)
  return { canonical: localizedPath(locale, href), languages }
}
