import type { MetadataRoute } from "next"
import { siteUrl } from "@/components/pages/shared/site-url.mjs"

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/about"].map((path) => ({ url: siteUrl(path) }))
}
