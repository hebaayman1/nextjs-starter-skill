import type { ReactNode } from "react"
import { Footer } from "./footer"
import { Header } from "./header"

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:p-3">Skip to content</a>
      <Header />
      <main id="main-content" className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  )
}
