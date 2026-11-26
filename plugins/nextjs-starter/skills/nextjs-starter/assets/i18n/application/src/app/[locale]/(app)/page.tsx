import { useTranslations } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"
import { buttonVariants } from "@/components/ui/button-variants"
import { Link } from "@/i18n/routing"
import { surface } from "@/lib/variants"

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale(use(params).locale)
  const t = useTranslations("home")

  return (
    <section className="flex max-w-3xl flex-col gap-l">
      <div className="flex flex-col gap-xs">
        <h1 className="text-display font-semibold text-content-primary">%%APP_NAME%%</h1>
        <p className="text-body text-content-secondary">
          Next.js App Router · Tailwind v4 tokens · Axios · TanStack Query · Zod · next-intl · Vitest
        </p>
      </div>
      <div className={`${surface} flex flex-col gap-s p-l`}>
        <p className="text-title font-medium">{t("startHere")}</p>
        <ul className="list-disc ps-l text-body text-content-secondary">
          <li>{t("readRules")}</li>
          <li>{t("replaceTokens")}</li>
          <li>{t("addFeatures")}</li>
          <li>{t("addMessages")}</li>
        </ul>
        <div className="flex flex-wrap gap-xs">
          {/* @example-start */}
          <Link href="/posts" className={buttonVariants()}>
            {t("exampleFeature")}
          </Link>
          {/* @example-end */}
          <Link href="/design-system" className={buttonVariants({ variant: "secondary" })}>
            {t("gallery")}
          </Link>
        </div>
      </div>
    </section>
  )
}
