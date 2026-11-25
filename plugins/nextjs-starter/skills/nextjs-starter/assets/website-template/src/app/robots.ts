import type { MetadataRoute } from "next"
import { siteUrl } from "@/components/pages/shared/site-url.mjs"

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: siteUrl("/sitemap.xml") }
}
