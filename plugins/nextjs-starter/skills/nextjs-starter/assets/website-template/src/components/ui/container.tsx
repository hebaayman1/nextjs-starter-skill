import type { ReactNode } from "react"

type Props = { as?: "div" | "main" | "section"; children: ReactNode; className?: string }

export function Container({ as: Element = "div", children, className = "" }: Props) {
  return <Element className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</Element>
}
