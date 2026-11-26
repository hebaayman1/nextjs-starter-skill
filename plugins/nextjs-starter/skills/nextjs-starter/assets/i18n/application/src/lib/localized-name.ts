import { routing } from "@/i18n/routing"

/** "ar" -> "Ar", "pt-BR" -> "PtBr": the suffix the backend appends to per-language fields. */
function fieldSuffix(locale: string) {
  return locale
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("")
}

/**
 * Text stored by the backend per language (nameAr, nameEn, titleFr…) is not in messages/*.json.
 * Pick the field for `locale`, then the first non-empty one from `fallbacks`.
 *
 *   localizedField(role, "name", locale)  // role.nameAr in Arabic, role.nameEn in English
 */
export function localizedField(
  entity: object,
  field: string,
  locale: string,
  fallbacks: readonly string[] = [routing.defaultLocale, ...routing.locales],
): string {
  const record = entity as Record<string, unknown>
  for (const code of [locale, ...fallbacks]) {
    const value = record[`${field}${fieldSuffix(code)}`]
    if (typeof value === "string" && value.trim() !== "") return value
  }
  return ""
}

/** Shorthand for the common `nameAr` / `nameEn` case. */
export function localizedName(entity: object, locale: string) {
  return localizedField(entity, "name", locale)
}
