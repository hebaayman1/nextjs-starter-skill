import type { Messages } from "next-intl"

/** `labelKey` is a key in the "navigation" namespace of messages/{locale}.json. */
export type NavItem = { href: string; labelKey: keyof Messages["navigation"] }
export type NavGroup = { labelKey?: keyof Messages["navigation"]; items: NavItem[] }

/** Single source of truth for the portal navigation. */
export const navigation: NavGroup[] = [
  {
    items: [
      { href: "/", labelKey: "home" },
      // @example-start
      { href: "/posts", labelKey: "posts" },
      // @example-end
    ],
  },
]
