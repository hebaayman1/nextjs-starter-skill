import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { use } from "react"
import { PostsView } from "@/features/posts"

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "posts" })
  return { title: t("title") }
}

// Routes stay thin: URL + metadata, then hand off to the feature view.
export default function PostsPage({ params }: Props) {
  setRequestLocale(use(params).locale)
  return <PostsView />
}
