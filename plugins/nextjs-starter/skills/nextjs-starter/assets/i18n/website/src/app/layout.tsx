import type { ReactNode } from "react"

// The real root layout is app/[locale]/layout.tsx. This one only passes children through
// so app/not-found.tsx can render for URLs outside a locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
