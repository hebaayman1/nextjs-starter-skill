import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createPost, fetchPost, fetchPosts } from "./api"

/** Query-key factory: every key for this feature starts with ["posts"]. */
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (limit: number) => [...postKeys.lists(), { limit }] as const,
  detail: (id: number) => [...postKeys.all, "detail", id] as const,
}

export const postsQueryOptions = (limit = 10) =>
  queryOptions({ queryKey: postKeys.list(limit), queryFn: () => fetchPosts({ limit }) })

export const postQueryOptions = (id: number) =>
  queryOptions({ queryKey: postKeys.detail(id), queryFn: () => fetchPost(id) })

export function usePosts(limit = 10) {
  return useQuery(postsQueryOptions(limit))
}

export function usePost(id: number) {
  return useQuery(postQueryOptions(id))
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.lists() }),
  })
}
