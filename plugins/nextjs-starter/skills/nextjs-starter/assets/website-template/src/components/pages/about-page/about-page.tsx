import { site } from "@/config/site"
import { Container } from "../../ui/container"

export function AboutPage() {
  return (
    <Container as="section" className="py-20 sm:py-28">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">About {site.name}</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">{site.description}</p>
    </Container>
  )
}
