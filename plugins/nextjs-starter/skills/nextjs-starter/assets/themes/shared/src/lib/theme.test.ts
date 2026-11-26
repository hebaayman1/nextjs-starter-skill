import { describe, expect, it } from "vitest"
import { isTheme, resolveTheme, themeScript, themes } from "./theme"

describe("resolveTheme", () => {
  it("uses a saved theme", () => {
    for (const theme of themes) expect(resolveTheme(theme, true)).toBe(theme)
  })

  it("follows the system when nothing valid is saved", () => {
    expect(resolveTheme(null, true)).toBe("dark")
    expect(resolveTheme(null, false)).toBe("light")
    expect(resolveTheme("system", true)).toBe("dark")
    expect(resolveTheme("removed-theme", false)).toBe("light")
  })

  it("only accepts known themes", () => {
    expect(isTheme("dark")).toBe(true)
    expect(isTheme("system")).toBe(false)
  })
})

describe("themeScript", () => {
  // Run the inline <head> script against fake browser globals.
  function run(saved: string | null, prefersDark: boolean) {
    const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> }
    const storage = { getItem: () => saved }
    const matchMedia = () => ({ matches: prefersDark })
    new Function("localStorage", "matchMedia", "document", themeScript)(storage, matchMedia, { documentElement: root })
    return root
  }

  it("matches resolveTheme before React loads", () => {
    for (const saved of [null, "system", ...themes]) {
      for (const prefersDark of [true, false]) {
        const theme = resolveTheme(saved, prefersDark)
        const root = run(saved, prefersDark)
        expect(root.dataset.theme).toBe(theme)
        expect(root.style.colorScheme).toBe(theme === "dark" ? "dark" : "light")
      }
    }
  })
})
