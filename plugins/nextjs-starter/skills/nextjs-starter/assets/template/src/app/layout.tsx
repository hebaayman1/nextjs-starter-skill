import type { Metadata } from "next"
import type { ReactNode } from "react"
import { inter } from "./fonts"
import { Providers } from "./providers"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "%%APP_NAME%%", template: "%s · %%APP_NAME%%" },
  description: "%%APP_DESCRIPTION%%",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
