import { Button, Container } from "@/components"

export default function NotFound() {
  return (
    <Container as="section" className="py-24 text-center">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-4 text-muted">The page you requested is unavailable.</p>
      <Button href="/" className="mt-8">Back to home</Button>
    </Container>
  )
}
