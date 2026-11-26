# nextjs-starter-skill

A skill for Claude Code and Codex with two Next.js 16 starter options: **application** and **website**. It is also packaged as a Claude Code plugin.

## What you get

**Shared stack:** Next.js 16 App Router · React 19 + React Compiler · TypeScript strict · Tailwind CSS v4 design tokens.

| Option | Use for | Structure and libraries |
| --- | --- | --- |
| `application` (default) | Dashboards, portals, product apps | Feature folders, thin routes, Base UI, cva + cn, Axios, TanStack Query, Zod, TanStack Table, Recharts, Vitest, component gallery. |
| `website` | Marketing, company, portfolio, editorial sites | Page sections under `components/pages`, shared layout and UI, SEO routes, static content, optional external services. |

**Application architecture:**

- Thin routes in `src/app`; business domains in `src/features/<name>/{api,hooks,schemas,components}`.
- Data flow: `api.ts` (Axios + Zod) → `hooks.ts` (query-key factory + React Query) → `components/` → `page.tsx`.
- Shared components layered as `ui → molecules → organisms`; they take props and never fetch.
- Styling only through design-token utilities defined in `src/styles/tokens.css` and `theme.css`.
- A dev-only `/design-system` gallery with a demo for every shared component.
- Matching `AGENTS.md` and `CLAUDE.md` files in every generated project, so Codex and Claude Code follow the same architecture rules in later sessions.
- An optional example `posts` feature that shows the full data flow end to end.

**Website architecture:**

- Thin routes in `src/app`; page sections and static copy in `src/components/pages/<name>-page/`.
- Shared layout, UI, and icons in `src/components/`, exported through its barrel.
- One `src/config/site.ts` for the site name, description, and page list; header, metadata, sitemap, and `llms.txt` read from it.
- Light and dark design tokens in `src/app/globals.css`; asset folders for local fonts and page images.
- SEO from day one: `metadataBase`, Open Graph and Twitter defaults, a generated social image, favicon, `robots.ts`, `sitemap.ts`, and `llms.txt`; external CMS, careers, and forms live in `src/services/` when needed.
- Optional GSAP, Three.js, Embla, Axios, and HTML sanitizing only after the user confirms the needed libraries.

**Multiple languages (optional, both options):**

