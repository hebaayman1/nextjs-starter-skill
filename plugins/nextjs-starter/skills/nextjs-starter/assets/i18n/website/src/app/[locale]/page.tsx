import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"
import { HomePage } from "@/components"
import { alternates } from "@/lib/localized-url"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return { alternates: alternates("/", locale) }
}

export default function Page({ params }: Props) {
  setRequestLocale(use(params).locale)
  return <HomePage />
}
