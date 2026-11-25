# %%APP_NAME%%: website architecture

This is a static-content Next.js marketing website. Keep route files in `src/app` thin; put each page's sections and content in `src/components/pages/<name>-page/`. Share genuine building blocks through `src/components/ui/`, site chrome through `src/components/layout/`, and icons through `src/components/icons/`. Export public components from `src/components/index.ts` and import them from `@/components`.

Use `src/app/globals.css` as the source of light and dark design tokens. Map tokens into Tailwind with `@theme inline`. Load supplied brand fonts once in the root layout; put licensed files in `public/assets/fonts/`. Group images by page or section under `public/assets/images/` and use `next/image` with meaningful alt text and known dimensions.

Keep static copy in `*-data.ts` next to the page sections. Put external blog, careers, or form integrations in `src/services/` only when the site needs them. Prefer native `fetch` for reading server data; add Axios only if the chosen form integration needs it. Keep server secrets out of client components. Add loading, empty, and error states for external content.

Start with semantic HTML and accessible keyboard interactions. Add GSAP, Three.js, Embla, or HTML sanitizing only when the requested design or service requires them. Respect reduced motion. Use `isomorphic-dompurify` before rendering external HTML.

Maintain route metadata, `robots.ts`, `sitemap.ts`, and `llms.txt` as pages are added. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin. Run lint, typecheck, tests, and build before finishing.
