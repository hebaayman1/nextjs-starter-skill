# %%APP_NAME%%

%%APP_DESCRIPTION%%

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

The homepage and About page are examples. Replace their copy and sections with the real site content, and keep the page list in `src/config/site.ts` in sync. Set `NEXT_PUBLIC_SITE_URL` to the production origin before launch. Agent architecture rules are in `AGENTS.md` and `CLAUDE.md`.

Check the site with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
