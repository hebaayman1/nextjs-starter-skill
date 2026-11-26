# %%APP_NAME%%: website architecture

This is a static-content Next.js marketing website. Keep route files in `src/app` thin; put each page's sections and content in `src/components/pages/<name>-page/`. Share genuine building blocks through `src/components/ui/`, site chrome through `src/components/layout/`, and icons through `src/components/icons/`. Export public components from `src/components/index.ts`. Route files import components from `@/components`; files inside `src/components/` import each other with relative paths so the barrel never imports itself.

<!-- @no-i18n-start -->
`src/config/site.ts` holds the site name, description, and page list. The header, footer, metadata, sitemap, and `llms.txt` read from it. To add a page: create `src/components/pages/<name>-page/`, export it from the barrel, add a thin route with its own `metadata`, and add the page to `site.pages` (`nav: true` puts it in the header). Non-component helpers go in `src/lib/`. Merge class names with `cn` from the `cn` package.
<!-- @no-i18n-end -->
<!-- @i18n-start -->
`src/config/site.ts` holds the site name and page list; the description and all other copy live in `messages/<language>.json`. The header, footer, metadata, sitemap, and `llms.txt` read from them. To add a page: create `src/components/pages/<name>-page/`, export it from the barrel, add a thin route under `src/app/[locale]/` with `generateMetadata` (translated `title` plus `alternates(href, locale)`), add the page to `site.pages` (`nav: true` puts it in the header), and add its `labelKey` and copy to every messages file. Non-component helpers go in `src/lib/`. Merge class names with `cn` from the `cn` package.
<!-- @i18n-end -->

Use `src/app/globals.css` as the source of light and dark design tokens. Map tokens into Tailwind with `@theme inline`. Load supplied brand fonts once in the root layout; put licensed files in `public/assets/fonts/`. Group images by page or section under `public/assets/images/` and use `next/image` with meaningful alt text and known dimensions.

<!-- @no-i18n-start -->
Keep static copy in `*-data.ts` next to the page sections. Put external blog, careers, or form integrations in `src/services/` only when the site needs them. Prefer native `fetch` for reading server data; add Axios only if the chosen form integration needs it. Keep server secrets out of client components. Add loading, empty, and error states for external content.
<!-- @no-i18n-end -->
<!-- @i18n-start -->
Keep static copy in `messages/<language>.json` under one namespace per page; `*-data.ts` next to the page sections holds only non-text data such as links and image paths. Put external blog, careers, or form integrations in `src/services/` only when the site needs them. Prefer native `fetch` for reading server data; add Axios only if the chosen form integration needs it. Keep server secrets out of client components. Add loading, empty, and error states for external content.
<!-- @i18n-end -->

Start with semantic HTML and accessible keyboard interactions. Add GSAP, Three.js, Embla, or HTML sanitizing only when the requested design or service requires them. Respect reduced motion. Use `isomorphic-dompurify` before rendering external HTML.

<!-- @no-i18n-start -->
The root layout sets `metadataBase`, Open Graph, and Twitter defaults; `src/app/opengraph-image.tsx` and `src/app/icon.svg` provide the social image and favicon. Give each route a `title` and `description`, and replace the icon and social image with brand assets. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin. Put unit tests next to the code as `*.test.ts` (Vitest). Run lint, typecheck, tests, and build before finishing.
<!-- @no-i18n-end -->
<!-- @i18n-start -->
`src/app/[locale]/layout.tsx` is the real root layout: it sets `<html lang dir>`, `metadataBase`, Open Graph, and Twitter defaults per language. `src/app/opengraph-image.tsx` (brand name only, shared by every language) and `src/app/icon.svg` provide the social image and favicon. Give each route a translated `title` and `alternates`, and replace the icon and social image with brand assets. The sitemap lists every page in every language with hreflang links. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin. Put unit tests next to the code as `*.test.ts` (Vitest). Run lint, `npm run lint:i18n`, typecheck, tests, and build before finishing.

## Languages

The site speaks %%LANGUAGES%% through **next-intl**; `%%DEFAULT_LOCALE%%` is the default. Every URL carries its language (`/%%DEFAULT_LOCALE%%/about`); browser-language detection and the locale cookie are off, and `/` redirects to `/%%DEFAULT_LOCALE%%`. `src/i18n/routing.ts` defines the locales and exports `Link`, `useRouter`, `usePathname`, `isRtlLocale`, and `languageName`; `src/i18n/request.ts` loads `messages/{locale}.json`; `src/proxy.ts` adds the locale prefix.

- Add every key in the same place in every messages file. Messages use ICU syntax (`{name}`, plurals); escape literal braces and angle brackets.
- Server components use `useTranslations("home")` (or `await getTranslations(...)`). Every page and layout under `[locale]` calls `setRequestLocale(locale)` first so it renders statically.
- Import `Link` from `@/i18n/routing`, never from `next/link`, so the locale prefix stays in the URL. `components/ui/button.tsx` already does.
- `<html dir>` follows the language. Use logical utilities (`ms-*`, `ps-*`, `start-*`, `border-s`, `text-start`) and the `rtl:` variant instead of left/right ones.
- `components/layout/language-switcher.tsx` renders plain links to the current page in the other languages.
- To add a language: add its code to `locales` in `src/i18n/routing.ts`, copy `messages/%%DEFAULT_LOCALE%%.json` to `messages/<code>.json`, and translate every value.
- `npm run lint:i18n` (also run before every build) fails on invalid JSON, a key defined twice, or a key missing from any language. `npm run typecheck` fails on a `t("key")` that does not exist.
<!-- @i18n-end -->
<!-- @themes-start -->

## Themes

Themes: %%THEME_NAMES%%, plus "system", the default, which follows the OS light/dark setting. No theme library is used.

- `<html data-theme="…">` selects the token values in `src/app/globals.css`: light in `:root`, the others in `[data-theme="<name>"]` blocks. An inline script from `src/lib/theme.ts`, rendered in the root layout's `<head>`, sets it before the first paint from the saved choice (`localStorage["theme"]`) or the system setting; the root `<html>` keeps `suppressHydrationWarning` for that reason.
- Give every new color token a value in each theme block. Components use the token utilities (`bg-background`, `text-muted`) and never branch on the theme; the `dark:` variant follows the chosen theme and is for one-off exceptions.
- `useTheme()` from `src/hooks/use-theme.ts` returns `theme` (what is showing, `undefined` until hydration), `preference` (including `"system"`), and `setTheme()`. `components/layout/theme-toggle.tsx` in the header lists System and every theme.
<!-- @i18n-start -->
- To add a theme: add its name to `themes` in `src/lib/theme.ts`, a `[data-theme="<name>"]` block to `globals.css`, and a `theme.<name>` label to every messages file.
<!-- @i18n-end -->
<!-- @no-i18n-start -->
- To add a theme: add its name to `themes` in `src/lib/theme.ts`, a `[data-theme="<name>"]` block to `globals.css`, and its label in `theme-toggle.tsx`.
<!-- @no-i18n-end -->
<!-- @themes-end -->
