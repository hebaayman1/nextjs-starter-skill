import type { MetadataRoute } from "next"
import { site } from "@/config/site"
import { siteUrl } from "@/lib/site-url"

export default function sitemap(): MetadataRoute.Sitemap {
  return site.pages.map(({ href }) => ({ url: siteUrl(href) }))
}
