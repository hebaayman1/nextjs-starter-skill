import { Container } from "../ui/container"

export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-sm text-muted">
      <Container><p>© {new Date().getFullYear()} %%APP_NAME%%</p></Container>
    </footer>
  )
}
