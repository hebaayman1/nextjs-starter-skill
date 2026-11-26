import type { Metadata } from "next"
import type { ReactNode } from "react"
// @themes-start
import { themeScript } from "@/lib/theme"
// @themes-end
import { inter } from "./fonts"
import { Providers } from "./providers"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "%%APP_NAME%%", template: "%s · %%APP_NAME%%" },
  description: "%%APP_DESCRIPTION%%",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={inter.variable}
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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
