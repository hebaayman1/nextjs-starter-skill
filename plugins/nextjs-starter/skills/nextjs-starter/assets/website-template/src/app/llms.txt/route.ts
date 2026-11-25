import { site } from "@/config/site"
import { siteUrl } from "@/lib/site-url"

export const dynamic = "force-static"

export function GET() {
  const pages = site.pages.map(({ href, label }) => `- [${label}](${siteUrl(href)})`).join("\n")
  return new Response(`# ${site.name}\n\n> ${site.description}\n\n## Pages\n\n${pages}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
