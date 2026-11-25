import Link from "next/link"
import { Container } from "../ui/container"

const nav = [{ href: "/", label: "Home" }, { href: "/about", label: "About" }]

export function Header() {
  return (
    <header className="border-b border-border">
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <Link href="/" className="text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">%%APP_NAME%%</Link>
        <nav aria-label="Main navigation" className="flex items-center gap-6">
          {nav.map(({ href, label }) => <Link key={href} href={href} className="min-h-11 content-center text-sm font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{label}</Link>)}
        </nav>
      </Container>
    </header>
  )
}
