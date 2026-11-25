# nextjs-starter-skill

A Claude Code plugin + skill that scaffolds Next.js apps with a fixed stack and architecture.

## nextjs-starter

Creates a Next.js 16 app with a fixed stack and architecture, and keeps Claude following that architecture when it adds features later.

**Stack:** Next.js 16 App Router · React 19 + React Compiler · TypeScript strict · Tailwind CSS v4 design tokens · Base UI · cva + cn · Axios · TanStack Query v5 · Zod · TanStack Table · Recharts · Vitest + Testing Library

**Architecture:** thin routes in `src/app`, business domains in `src/features/<name>/{api,hooks,schemas,components}`, shared components layered as `ui → molecules → organisms`, a dev-only `/design-system` gallery, and a `CLAUDE.md` with the rules in every generated project.

### Install (Claude Code)

```
/plugin marketplace add hebaayman1/nextjs-starter-skill
/plugin install nextjs-starter@nextjs-starter-skill
```

Then ask Claude: *"Create a new Next.js app called sales-portal"*.

Get updates later with `/plugin marketplace update`.

### Use without Claude

```bash
node plugins/nextjs-starter/skills/nextjs-starter/scripts/scaffold.mjs my-app --name "My App"
```

Options: `--api-url <url>`, `--description "<text>"`, `--no-example`, `--no-install`, `--no-git`. Requires Node.js 20.9+.

### Contributing to the template

Edit `plugins/nextjs-starter/skills/nextjs-starter/assets/template/`, bump the version in `plugins/nextjs-starter/.claude-plugin/plugin.json`, and check that a fresh project passes `npm run lint && npm run typecheck && npm test && npm run build`.
