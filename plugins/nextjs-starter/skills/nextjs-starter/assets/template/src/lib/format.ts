/** Central number/date formatting so every screen formats values the same way. */

const DEFAULT_LOCALE = "en"

export function formatNumber(value: number, options?: Intl.NumberFormatOptions, locale = DEFAULT_LOCALE) {
  return new Intl.NumberFormat(locale, options).format(value)
}

export function formatCompact(value: number, locale = DEFAULT_LOCALE) {
  return formatNumber(value, { notation: "compact", maximumFractionDigits: 1 }, locale)
}

export function formatCurrency(value: number, currency = "USD", locale = DEFAULT_LOCALE) {
  return formatNumber(value, { style: "currency", currency, maximumFractionDigits: 0 }, locale)
}

export function formatPercent(value: number, locale = DEFAULT_LOCALE) {
  return formatNumber(value, { style: "percent", maximumFractionDigits: 1 }, locale)
}

export function formatDate(
  value: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
  locale = DEFAULT_LOCALE,
) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat(locale, options ?? { dateStyle: "medium" }).format(date)
}
