"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { surface } from "@/lib/variants"
import { usePosts } from "../hooks"

export function PostsView() {
  const t = useTranslations("posts")
  const { data: posts, isPending, isError, error, refetch, isFetching } = usePosts(10)

  if (isPending) {
    return (
      <div className="flex items-center gap-xs text-body text-content-secondary">
        <Spinner /> {t("loading")}
      </div>
    )
  }

  if (isError) {
    return (
      <EmptyState
        title={t("loadError")}
        description={error.message}
        action={
          <Button variant="secondary" onClick={() => refetch()}>
            {t("retry")}
          </Button>
        }
      />
    )
  }

  if (posts.length === 0) return <EmptyState title={t("empty")} />

  return (
    <section className="flex flex-col gap-m">
      <div className="flex items-center justify-between gap-m">
        <h1 className="text-heading font-semibold text-content-primary">{t("title")}</h1>
        <Button variant="secondary" size="s" loading={isFetching} onClick={() => refetch()}>
          {t("refresh")}
        </Button>
      </div>
      <ul className="grid gap-s md:grid-cols-2">
        {posts.map((post) => (
          // The example API returns Latin placeholder text, so mark it as such for screen readers.
          <li key={post.id} lang="la" className={`${surface} flex flex-col gap-2xs p-m`}>
            <h2 className="text-title font-medium text-content-primary first-letter:uppercase">{post.title}</h2>
            <p className="line-clamp-3 text-body text-content-secondary">{post.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
