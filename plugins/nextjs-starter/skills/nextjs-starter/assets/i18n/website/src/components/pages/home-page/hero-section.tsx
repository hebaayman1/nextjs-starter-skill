import { useTranslations } from "next-intl"
import { site } from "@/config/site"
import { Button } from "../../ui/button"
import { Container } from "../../ui/container"
import { homeLinks } from "./home-data"

export function HeroSection() {
  const t = useTranslations("home")
  const meta = useTranslations("metadata")
  return (
    <section aria-labelledby="hero-title" className="bg-surface py-24 sm:py-32">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">{t("eyebrow")}</p>
        <h1 id="hero-title" className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">{site.name}</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{meta("description")}</p>
        <Button href={homeLinks.action} className="mt-8">{t("action")}</Button>
      </Container>
    </section>
  )
}
