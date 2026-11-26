import { useTranslations } from "next-intl"
import { site } from "@/config/site"
import { Link } from "@/i18n/routing"
import { Container } from "../ui/container"
import { LanguageSwitcher } from "./language-switcher"
// @themes-start
import { ThemeToggle } from "./theme-toggle"
// @themes-end

const nav = site.pages.filter((page) => page.nav)

export function Header() {
  const t = useTranslations("navigation")
  return (
    <header className="border-b border-border">
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <Link href="/" className="text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{site.name}</Link>
        <div className="flex items-center gap-6">
          <nav aria-label={t("main")} className="flex items-center gap-6">
            {nav.map(({ href, labelKey }) => <Link key={href} href={href} className="min-h-11 content-center text-sm font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{t(labelKey)}</Link>)}
          </nav>
          {/* @themes-start */}
          <ThemeToggle />
          {/* @themes-end */}
          <LanguageSwitcher label={t("language")} />
        </div>
      </Container>
    </header>
  )
}
