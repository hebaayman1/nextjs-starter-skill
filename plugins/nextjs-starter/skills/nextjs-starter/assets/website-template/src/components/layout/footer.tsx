import { site } from "@/config/site"
import { Container } from "../ui/container"

export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-sm text-muted">
      <Container><p>© {new Date().getFullYear()} {site.name}</p></Container>
    </footer>
  )
}
