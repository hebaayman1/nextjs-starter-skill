/**
 * Site-wide identity and page list. Header, footer, metadata, sitemap and
 * llms.txt all read from here, so adding a page means adding one entry.
 */
export const site = {
  name: "%%APP_NAME%%",
  description: "%%APP_DESCRIPTION%%",
  /** Every public page. All appear in the sitemap and llms.txt; `nav: true` also adds them to the header. */
  pages: [
    { href: "/", label: "Home", nav: true },
    { href: "/about", label: "About", nav: true },
  ],
}
