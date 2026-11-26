# %%APP_NAME%%

%%APP_DESCRIPTION%%

## Getting started

```bash
cp .env.example .env.local   # then set NEXT_PUBLIC_API_BASE_URL
npm install
npm run dev
```

Open http://localhost:3000. The component gallery is at http://localhost:3000/design-system (development only).

Architecture rules and conventions live in [AGENTS.md](./AGENTS.md) for Codex and [CLAUDE.md](./CLAUDE.md) for Claude Code.
<!-- @i18n-start -->

## Languages

%%LANGUAGES%%, served by next-intl under `/<language>/…` (`/` redirects to `/%%DEFAULT_LOCALE%%`). UI text lives in `messages/<language>.json`; keep the same keys in every file and check with `npm run lint:i18n`. See the Languages section in CLAUDE.md.
<!-- @i18n-end -->
