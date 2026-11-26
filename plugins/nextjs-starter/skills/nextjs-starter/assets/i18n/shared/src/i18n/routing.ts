import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: [%%LOCALES%%],
  defaultLocale: "%%DEFAULT_LOCALE%%",
  // The URL alone decides the language: no browser-language detection and no remembered cookie.
  localeDetection: false,
  localeCookie: false,
})

export type Locale = (typeof routing.locales)[number]

const rtlLanguages = new Set(["ar", "ckb", "dv", "fa", "he", "ps", "sd", "ug", "ur", "yi"])

/** True for right-to-left scripts (Arabic, Hebrew, Persian, Urdu…). */
export function isRtlLocale(locale: string) {
  return rtlLanguages.has(new Intl.Locale(locale).language)
}

export function direction(locale: string) {
  return isRtlLocale(locale) ? "rtl" : "ltr"
}

/** The language's own name ("العربية", "English"), for language switchers. */
export function languageName(locale: string) {
  return new Intl.DisplayNames([locale], { type: "language" }).of(locale) ?? locale
}

// Locale-aware navigation. Import these instead of next/link and next/navigation so the locale prefix stays in the URL.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
