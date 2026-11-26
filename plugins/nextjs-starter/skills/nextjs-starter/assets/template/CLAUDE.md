# %%APP_NAME%%: architecture rules

Read this before writing code in this project. These rules are what keep every project built from this starter consistent.

## Stack

Next.js 16 App Router, React 19 with React Compiler, TypeScript strict, Tailwind CSS v4 driven by design tokens, Base UI primitives, class-variance-authority + `cn`, Axios, TanStack Query v5, Zod, TanStack Table, Recharts, Vitest + Testing Library. Package manager: npm.
<!-- @i18n-start -->

Languages: %%LANGUAGES%% via next-intl; `%%DEFAULT_LOCALE%%` is the default. See [Languages](#languages).
<!-- @i18n-end -->
<!-- @themes-start -->

Themes: %%THEME_NAMES%%, plus "system" (the default). See [Themes](#themes).
<!-- @themes-end -->

## Where code goes

```text
<!-- @i18n-start -->
messages/<language>.json      # UI text per language: same keys, same layout in every file
scripts/check-i18n.mjs        # `npm run lint:i18n`, also runs before every build
src/
├── proxy.ts                  # next-intl proxy: adds the locale prefix to every URL
├── global.d.ts               # Types t("key") against messages/%%DEFAULT_LOCALE%%.json
├── i18n/
│   ├── routing.ts            # Locales, default locale, isRtlLocale, Link/useRouter/usePathname
│   └── request.ts            # Loads messages/{locale}.json for each request
├── app/                      # Routing ONLY: pages, layouts, loading/error/not-found
│   ├── layout.tsx            # Pass-through; the real root layout is [locale]/layout.tsx
│   ├── providers.tsx         # Client providers (React Query + devtools)
│   └── [locale]/             # Every page sits under the locale segment
│       ├── layout.tsx        # <html lang dir>, fonts, metadata, NextIntlClientProvider, <Providers>
│       ├── (app)/            # Route group wrapped in <AppShell>; not in the URL
│       └── design-system/    # Dev-only component gallery (404 in production)
<!-- @i18n-end -->
<!-- @no-i18n-start -->
src/
├── app/                      # Routing ONLY: pages, layouts, loading/error/not-found
│   ├── layout.tsx            # <html>, fonts, metadata, <Providers>
│   ├── providers.tsx         # Client providers (React Query + devtools)
│   ├── (app)/                # Route group wrapped in <AppShell>; not in the URL
│   └── design-system/        # Dev-only component gallery (404 in production)
<!-- @no-i18n-end -->
├── features/<feature>/       # Everything for one business domain
│   ├── api.ts                # HTTP calls via request() + Zod parsing; no React
│   ├── hooks.ts              # Query-key factory, queryOptions, useQuery/useMutation hooks
│   ├── schemas.ts            # Zod schemas + inferred types
│   ├── components/           # Feature views (may fetch through the hooks)
│   └── index.ts              # Public API; import "@/features/x", never inner files
├── components/
│   ├── ui/                   # Single controls (button, select, tooltip…)
│   ├── molecules/            # Small compositions (stat tile, filter chip…)
│   ├── organisms/            # Whole sections (data table, filter panel, chart frame…)
│   ├── icons/                # Icon components
<!-- @i18n-start -->
│   └── app-shell/            # Nav rail, top bar, mobile drawer, navigation.ts, language-toggle.tsx
├── hooks/                    # Shared, feature-agnostic hooks (use-language.ts)
<!-- @i18n-end -->
<!-- @no-i18n-start -->
│   └── app-shell/            # Nav rail, top bar, mobile drawer, navigation.ts
├── hooks/                    # Shared, feature-agnostic hooks
<!-- @no-i18n-end -->
<!-- @themes-start -->
│   └── use-theme.ts          # useTheme(): chosen theme, showing theme, setTheme()
<!-- @themes-end -->
├── lib/
<!-- @i18n-start -->
│   ├── localized-name.ts     # Picks nameAr / nameEn… from API data
<!-- @i18n-end -->
<!-- @themes-start -->
│   ├── theme.ts              # Theme list + the inline script that applies it before paint
<!-- @themes-end -->
│   ├── api/client.ts         # The axios instance + ApiError. The ONLY HTTP entry point
│   ├── query-client.ts       # QueryClient defaults (staleTime, retry rules)
│   ├── utils.ts              # cn(), configured with the custom Tailwind scales
│   ├── variants.ts           # Shared focus/disabled/motion/surface class recipes
│   └── format.ts             # Number, currency, percent, date formatting
└── styles/
    ├── tokens.css            # Design tokens (primitives -> semantic)
    └── theme.css             # Tokens -> Tailwind utilities
```

## Rules

1. **Routes stay thin.** A `page.tsx` handles URL params and metadata, then renders one feature view. No fetching logic, no business logic in `src/app`.
2. **Data flows one way:** `features/x/api.ts` → `features/x/hooks.ts` (React Query) → `features/x/components/*` → `app/.../page.tsx`.
3. **Never call axios or fetch from components or hooks.** Add a function to the feature's `api.ts` that uses `request()` from `@/lib/api/client` and validates the response with Zod.
4. **Server state lives in React Query, not `useState`.** Every query key comes from the feature's key factory (`xKeys.all`, `xKeys.list(...)`). Mutations invalidate the matching keys.
5. **Shared components never fetch.** `ui/`, `molecules/`, `organisms/` take props only. Pick the layer by size: one control → `ui`, small composition → `molecules`, whole section → `organisms`.
6. **Style only with tokens.** Use `bg-bg-*`, `text-content-*`, `border-border-*`, spacing `3xs…2xl`, `rounded-sm/md/lg` (single-letter radius names collide with Tailwind corner-side utilities), `text-caption/body/title/heading/display`, `shadow-s/m`. No hex colors, no default Tailwind palette (it is removed).
7. **Variants with `cva`, merging with `cn`.** Put variant recipes in a separate server-safe file when server components need them (see `button-variants.ts`). If you add a scale to `theme.css`, add it to `lib/utils.ts` too.
8. **Interactive controls build on Base UI** (`@base-ui/react`) for accessibility: dialogs, menus, selects, tooltips, popovers.
9. **Every component handles its states:** loading, empty, error, disabled, focus-visible, keyboard, and reduced motion.
10. **Document every shared component** in the gallery: add `src/app/design-system/_demos/<name>.tsx`, then register it in `_lib/registry.ts`.
11. **`"use client"` as low as possible.** Only the smallest component that needs state, effects, or browser APIs.
12. **Client components only use `NEXT_PUBLIC_*` env vars.** Document every variable in `.env.example`.
<!-- @i18n-start -->
13. **No hard-coded UI text.** Every visible string, aria-label, and page title comes from `messages/{locale}.json` (see [Languages](#languages)).
<!-- @i18n-end -->

## Adding a feature (recipe)

1. `src/features/<name>/schemas.ts`: Zod schemas + `z.infer` types.
2. `api.ts`: `request<unknown>(...)` then `schema.parse(data)`.
3. `hooks.ts`: key factory, `queryOptions`, `useX` / `useCreateX` hooks.
4. `components/<name>-view.tsx`: `"use client"`, uses the hooks, renders loading/error/empty/data.
5. `index.ts`: export the view, hooks, and types.
<!-- @i18n-start -->
6. `src/app/[locale]/(app)/<route>/page.tsx`: thin page that calls `setRequestLocale`, sets a translated title in `generateMetadata`, and renders the view.
7. Add the route to `src/components/app-shell/navigation.ts` and its `labelKey` to the `navigation` namespace.
8. Add the feature's namespace to every `messages/*.json` file.
9. Tests next to the code: `*.test.ts(x)`.
<!-- @i18n-end -->
<!-- @no-i18n-start -->
6. `src/app/(app)/<route>/page.tsx`: thin page rendering the view.
7. Add the route to `src/components/app-shell/navigation.ts`.
8. Tests next to the code: `*.test.ts(x)`.
<!-- @no-i18n-end -->

`src/features/posts` is a complete working example of this recipe (if it was kept at scaffold time).
<!-- @i18n-start -->

## Languages

The app speaks %%LANGUAGES%% through **next-intl**; nothing else is used for UI text. Every URL carries its language (`/%%DEFAULT_LOCALE%%/posts`). Browser-language detection and the locale cookie are off, so the URL alone decides the language, and `/` redirects to `/%%DEFAULT_LOCALE%%`.

- **Text:** add a key in the same place in every `messages/*.json` file, then use it. Group keys by namespace: one per feature, plus shared ones such as `errors`. Messages use ICU syntax: `{name}` for values, `{count, plural, one {# item} other {# items}}` for plurals; escape literal braces and angle brackets.
- **Server components:** `const t = useTranslations("posts")` (or `await getTranslations(...)` in async code). Every page and layout under `[locale]` calls `setRequestLocale(locale)` first so it can render statically; `generateMetadata` uses `getTranslations({ locale, namespace })`.
- **Client components:** `const { t, locale, isRTL } = useLanguage("posts")` from `@/hooks/use-language`, or `useTranslations` directly.
- **Links and navigation:** import `Link`, `useRouter`, `usePathname`, `redirect` from `@/i18n/routing`, never from `next/link` or `next/navigation`, so the locale prefix stays in the URL. Its `usePathname()` returns the path without the locale.
- **Right-to-left:** `[locale]/layout.tsx` sets `<html dir>` from `isRtlLocale`. Use logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `border-s/e`, `text-start/end`) and the `rtl:` variant instead of left/right ones. Use `isRTL` only for what CSS cannot flip, like directional icons or chart axes.
- **Numbers and dates:** pass the current `locale` to the helpers in `lib/format.ts`.
- **Backend text** (role, department, or category names) is stored per language as `nameAr`, `nameEn`…, not in messages. Show it with `localizedName(entity, locale)` or `localizedField(entity, "title", locale)` from `@/lib/localized-name`; they fall back to another language when one is empty.
- **Switching language:** `components/app-shell/language-toggle.tsx` replaces the locale in the URL and keeps the path and query.
- **Adding a language:** add its code to `locales` in `src/i18n/routing.ts`, copy `messages/%%DEFAULT_LOCALE%%.json` to `messages/<code>.json`, and translate every value. Right-to-left languages already get `dir="rtl"`; Arabic-script languages need the Arabic font in `app/fonts.ts`.
- **Checks:** `npm run lint:i18n` fails on invalid JSON, a key defined twice, or a key missing from any language. It runs before every build. `npm run typecheck` fails on a `t("key")` that does not exist.
<!-- @i18n-end -->
<!-- @themes-start -->

## Themes

Themes: %%THEME_NAMES%%, plus "system", the default, which follows the OS light/dark setting. No theme library is used.

- **How it works:** `<html data-theme="…">` selects the token values. An inline script from `lib/theme.ts`, rendered in the root layout's `<head>`, sets it before the first paint from the saved choice (`localStorage["theme"]`) or the system setting, so pages never flash. The root `<html>` has `suppressHydrationWarning` for that reason; keep both.
- **Colors:** every theme is a block of semantic tokens in `src/styles/tokens.css`: light in `:root`, the others in `[data-theme="<name>"]`. When you add a semantic token, give it a value in every theme block that needs one. Components keep using the same utilities (`bg-bg-primary`, `text-content-secondary`) and never branch on the theme.
- **`dark:` variant:** follows the chosen theme, not only the OS. Use it only for one-off exceptions; prefer tokens.
- **In code:** `const { theme, preference, setTheme } = useTheme()` from `@/hooks/use-theme`. `theme` is what is showing (`undefined` on the server and during hydration); use it for things CSS cannot reach, such as chart colors or images. `preference` includes `"system"`.
- **Switching:** `components/app-shell/theme-toggle.tsx` in the top bar lists System and every theme.
<!-- @i18n-start -->
- **Adding a theme:** add its name to `themes` in `src/lib/theme.ts`, a `[data-theme="<name>"]` block to `tokens.css`, and a `theme.<name>` label to every messages file.
<!-- @i18n-end -->
<!-- @no-i18n-start -->
- **Adding a theme:** add its name to `themes` in `src/lib/theme.ts`, a `[data-theme="<name>"]` block to `tokens.css`, and its label in `theme-toggle.tsx`.
<!-- @no-i18n-end -->
<!-- @themes-end -->

## Commands

```bash
npm run dev          # dev server; gallery at /design-system
npm run build        # production build
npm run lint         # ESLint (Next + TypeScript + Prettier compat)
<!-- @i18n-start -->
npm run lint:i18n    # messages files: valid JSON, no duplicate keys, same keys in every language
<!-- @i18n-end -->
npm run typecheck    # tsc --noEmit
npm run format       # Prettier with Tailwind class sorting
npm test             # Vitest
```

<!-- @i18n-start -->
Before finishing any task: `npm run lint && npm run lint:i18n && npm run typecheck && npm test && npm run build`.
<!-- @i18n-end -->
<!-- @no-i18n-start -->
Before finishing any task: `npm run lint && npm run typecheck && npm test && npm run build`.
<!-- @no-i18n-end -->
