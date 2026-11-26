"use client"

import { useLocale, useTranslations } from "next-intl"
import { Suspense, useTransition } from "react"
import { buttonVariants } from "@/components/ui/button-variants"
import { languageName, routing, usePathname, useRouter } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const locales: readonly string[] = routing.locales

function LocaleSwitch() {
  const t = useTranslations("language")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // The URL carries the language, so switching replaces the locale prefix and keeps the path and query.
  function switchTo(next: string) {
    startTransition(() => router.replace(`${pathname}${window.location.search}`, { locale: next }))
  }

  if (locales.length === 2) {
    const next = locales.find((code) => code !== locale) ?? routing.defaultLocale
    return (
      <button
        type="button"
        lang={next}
        aria-label={t("switchTo", { language: languageName(next) })}
        disabled={isPending}
        onClick={() => switchTo(next)}
        className={buttonVariants({ variant: "ghost", size: "s" })}
      >
        {languageName(next)}
      </button>
    )
  }

  return (
    <select
      aria-label={t("label")}
      value={locale}
      disabled={isPending}
      onChange={(event) => switchTo(event.target.value)}
      className={cn(buttonVariants({ variant: "secondary", size: "s" }), "appearance-auto")}
    >
      {locales.map((code) => (
        <option key={code} value={code} lang={code}>
          {languageName(code)}
        </option>
      ))}
    </select>
  )
}

/** usePathname() is request-time data, so with cacheComponents it must sit under <Suspense>. */
export function LanguageToggle() {
  return (
    <Suspense fallback={null}>
      <LocaleSwitch />
    </Suspense>
  )
}
