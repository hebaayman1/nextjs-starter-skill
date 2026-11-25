"use client"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Spinner } from "@/components/ui/spinner"
import { surface } from "@/lib/variants"
import { usePosts } from "../hooks"

export function PostsView() {
  const { data: posts, isPending, isError, error, refetch, isFetching } = usePosts(10)

  if (isPending) {
    return (
      <div className="flex items-center gap-xs text-body text-content-secondary">
        <Spinner /> Loading posts…
      </div>
    )
  }

  if (isError) {
    return (
      <EmptyState
        title="Could not load posts"
        description={error.message}
        action={
          <Button variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  if (posts.length === 0) return <EmptyState title="No posts yet" />

  return (
    <section className="flex flex-col gap-m">
      <div className="flex items-center justify-between gap-m">
        <h1 className="text-heading font-semibold text-content-primary">Posts</h1>
        <Button variant="secondary" size="s" loading={isFetching} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <ul className="grid gap-s md:grid-cols-2">
        {posts.map((post) => (
          <li key={post.id} className={`${surface} flex flex-col gap-2xs p-m`}>
            <h2 className="text-title font-medium text-content-primary first-letter:uppercase">{post.title}</h2>
            <p className="line-clamp-3 text-body text-content-secondary">{post.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
