# nextjs-starter-skill

A skill for Claude Code and Codex that scaffolds Next.js apps with a fixed stack and architecture, and keeps agents following that architecture when they add features later. It is also packaged as a Claude Code plugin.

## What you get

**Stack:** Next.js 16 App Router · React 19 + React Compiler · TypeScript strict · Tailwind CSS v4 design tokens · Base UI · cva + cn · Axios · TanStack Query v5 · Zod · TanStack Table · Recharts · Vitest + Testing Library · ESLint + Prettier

**Architecture:**

- Thin routes in `src/app`; business domains in `src/features/<name>/{api,hooks,schemas,components}`.
- Data flow: `api.ts` (Axios + Zod) → `hooks.ts` (query-key factory + React Query) → `components/` → `page.tsx`.
- Shared components layered as `ui → molecules → organisms`; they take props and never fetch.
- Styling only through design-token utilities defined in `src/styles/tokens.css` and `theme.css`.
- A dev-only `/design-system` gallery with a demo for every shared component.
- Matching `AGENTS.md` and `CLAUDE.md` files in every generated project, so Codex and Claude Code follow the same architecture rules in later sessions.
- An optional example `posts` feature that shows the full data flow end to end.

## Install (Claude Code)

```
/plugin marketplace add hebaayman1/nextjs-starter-skill
/plugin install nextjs-starter@nextjs-starter-skill
```

Then ask Claude something like *"Create a new Next.js app called sales-portal"*. Claude asks for anything missing (display name, API URL, whether to keep the example feature), runs the generator, and checks that the project lints, type-checks, tests and builds.

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

Start a new Codex session and ask it to use `$nextjs-starter` to create a Next.js app. The generated `AGENTS.md` gives Codex the architecture rules for later work. To update the installed skill, replace the copied `nextjs-starter` directory with the latest version from this repository.

## Use the generator directly

Requires Node.js 20.9+ and npm.

```bash
node plugins/nextjs-starter/skills/nextjs-starter/scripts/scaffold.mjs my-app --name "My App"
```

| Option | Default | Description |
| --- | --- | --- |
| `<target-dir>` | required | Folder to create. Must not exist or must be empty. |
| `--name "<text>"` | folder name in Title Case | Display name of the app. |
| `--description "<text>"` | `<name> web app` | Description used in the README and metadata. |
| `--api-url <url>` | `https://jsonplaceholder.typicode.com` | Written to `.env.local` as `NEXT_PUBLIC_API_BASE_URL`. |
| `--no-example` | | Leave out the example `posts` feature. |
| `--no-install` | | Skip `npm install`. |
| `--no-git` | | Skip `git init` and the initial commit. |

Then:

```bash
cd my-app
npm run dev
```

Open http://localhost:3000. The component gallery is at http://localhost:3000/design-system (development only).

### Scripts in a generated project

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier |
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
    assets/template/                       # files copied into every new project
```

## Contributing to the template

1. Edit files under `plugins/nextjs-starter/skills/nextjs-starter/assets/template/`, not a generated project.
2. Bump `version` in `plugins/nextjs-starter/.claude-plugin/plugin.json`.
3. Generate a throwaway project and check that it passes:

   ```bash
   node plugins/nextjs-starter/skills/nextjs-starter/scripts/scaffold.mjs /tmp/check-app --no-git
   cd /tmp/check-app
   npm run lint && npm run typecheck && npm test && npm run build
   ```
