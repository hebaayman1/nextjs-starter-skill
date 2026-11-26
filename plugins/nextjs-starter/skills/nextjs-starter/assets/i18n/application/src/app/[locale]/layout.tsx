import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getMessages, getTimeZone, getTranslations, setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import { direction, routing } from "@/i18n/routing"
// @themes-start
import { themeScript } from "@/lib/theme"
// @themes-end
import { fontVariables } from "../fonts"
import { Providers } from "../providers"
import "../globals.css"

type Props = { children: ReactNode; params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })
  return {
    title: { default: "%%APP_NAME%%", template: "%s · %%APP_NAME%%" },
    description: t("description"),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const [messages, timeZone] = await Promise.all([getMessages({ locale }), getTimeZone({ locale })])

  return (
    <html
      lang={locale}
      dir={direction(locale)}
      className={fontVariables}
      // @themes-start
      // themeScript sets data-theme before React hydrates, so the server HTML differs on purpose.
      suppressHydrationWarning
      // @themes-end
    >
      {/* @themes-start */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* @themes-end */}
      <body>
        <Providers locale={locale} messages={messages} timeZone={timeZone}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
