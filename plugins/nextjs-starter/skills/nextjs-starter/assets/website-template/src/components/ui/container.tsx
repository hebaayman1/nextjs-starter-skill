import { cn } from "cn"
import type { ReactNode } from "react"

// No "main": MainLayout already renders the page's single <main>.
type Props = { as?: "div" | "section" | "article"; children: ReactNode; className?: string }

export function Container({ as: Element = "div", children, className }: Props) {
  return <Element className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</Element>
}
