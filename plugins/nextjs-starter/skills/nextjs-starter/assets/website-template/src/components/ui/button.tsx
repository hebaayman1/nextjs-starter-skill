import { cn } from "cn"
import Link from "next/link"
import type { MouseEventHandler, ReactNode } from "react"

type Props = { children: ReactNode; className?: string } & (
  | { href: string; onClick?: never; type?: never }
  | { href?: never; onClick?: MouseEventHandler<HTMLButtonElement>; type?: "button" | "submit" | "reset" }
)

export function Button({ children, className, href, onClick, type = "button" }: Props) {
  const styles = cn(
    "inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-5 py-3 font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    className,
  )
  if (href) return <Link href={href} className={styles}>{children}</Link>
  return <button type={type} onClick={onClick} className={styles}>{children}</button>
}
