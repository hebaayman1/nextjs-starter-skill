"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errors")
  return (
    <EmptyState
      title={t("title")}
      description={error.message}
      action={<Button onClick={() => reset()}>{t("retry")}</Button>}
    />
  )
}
