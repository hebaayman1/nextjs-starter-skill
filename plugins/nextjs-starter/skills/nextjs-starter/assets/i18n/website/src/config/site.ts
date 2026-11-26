import type { Messages } from "next-intl"

type Page = {
  href: string
  /** Key in the "navigation" namespace of messages/{locale}.json. */
  labelKey: keyof Messages["navigation"]
  /** `true` also adds the page to the header. */
  nav: boolean
}

/**
 * Site-wide identity and page list. Header, metadata, sitemap and llms.txt all read from here,
 * so adding a page means adding one entry (and its label in every messages file).
 * The description and all other copy live in messages/{locale}.json.
 */
export const site = {
  name: "%%APP_NAME%%",
  /** Every public page, without the locale prefix. All appear in the sitemap and llms.txt in every language. */
  pages: [
    { href: "/", labelKey: "home", nav: true },
    { href: "/about", labelKey: "about", nav: true },
  ] satisfies Page[],
}
