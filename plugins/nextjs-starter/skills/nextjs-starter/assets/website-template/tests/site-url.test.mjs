import assert from "node:assert/strict"
import { after, test } from "node:test"
import { siteUrl } from "../src/components/pages/shared/site-url.mjs"

const original = process.env.NEXT_PUBLIC_SITE_URL
after(() => {
  if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
  else process.env.NEXT_PUBLIC_SITE_URL = original
})

test("SEO URLs use the configured production origin", () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.org"
  assert.equal(siteUrl("/about"), "https://example.org/about")
  assert.equal(siteUrl("/sitemap.xml"), "https://example.org/sitemap.xml")
})
