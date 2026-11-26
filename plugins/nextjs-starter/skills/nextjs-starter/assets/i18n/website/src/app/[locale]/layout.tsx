import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import { MainLayout } from "@/components"
import { site } from "@/config/site"
import { direction, routing } from "@/i18n/routing"
import { siteOrigin } from "@/lib/site-url"
import "../globals.css"

type Props = { children: ReactNode; params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })
  return {
    metadataBase: new URL(siteOrigin()),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: t("description"),
    openGraph: { type: "website", siteName: site.name, locale: locale.replace("-", "_") },
    twitter: { card: "summary_large_image" },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} dir={direction(locale)}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider>
          <MainLayout>{children}</MainLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