Pass `--languages` (the skill asks, offering Arabic and English by default and letting you add any other language). The project then uses [next-intl](https://next-intl.dev):

- Every URL carries its language (`/ar/...`, `/en/...`); the first language is the default and `/` redirects to it. Browser detection and the locale cookie are off, so the URL alone decides the language.
- `messages/<code>.json` holds all UI text, with the same keys in every language. Arabic and English come translated; other languages start as English copies to translate.
- `src/i18n/routing.ts` (locales, `Link`/`useRouter`/`usePathname`, RTL helpers), `src/i18n/request.ts`, `src/proxy.ts`, and every route under `src/app/[locale]/`, with `<html lang dir>` so right-to-left languages flip.
- `npm run lint:i18n` (also run before every build) fails on duplicate keys or keys missing from a language, and `t("key")` is type-checked.
- Applications add a `useLanguage()` hook, a `localizedName()` helper for `nameAr`/`nameEn` API fields, a language toggle in the top bar, and the Noto Sans Arabic font for Arabic-script languages. Websites add a link-based language switcher and per-language metadata, hreflang alternates, sitemap, and `llms.txt`.

**Multiple themes (optional, both options):**

Pass `--themes` (the skill asks, offering light and dark by default and letting you add named themes such as `high-contrast`). No theme library is added:

- `<html data-theme="…">` selects a block of color tokens: light in `:root`, every other theme in `[data-theme="<name>"]` (application: `src/styles/tokens.css`; website: `src/app/globals.css`). Extra themes start as an empty block to fill in.
- Visitors start on "system", which follows the OS light/dark setting. Their choice is saved in `localStorage`, and an inline script in `<head>` applies it before the first paint, so there is no flash.
- `src/lib/theme.ts` (theme list and script), `src/hooks/use-theme.ts` (`useTheme()` for chart colors and similar), and a theme picker in the top bar or header. The `dark:` variant follows the chosen theme.
- Works with `--languages`: the picker labels go into the messages files.

## Install (Claude Code)

```
/plugin marketplace add hebaayman1/nextjs-starter-skill
/plugin install nextjs-starter@nextjs-starter-skill
```

Then ask Claude for an application or website. For websites, the skill asks which optional libraries and external services you need before scaffolding.

The skill also activates when you add a feature, page, API call or component inside a generated project.

Get updates later with `/plugin marketplace update`.

## Install (Codex)

Clone this repository, then copy the skill directory into your user skills folder. Run one of these from the repository root:

```bash
mkdir -p ~/.agents/skills
cp -R plugins/nextjs-starter/skills/nextjs-starter ~/.agents/skills/
```

PowerShell:

```powershell
New-Item -ItemType Directory -Force "$HOME\.agents\skills" | Out-Null
Copy-Item plugins/nextjs-starter/skills/nextjs-starter -Destination "$HOME\.agents\skills" -Recurse
```

Start a new Codex session and ask it to use `$nextjs-starter` to create an application or website. For websites, Codex asks which optional libraries you want before scaffolding. The generated `AGENTS.md` gives Codex the architecture rules for later work. To update the installed skill, replace the copied `nextjs-starter` directory with the latest version from this repository.

## Use the generator directly

Requires Node.js 20.9+ and npm.

```bash
node plugins/nextjs-starter/skills/nextjs-starter/scripts/scaffold.mjs my-app --type application --name "My App"
node plugins/nextjs-starter/skills/nextjs-starter/scripts/scaffold.mjs my-site --type website --name "My Site" --site-url https://example.com --libraries gsap,embla-carousel-react
node plugins/nextjs-starter/skills/nextjs-starter/scripts/scaffold.mjs my-portal --name "My Portal" --languages ar,en,fr --themes light,dark
```

| Option | Default | Description |
| --- | --- | --- |
| `<target-dir>` | required | Folder to create. Must not exist or must be empty. |
| `--type application\|website` | `application` | Choose a product app or marketing website. |
| `--name "<text>"` | folder name in Title Case | Display name of the app. |
| `--description "<text>"` | `<name> web app` | Description used in the README and metadata. |
| `--api-url <url>` | `https://jsonplaceholder.typicode.com` | Application only; must be an http(s) URL. Written to `.env.local` as `NEXT_PUBLIC_API_BASE_URL`. |
| `--site-url <url>` | `https://example.com` | Website only; must be an http(s) URL. Written to `.env.local` as `NEXT_PUBLIC_SITE_URL` for metadata, sitemap, and robots. Set the real origin before launch. |
| `--libraries <list>` | none | Website only; comma-separated: `gsap`, `three`, `embla-carousel-react`, `axios`, `isomorphic-dompurify`. |
| `--themes <list>` | none (single theme) | Both options; comma-separated theme names that include `light` and `dark`, for example `light,dark` or `light,dark,high-contrast`. Adds a theme picker; visitors start on the system setting. |
| `--languages <list>` | none (single language) | Both options; two or more comma-separated language codes such as `ar,en` or `ar,en,fr,pt-BR`. The first one is the default. Sets up next-intl routing and messages. |
| `--no-example` | | Application only; leave out the example `posts` feature. |
| `--no-install` | | Skip `npm install`. |
| `--no-git` | | Skip `git init` and the initial commit. |

Then:

```bash
cd my-app
npm run dev
```

Open http://localhost:3000. The application component gallery is at http://localhost:3000/design-system (development only).

### Scripts in a generated project

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier (application only) |
| `npm run lint:i18n` | Multilingual only: same keys in every `messages/*.json`, no duplicates (also runs before `build`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` / `test:watch` | Vitest |

## Repository layout

```
.claude-plugin/marketplace.json            # marketplace manifest
plugins/nextjs-starter/
  .claude-plugin/plugin.json               # plugin manifest (version lives here)
  skills/nextjs-starter/
    SKILL.md                               # instructions for Claude Code and Codex
    scripts/scaffold.mjs                   # the generator
    assets/template/                       # application template
    assets/website-template/               # website template
    assets/i18n/                           # multilingual overlay (shared/, application/, website/)
    assets/themes/                         # multi-theme overlay (shared/, application/, website/)
```

## Contributing to the template

1. Edit the relevant template under `plugins/nextjs-starter/skills/nextjs-starter/assets/`, not a generated project.
2. Bump `version` in `plugins/nextjs-starter/.claude-plugin/plugin.json`.
3. Generate a throwaway project and check that it passes:

   ```bash
   node --test tests/scaffold.test.mjs
   node plugins/nextjs-starter/skills/nextjs-starter/scripts/scaffold.mjs /tmp/check-site --type website --no-git
   cd /tmp/check-site && npm run lint && npm run typecheck && npm test && npm run build
   # repeat with --languages ar,en and --themes light,dark for both options when touching assets/i18n/ or assets/themes/
   ```
