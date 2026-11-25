const fallbackOrigin = "http://localhost:3000"

/** Deployed origin from NEXT_PUBLIC_SITE_URL; an unset or empty value falls back to localhost. */
export function siteOrigin() {
  return process.env.NEXT_PUBLIC_SITE_URL || fallbackOrigin
}

/** Absolute URL for a path on this site, for metadata, sitemap and robots. */
export function siteUrl(path = "/") {
  return new URL(path, siteOrigin()).toString()
}
