"use client"

import { useTranslations } from "next-intl"
import { buttonVariants } from "@/components/ui/button-variants"
import { EmptyState } from "@/components/ui/empty-state"
import { Link } from "@/i18n/routing"

export default function PortalNotFound() {
  const t = useTranslations("errors")
  return (
    <EmptyState
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      action={
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          {t("backHome")}
        </Link>
      }
    />
  )
}
