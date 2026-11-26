/** Every theme has a `[data-theme="<name>"]` token block. "system" follows the OS light/dark setting. */
export const themes = [%%THEMES%%] as const

export type Theme = (typeof themes)[number]
export type ThemePreference = Theme | "system"

/** localStorage key holding the visitor's choice. No key means "system". */
export const themeStorageKey = "theme"

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (themes as readonly string[]).includes(value)
}

/** The theme to show for a stored preference: a saved theme wins, anything else follows the system. */
export function resolveTheme(preference: string | null, prefersDark: boolean): Theme {
  if (isTheme(preference)) return preference
  return prefersDark ? "dark" : "light"
}

/** Native controls and scrollbars follow this; custom themes count as light unless named "dark". */
export function colorScheme(theme: Theme) {
  return theme === "dark" ? "dark" : "light"
}

/**
 * Runs in <head> before the first paint, so a saved dark theme never flashes light.
 * It repeats resolveTheme() and colorScheme() because it cannot import them; keep them in sync.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(${JSON.stringify(themes)}.indexOf(t)<0)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t==="dark"?"dark":"light"}catch(e){}})()`
