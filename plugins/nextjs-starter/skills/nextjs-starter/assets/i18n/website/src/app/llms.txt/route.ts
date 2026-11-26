import { getTranslations } from "next-intl/server"
import { site } from "@/config/site"
import { languageName, routing } from "@/i18n/routing"
import { localizedPath } from "@/lib/localized-url"
import { siteUrl } from "@/lib/site-url"

export const dynamic = "force-static"

export async function GET() {
  const sections = await Promise.all(
    routing.locales.map(async (locale) => {
      const t = await getTranslations({ locale, namespace: "navigation" })
      const pages = site.pages
        .map(({ href, labelKey }) => `- [${t(labelKey)}](${siteUrl(localizedPath(locale, href))})`)
        .join("\n")
      return `## ${languageName(locale)}\n\n${pages}`
    }),
  )
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: "metadata" })
  return new Response(`# ${site.name}\n\n> ${t("description")}\n\n${sections.join("\n\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
