import { useTranslations } from "next-intl"
import { site } from "@/config/site"
import { Container } from "../../ui/container"

export function AboutPage() {
  const t = useTranslations("about")
  const meta = useTranslations("metadata")
  return (
    <Container as="section" className="py-20 sm:py-28">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("title", { name: site.name })}</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">{meta("description")}</p>
    </Container>
  )
}
