import type { Metadata } from "next"
import type { ReactNode } from "react"
import { MainLayout } from "@/components"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "%%APP_NAME%%", template: "%s | %%APP_NAME%%" },
  description: "%%APP_DESCRIPTION%%",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased"><MainLayout>{children}</MainLayout></body>
    </html>
  )
}
