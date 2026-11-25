---
name: nextjs-starter
description: Scaffold a production-ready Next.js 16 project in one of two profiles and keep new code following its architecture afterwards. The application profile is a feature-driven product app (TypeScript strict, Tailwind v4 design tokens, Axios, TanStack React Query, Zod, Base UI, cva + cn, Vitest); the website profile is a static-content marketing site (page sections, shared layout, SEO routes, optional GSAP/Three.js/Embla). Use this skill whenever the user wants to create, start, bootstrap, scaffold, or set up a new Next.js, React, or frontend web app, project, dashboard, portal, website, landing page, marketing site, company site, or portfolio, even if they only mention one of the libraries (e.g. "new next app with react query") or don't name a stack at all. Also use it when adding a feature, page, section, API call, or shared component to a project generated from this starter (it has the CLAUDE.md/AGENTS.md architecture rules and either a src/features folder or a src/components/pages folder).
---

# Next.js starter

This skill has two profiles. **Application** is the existing feature-driven product app with React Query, Axios, Zod, Base UI, and a component gallery. **Website** is a static-content marketing site with page sections, shared layout, SEO routes, and optional external integrations. Both use Next.js 16, React 19, TypeScript strict, Tailwind v4, and React Compiler. The generator is `scripts/scaffold.mjs`.

## Choose a profile and libraries

Use **application** for dashboards, portals, and products with server state and interactive workflows. Use **website** for marketing, company, portfolio, and editorial sites. If the request does not distinguish them, ask the user which one they want.

Before generating a **website**, ask the user to confirm its libraries. Present the core stack (Next.js, React, TypeScript, Tailwind, React Compiler) and ask which optional packages the site actually needs: `gsap` for motion, `three` for 3D, `embla-carousel-react` for carousels, `axios` for form submissions, and `isomorphic-dompurify` for external HTML. Also ask about any other required libraries or external services. Do not infer optional dependencies from a reference site. Do not add `embla-carousel-auto-scroll` without a carousel that uses it. `@types/three` is added as a development dependency when Three is selected.

Collect the project folder, display name, and production site URL if known. If the domain is not known, use the placeholder URL and tell the user to set `NEXT_PUBLIC_SITE_URL` before launch. For an application, collect the API base URL and whether to keep the example posts feature.

## Create a project

1. Check Node.js 20.9+ and npm.
2. From the intended parent directory, run:

   ```bash
   node <skill-dir>/scripts/scaffold.mjs <folder> --type website --name "<Display Name>" --site-url https://example.com --libraries gsap,three
   node <skill-dir>/scripts/scaffold.mjs <folder> --type application --name "<Display Name>" --api-url https://api.example.com
   ```

   `<skill-dir>` contains this `SKILL.md`. Omit `--libraries` if none were selected. `--type application` is the default for backward compatibility. Both profiles support `--no-install` and `--no-git`; only applications support `--no-example`. The generator refuses to overwrite a nonempty folder.
3. Verify with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` in the generated project. Fix failures before reporting success.
4. Report the project path, `npm run dev`, selected libraries, and where the architecture rules live (`AGENTS.md` for Codex, `CLAUDE.md` for Claude Code). Mention `/design-system` only for applications. Do not paste the whole file tree.

Do not hand-write the project file by file or use `create-next-app`; the generator is the source of truth, so every project of a profile comes out identical.

## Extend a generated project

Identify the profile first: a `src/features` folder means an application; a `src/components/pages` folder means a website. Follow its `AGENTS.md` or `CLAUDE.md`. In applications, keep routes thin and use `features/x/api.ts` → `hooks.ts` → feature views; shared components take props and get gallery demos; style only with token utilities and keep `lib/utils.ts` in sync with `styles/theme.css`; copy the structure of `src/features/posts` when it exists. In websites, keep routes thin, put sections and static content under `components/pages/<name>-page/`, export shared components through `components/index.ts` (routes import from `@/components`; files inside `components/` import each other relatively), register every page in `config/site.ts` so the header, sitemap, and `llms.txt` pick it up, keep non-component helpers in `lib/`, and put external CMS, careers, or form integrations in `services/` when needed. Use the website's `globals.css` tokens; load licensed local fonts from `public/assets/fonts/` only when supplied. Keep metadata, sitemap, robots, and `llms.txt` current as pages change.

When customizing the starter for future projects, edit `assets/template/` for applications or `assets/website-template/` for websites. Bump the plugin version and verify both profiles.
