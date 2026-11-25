# %%APP_NAME%%: architecture rules

Read this before writing code in this project. These rules are what keep every project built from this starter consistent.

## Stack

Next.js 16 App Router, React 19 with React Compiler, TypeScript strict, Tailwind CSS v4 driven by design tokens, Base UI primitives, class-variance-authority + `cn`, Axios, TanStack Query v5, Zod, TanStack Table, Recharts, Vitest + Testing Library. Package manager: npm.

## Where code goes

```text
src/
├── app/                      # Routing ONLY: pages, layouts, loading/error/not-found
│   ├── layout.tsx            # <html>, fonts, metadata, <Providers>
│   ├── providers.tsx         # Client providers (React Query + devtools)
│   ├── (app)/                # Route group wrapped in <AppShell>; not in the URL
│   └── design-system/        # Dev-only component gallery (404 in production)
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
│   └── app-shell/            # Nav rail, top bar, mobile drawer, navigation.ts
├── hooks/                    # Shared, feature-agnostic hooks
├── lib/
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

## Adding a feature (recipe)

1. `src/features/<name>/schemas.ts`: Zod schemas + `z.infer` types.
2. `api.ts`: `request<unknown>(...)` then `schema.parse(data)`.
3. `hooks.ts`: key factory, `queryOptions`, `useX` / `useCreateX` hooks.
4. `components/<name>-view.tsx`: `"use client"`, uses the hooks, renders loading/error/empty/data.
5. `index.ts`: export the view, hooks, and types.
6. `src/app/(app)/<route>/page.tsx`: thin page rendering the view.
7. Add the route to `src/components/app-shell/navigation.ts`.
8. Tests next to the code: `*.test.ts(x)`.

`src/features/posts` is a complete working example of this recipe (if it was kept at scaffold time).

## Commands

```bash
npm run dev          # dev server; gallery at /design-system
npm run build        # production build
npm run lint         # ESLint (Next + TypeScript + Prettier compat)
npm run typecheck    # tsc --noEmit
npm run format       # Prettier with Tailwind class sorting
npm test             # Vitest
```

Before finishing any task: `npm run lint && npm run typecheck && npm test && npm run build`.
