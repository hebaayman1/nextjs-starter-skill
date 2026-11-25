export type NavItem = { href: string; label: string }
export type NavGroup = { label?: string; items: NavItem[] }

/** Single source of truth for the portal navigation. */
export const navigation: NavGroup[] = [
  {
    items: [
      { href: "/", label: "Home" },
      // @example-start
      { href: "/posts", label: "Posts (example)" },
      // @example-end
    ],
  },
]
