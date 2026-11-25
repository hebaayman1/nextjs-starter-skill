import { notFound } from "next/navigation"
import type { ReactNode } from "react"

// Development-only gallery: hidden in production builds.
export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound()
  return <div className="min-h-dvh bg-bg-secondary p-l">{children}</div>
}
