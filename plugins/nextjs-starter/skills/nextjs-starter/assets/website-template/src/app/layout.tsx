import type { Metadata } from "next"
import type { ReactNode } from "react"
import { MainLayout } from "@/components"
import { site } from "@/config/site"
import { siteOrigin } from "@/lib/site-url"
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
    <html lang="en">
      <body className="font-sans antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
