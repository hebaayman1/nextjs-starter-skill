import { useTranslations } from "next-intl"
import { Button, Container } from "@/components"

export default function NotFound() {
  const t = useTranslations("notFound")
  return (
    <Container as="section" className="py-24 text-center">
      <h1 className="text-4xl font-semibold">{t("title")}</h1>
      <p className="mt-4 text-muted">{t("description")}</p>
      <Button href="/" className="mt-8">{t("backHome")}</Button>
    </Container>
  )
}
