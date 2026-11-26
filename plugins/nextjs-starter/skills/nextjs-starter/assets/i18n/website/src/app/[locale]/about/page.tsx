import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { use } from "react"
import { AboutPage } from "@/components"
import { site } from "@/config/site"
import { alternates } from "@/lib/localized-url"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "about" })
  return { title: t("title", { name: site.name }), alternates: alternates("/about", locale) }
}

export default function Page({ params }: Props) {
  setRequestLocale(use(params).locale)
  return <AboutPage />
}
