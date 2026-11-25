import { Button } from "../../ui/button"
import { Container } from "../../ui/container"
import { homeContent } from "./home-data"

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="bg-surface py-24 sm:py-32">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">{homeContent.eyebrow}</p>
        <h1 id="hero-title" className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">{homeContent.heading}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{homeContent.description}</p>
        <Button href={homeContent.action.href} className="mt-8">{homeContent.action.label}</Button>
      </Container>
    </section>
  )
}
