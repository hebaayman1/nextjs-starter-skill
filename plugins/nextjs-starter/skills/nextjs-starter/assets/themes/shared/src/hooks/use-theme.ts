import { useSyncExternalStore } from "react"
import { colorScheme, isTheme, resolveTheme, themes, themeStorageKey, type Theme, type ThemePreference } from "@/lib/theme"

const darkQuery = "(prefers-color-scheme: dark)"
const listeners = new Set<() => void>()
let media: MediaQueryList | undefined

function readPreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(themeStorageKey)
    return isTheme(saved) ? saved : "system"
  } catch {
    return "system" // storage blocked (private mode, sandboxed iframe)
  }
}

function readTheme() {
  const theme = document.documentElement.dataset.theme
  return isTheme(theme) ? theme : undefined
}

function apply() {
  const theme = resolveTheme(readPreference(), matchMedia(darkQuery).matches)
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = colorScheme(theme)
  for (const listener of listeners) listener()
}

function onStorage(event: StorageEvent) {
  if (event.key === themeStorageKey) apply() // changed in another tab
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) {
    media = matchMedia(darkQuery)
    media.addEventListener("change", apply)
    window.addEventListener("storage", onStorage)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      media?.removeEventListener("change", apply)
      window.removeEventListener("storage", onStorage)
    }
  }
}

/** Save a theme ("system" clears the choice) and apply it to <html data-theme>. */
export function setTheme(preference: string) {
  try {
    if (isTheme(preference)) localStorage.setItem(themeStorageKey, preference)
    else localStorage.removeItem(themeStorageKey)
  } catch {
    // storage blocked: the theme still applies until the page reloads
  }
  apply()
}

/**
 * `preference` is what the visitor picked ("system" by default); `theme` is what is showing.
 * Both are only known in the browser: on the server and during hydration they are "system" and undefined.
 */
export function useTheme(): {
  preference: ThemePreference
  theme: Theme | undefined
  themes: typeof themes
  setTheme: typeof setTheme
} {
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as const)
  const theme = useSyncExternalStore(subscribe, readTheme, () => undefined)
  return { preference, theme, themes, setTheme }
}
