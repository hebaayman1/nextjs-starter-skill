import type { MetadataRoute } from "next"
import { site } from "@/config/site"
import { routing } from "@/i18n/routing"
import { localizedPath } from "@/lib/localized-url"
import { siteUrl } from "@/lib/site-url"

// One entry per page and language, each listing its translations (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  return site.pages.flatMap(({ href }) => {
    const languages = Object.fromEntries(routing.locales.map((locale) => [locale, siteUrl(localizedPath(locale, href))]))
    return routing.locales.map((locale) => ({ url: siteUrl(localizedPath(locale, href)), alternates: { languages } }))
  })
}
