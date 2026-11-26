import { useLocale, useTranslations, type Messages, type NamespaceKeys, type NestedKeyOf } from "next-intl"
import { isRtlLocale } from "@/i18n/routing"

type Namespace = NamespaceKeys<Messages, NestedKeyOf<Messages>>

/**
 * Current language in one call: `const { t, locale, isRTL } = useLanguage("posts")`.
 * Prefer logical Tailwind utilities (ms-*, pe-*, start-*, text-start, rtl:*) for layout;
 * use `isRTL` only for what CSS cannot flip, such as icon direction or chart axes.
 */
export function useLanguage<N extends Namespace = never>(namespace?: N) {
  const locale = useLocale()
  const t = useTranslations(namespace)
  return { t, locale, isRTL: isRtlLocale(locale) }
}
