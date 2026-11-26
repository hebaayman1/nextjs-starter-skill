"use client"

// @i18n-start
import { useTranslations } from "next-intl"
// @i18n-end
import { useTheme } from "@/hooks/use-theme"
// @no-i18n-start

const labels = { label: "Theme", system: "System", %%THEME_LABELS%% } as const
// @no-i18n-end

export function ThemeToggle() {
  // @i18n-start
  const t = useTranslations("theme")
  // @i18n-end
  // @no-i18n-start
  const t = (key: keyof typeof labels) => labels[key]
  // @no-i18n-end
  const { preference, themes, setTheme } = useTheme()

  return (
    <select aria-label={t("label")} value={preference} onChange={(event) => setTheme(event.target.value)} className="min-h-11 rounded-md border border-border bg-background px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
      {(["system", ...themes] as const).map((option) => <option key={option} value={option}>{t(option)}</option>)}
    </select>
  )
}
