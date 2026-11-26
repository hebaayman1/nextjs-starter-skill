import type { Metadata } from "next"
import type { ReactNode } from "react"
import { MainLayout } from "@/components"
import { site } from "@/config/site"
import { siteOrigin } from "@/lib/site-url"
// @themes-start
import { themeScript } from "@/lib/theme"
// @themes-end
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      // @themes-start
      // themeScript sets data-theme before React hydrates, so the server HTML differs on purpose.
      suppressHydrationWarning
      // @themes-end
    >
      {/* @themes-start */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* @themes-end */}
      <body className="font-sans antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
