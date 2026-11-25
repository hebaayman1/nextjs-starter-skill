import { afterEach, expect, test, vi } from "vitest"
import { siteUrl } from "./site-url"

afterEach(() => {
  vi.unstubAllEnvs()
})

test("SEO URLs use the configured production origin", () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.org")
  expect(siteUrl("/about")).toBe("https://example.org/about")
  expect(siteUrl("/sitemap.xml")).toBe("https://example.org/sitemap.xml")
})

test("an empty origin falls back to localhost", () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "")
  expect(siteUrl()).toBe("http://localhost:3000/")
})
