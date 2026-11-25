import { createCn } from "cn/config"

/**
 * Tailwind-aware class merger (drop-in for clsx + tailwind-merge).
 * The custom scales below MUST mirror src/styles/theme.css, otherwise cn()
 * cannot tell `text-body` (font size) from `text-content-primary` (color)
 * or know that `gap-m` overrides `gap-xs`. Radius uses Tailwind's own sm/md/lg names, so it needs no entry.
 */
export const cn = createCn({
  extend: {
    theme: {
      spacing: ["3xs", "2xs", "xs", "s", "m", "l", "xl", "2xl"],
      text: ["caption", "body", "title", "heading", "display"],
      shadow: ["s", "m"],
    },
  },
})
