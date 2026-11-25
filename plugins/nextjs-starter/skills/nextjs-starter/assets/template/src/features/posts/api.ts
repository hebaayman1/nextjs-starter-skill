import { request } from "@/lib/api/client"
import { postListSchema, postSchema, type CreatePostInput, type Post } from "./schemas"

/** Plain async functions: HTTP + validation only. No React here. */

export async function fetchPosts(params: { limit?: number } = {}): Promise<Post[]> {
  const data = await request<unknown>({ url: "/posts", params: { _limit: params.limit } })
  return postListSchema.parse(data)
}

export async function fetchPost(id: number): Promise<Post> {
  const data = await request<unknown>({ url: `/posts/${id}` })
  return postSchema.parse(data)
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const data = await request<unknown>({ url: "/posts", method: "POST", data: { ...input, userId: 1 } })
  return postSchema.parse(data)
}
