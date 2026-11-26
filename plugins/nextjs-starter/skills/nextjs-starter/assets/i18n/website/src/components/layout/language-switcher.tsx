"use client"

import { useLocale } from "next-intl"
import { languageName, Link, routing, usePathname } from "@/i18n/routing"

// Plain links (not a script-driven menu), so crawlers and no-JS visitors can reach every language.
export function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale()
  const pathname = usePathname()
  return (
    <ul aria-label={label} className="flex items-center gap-4">
      {routing.locales.filter((code) => code !== locale).map((code) => (
        <li key={code}>
          <Link href={pathname} locale={code} lang={code} hrefLang={code} className="min-h-11 content-center text-sm font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{languageName(code)}</Link>
        </li>
      ))}
    </ul>
  )
}
