---
name: nextjs-starter
description: Scaffold a production-ready Next.js 16 frontend with a fixed stack and architecture (TypeScript strict, Tailwind v4 design tokens, Axios client, TanStack React Query, Zod, Base UI, cva + cn, Vitest) and keep new code following that architecture afterwards. Use this skill whenever the user wants to create, start, bootstrap, scaffold, or set up a new Next.js, React, or frontend web app/project/dashboard/portal, even if they only mention one of the libraries (e.g. "new next app with react query") or don't name a stack at all. Also use it when adding a feature, page, API call, or shared component to a project that was generated from this starter (it has the CLAUDE.md "architecture rules" and a src/features folder).
---

# Next.js starter

Generates a project with a known-good stack and a layered architecture, then makes sure later work keeps to it. The template is in `assets/template/`, the generator is `scripts/scaffold.mjs`, and the architecture rules are in `assets/template/CLAUDE.md`. The generator writes matching `CLAUDE.md` and `AGENTS.md` files into every project for Claude Code and Codex.

## Creating a new project

1. **Collect inputs.** Use what the user already said; only ask for what's missing, in one short question:
   - project folder name (required)
   - display name (defaults to the folder name in Title Case)
   - API base URL (defaults to a public demo API)
   - keep the example `posts` feature? (default: yes; it shows the full data flow and is easy to delete)
2. **Check prerequisites:** Node.js 20.9+ and npm (`node -v`). If Node is missing or too old, stop and tell the user to install it from nodejs.org.
3. **Run the generator** from the directory where the project should live:
   ```bash
   node <skill-dir>/scripts/scaffold.mjs <folder> --name "<Display Name>" --api-url <url> [--no-example] [--no-install] [--no-git]
   ```
   `<skill-dir>` is the directory containing this SKILL.md. The script copies the template, fills in names, writes `.env.local`, runs `npm install`, and makes an initial git commit. It refuses to overwrite a non-empty folder; ask the user before choosing another name.
4. **Verify** inside the new folder: `npm run lint && npm run typecheck && npm test && npm run build`. Fix anything that fails before reporting success.
5. **Report briefly:** where the project is, `npm run dev`, the `/design-system` gallery, and that `AGENTS.md` and `CLAUDE.md` hold the same rules. Do not paste the whole file tree.

Do not hand-write the project file by file or use `create-next-app`; the generator is the source of truth, so every project comes out identical.

## Working inside a generated project

Before adding a feature, page, API call, or component, follow the project's architecture rules in `AGENTS.md` (Codex) or `CLAUDE.md` (Claude Code). The essentials:

- Data flow: `features/x/api.ts` (axios via `request()` + Zod) → `hooks.ts` (key factory + React Query) → `components/` (view) → thin `app/(app)/route/page.tsx`.
- Shared components (`ui` → `molecules` → `organisms`) take props and never fetch; each new one gets a gallery demo + registry entry.
- Style only with token utilities (`bg-bg-*`, `text-content-*`, spacing `3xs…2xl`, `rounded-sm/md/lg`). Keep `lib/utils.ts` in sync with `styles/theme.css`.
- Copy the structure of `src/features/posts` when it exists.
- Finish with lint, typecheck, test, build.

## Customizing the starter itself

If the user wants to change what every future project gets (new library, different tokens, extra components), edit files under `assets/template/`, not a generated project. Bump `version` in the plugin's `plugin.json`, then generate a throwaway project with `--no-git` and run the verify step to prove the template still builds.
