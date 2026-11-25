import { z } from "zod"

/** Runtime validation of API responses and form input. Types are inferred, never hand-written. */
export const postSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
})

export const postListSchema = z.array(postSchema)

export const createPostSchema = postSchema.pick({ title: true, body: true }).extend({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
})

export type Post = z.infer<typeof postSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
