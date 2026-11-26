import { expect, test } from "vitest"
import { routing } from "@/i18n/routing"
import { alternates, localizedPath } from "./localized-url"

test("pages are prefixed with their locale", () => {
  expect(localizedPath("ar", "/")).toBe("/ar")
  expect(localizedPath("en", "/about")).toBe("/en/about")
})

test("alternates list every language plus x-default", () => {
  const { canonical, languages } = alternates("/about", routing.locales[0])
  expect(canonical).toBe(`/${routing.locales[0]}/about`)
  for (const locale of routing.locales) expect(languages[locale]).toBe(`/${locale}/about`)
  expect(languages["x-default"]).toBe(`/${routing.defaultLocale}/about`)
})
