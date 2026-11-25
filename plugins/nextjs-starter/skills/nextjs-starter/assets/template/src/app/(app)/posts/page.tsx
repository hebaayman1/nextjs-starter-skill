import type { Metadata } from "next"
import { PostsView } from "@/features/posts"

export const metadata: Metadata = { title: "Posts" }

// Routes stay thin: URL + metadata, then hand off to the feature view.
export default function PostsPage() {
  return <PostsView />
}
