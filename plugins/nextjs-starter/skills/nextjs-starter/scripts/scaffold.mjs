#!/usr/bin/env node
/**
 * Scaffold a Next.js application or website.
 *
 * Usage:
 *   node scaffold.mjs <target-dir> [--name "App Name"] [--description "..."]
 *        [--type application|website] [--api-url https://api.example.com]
 *        [--site-url https://example.com] [--libraries gsap,three]
 *        [--languages ar,en,fr] [--no-example] [--no-install] [--no-git]
 */
import { execSync } from "node:child_process"
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { basename, dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const templates = {
  application: resolve(here, "../assets/template"),
  website: resolve(here, "../assets/website-template"),
}
const i18nOverlays = resolve(here, "../assets/i18n")
const i18nVersion = "^4.16.2"
// Routes that move under app/[locale]/ when the project is multilingual (the overlay adds the rest).
const i18nMoves = {
  application: [
    ["src/app/(app)", "src/app/[locale]/(app)"],
    ["src/app/design-system", "src/app/[locale]/design-system"],
  ],
  website: [],
}
const i18nRemovals = { application: ["src/hooks/.gitkeep"], website: ["src/app/page.tsx", "src/app/about"] }
const rtlLanguages = new Set(["ar", "ckb", "dv", "fa", "he", "ps", "sd", "ug", "ur", "yi"])
const arabicScriptLanguages = new Set(["ar", "ckb", "fa", "ps", "sd", "ug", "ur"])
// Message keys used only by the example posts feature.
const exampleMessageKeys = ["posts", "navigation.posts", "home.exampleFeature"]
const websiteLibraries = {
  gsap: { version: "^3.13.0" },
  three: { version: "^0.180.0", devDependencies: { "@types/three": "^0.180.0" } },
  "embla-carousel-react": { version: "^8.6.0" },
  axios: { version: "^1.21.1" },
  "isomorphic-dompurify": { version: "^2.26.0" },
}
const profileOnly = { "api-url": "application", "site-url": "website", libraries: "website" }

function fail(message) {
  console.error(`\n✖ ${message}\n`)
  process.exit(1)
}

// ---------- args ----------
const args = process.argv.slice(2)
const flags = new Set()
const options = {}
const positional = []
for (let i = 0; i < args.length; i++) {
  const arg = args[i]
  if (arg.startsWith("--no-")) flags.add(arg.slice("--no-".length))
  else if (arg.startsWith("--")) {
    const [key, inline] = arg.slice(2).split("=", 2)
    options[key] = inline ?? args[++i]
  } else positional.push(arg)
}

const target = positional[0]
if (!target) fail("Missing target directory. Example: node scaffold.mjs my-app --name \"My App\"")
const type = options.type ?? "application"
if (!Object.hasOwn(templates, type)) fail(`Unknown type "${type}". Choose application or website.`)
const templateDir = templates[type]
if (type === "website" && flags.has("example")) fail("--no-example is available only for applications.")
for (const [option, profile] of Object.entries(profileOnly)) {
  if (options[option] !== undefined && type !== profile) fail(`--${option} is available only for ${profile}s.`)
}
for (const option of ["api-url", "site-url"]) {
  if (options[option] === undefined) continue
  let url
  try {
    url = new URL(options[option])
  } catch {}
  if (!url || !["http:", "https:"].includes(url.protocol)) fail(`--${option} must be an http(s) URL (got "${options[option]}").`)
}
const selectedLibraries = options.libraries ? options.libraries.split(",").map((name) => name.trim()).filter(Boolean) : []
for (const library of selectedLibraries) {
  if (!Object.hasOwn(websiteLibraries, library)) fail(`Unknown website library "${library}".`)
}
const languages = Object.hasOwn(options, "languages") ? parseLanguages(options.languages) : []
const multilingual = languages.length > 0
const language = (locale) => new Intl.Locale(locale).language
const hasArabicScript = languages.some((locale) => arabicScriptLanguages.has(language(locale)))

/** "ar, en ,pt-br" -> ["ar", "en", "pt-BR"]. The first language is the default one. */
function parseLanguages(value) {
  if (!value || value.startsWith("--")) fail("--languages needs a comma-separated list, for example --languages ar,en.")
  const codes = value.split(",").map((code) => code.trim()).filter(Boolean)
  const canonical = codes.map((code) => {
    let locale
    try {
      ;[locale] = Intl.getCanonicalLocales(code)
    } catch {}
    // language[-Script][-REGION] only: these codes become URL segments and file names.
    if (!locale || !/^[a-z]{2,3}(-[A-Z][a-z]{3})?(-([A-Z]{2}|\d{3}))?$/.test(locale)) {
      fail(`Unknown language code "${code}". Use codes like ar, en, fr, pt-BR or zh-Hant.`)
    }
    return locale
  })
  const duplicate = canonical.find((code, index) => canonical.indexOf(code) !== index)
  if (duplicate) fail(`--languages lists "${duplicate}" twice.`)
  if (canonical.length < 2) fail("--languages needs at least two languages, for example --languages ar,en.")
  return canonical
}

const [major, minor] = process.versions.node.split(".").map(Number)
if (major < 20 || (major === 20 && minor < 9)) fail(`Node.js 20.9+ is required (found ${process.versions.node}).`)

const targetDir = resolve(process.cwd(), target)
if (existsSync(targetDir) && readdirSync(targetDir).length > 0) fail(`${targetDir} already exists and is not empty.`)

const packageName =
  basename(targetDir)
    .toLowerCase()
    .replace(/[^a-z0-9-_.]+/g, "-")
    .replace(/^[-_.]+|[-_.]+$/g, "") || "app"
const appName =
  options.name ??
  packageName
    .split(/[-_.]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ")
const replacements = {
  "%%APP_NAME%%": appName,
  "%%PACKAGE_NAME%%": packageName,
  "%%APP_DESCRIPTION%%": options.description ?? `${appName} web app`,
  "%%API_BASE_URL%%": options["api-url"] ?? "https://jsonplaceholder.typicode.com",
  "%%SITE_URL%%": options["site-url"] ?? "https://example.com",
  "%%LOCALES%%": languages.map((code) => JSON.stringify(code)).join(", "),
  "%%LANGUAGES%%": languages
    .map((code) => `${new Intl.DisplayNames(["en"], { type: "language" }).of(code)} (\`${code}\`)`)
    .join(", "),
  "%%DEFAULT_LOCALE%%": languages[0] ?? "",
  "%%DEFAULT_DIR%%": multilingual && rtlLanguages.has(language(languages[0])) ? "rtl" : "ltr",
  "%%FONT_IMPORTS%%": hasArabicScript ? "Inter, Noto_Sans_Arabic" : "Inter",
}
const keepExample = type === "application" && !flags.has("example")
// Marked blocks (`// @name-start` … `// @name-end`, also in {/* */} and <!-- --> form) are kept or cut.
const blocks = { example: keepExample, i18n: multilingual, "no-i18n": !multilingual, arabic: hasArabicScript }
const appRoutes = multilingual ? "src/app/[locale]/(app)" : "src/app/(app)"
const untranslated = []

// ---------- copy ----------
console.log(`\n▸ Creating ${appName} in ${targetDir}`)
cpSync(templateDir, targetDir, { recursive: true })
renameSync(join(targetDir, "_gitignore"), join(targetDir, ".gitignore"))

// ---------- languages ----------
if (multilingual) {
  for (const [from, to] of i18nMoves[type]) {
    mkdirSync(dirname(join(targetDir, to)), { recursive: true })
    renameSync(join(targetDir, from), join(targetDir, to))
  }
  for (const path of i18nRemovals[type]) rmSync(join(targetDir, path), { recursive: true, force: true })
  cpSync(join(i18nOverlays, "shared"), targetDir, { recursive: true })
  cpSync(join(i18nOverlays, type), targetDir, { recursive: true })

  // One messages file per language. Languages without a translated source start as a copy of English.
  const messagesDir = join(targetDir, "messages")
  const sources = Object.fromEntries(
    readdirSync(messagesDir).map((file) => [file.replace(/\.json$/, ""), readFileSync(join(messagesDir, file), "utf8")]),
  )
  rmSync(messagesDir, { recursive: true })
  mkdirSync(messagesDir)
  for (const locale of languages) {
    if (!sources[locale]) untranslated.push(locale)
    const messages = JSON.parse(sources[locale] ?? sources.en)
    if (type === "application" && !keepExample) for (const key of exampleMessageKeys) deletePath(messages, key)
    // Fill placeholders here, where JSON.stringify escapes quotes in the name or description.
    const json = JSON.stringify(messages, (_, value) => (typeof value === "string" ? fillPlaceholders(value) : value), 2)
    writeFileSync(join(messagesDir, `${locale}.json`), `${json}\n`)
  }

  if (type === "application" && hasArabicScript) {
    const themePath = join(targetDir, "src/styles/theme.css")
    const theme = readFileSync(themePath, "utf8")
    if (!theme.includes("var(--font-inter),")) fail("src/styles/theme.css no longer defines --font-sans with Inter.")
    writeFileSync(themePath, theme.replace("var(--font-inter),", "var(--font-inter), var(--font-arabic),"))
  }
}

function deletePath(object, path) {
  const keys = path.split(".")
  const last = keys.pop()
  const parent = keys.reduce((node, key) => node?.[key], object)
  if (parent) delete parent[last]
}

// ---------- example feature ----------
if (type === "application" && !keepExample) {
  rmSync(join(targetDir, "src/features/posts"), { recursive: true, force: true })
  rmSync(join(targetDir, appRoutes, "posts"), { recursive: true, force: true })
  writeFileSync(join(targetDir, "src/features/.gitkeep"), "")
}

// ---------- text replacements ----------
const TEXT_EXT = /\.(ts|tsx|mts|mjs|js|json|md|css|example)$/

function fillPlaceholders(text) {
  for (const [key, value] of Object.entries(replacements)) text = text.split(key).join(value)
  return text
}

function applyBlocks(text) {
  for (const [name, keep] of Object.entries(blocks)) {
    const marker = (edge) => String.raw`(?:// @${name}-${edge}|\{/\* @${name}-${edge} \*/\}|<!-- @${name}-${edge} -->)`
    const pattern = keep
      ? String.raw`^[ \t]*(?:${marker("start")}|${marker("end")})[ \t]*\r?\n`
      : String.raw`^[ \t]*${marker("start")}[\s\S]*?${marker("end")}[ \t]*\r?\n`
    text = text.replace(new RegExp(pattern, "gm"), "")
  }
  return text
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) walk(path)
    else if (TEXT_EXT.test(entry) || entry.startsWith(".")) {
      const original = readFileSync(path, "utf8")
      const text = fillPlaceholders(applyBlocks(original))
      if (text !== original) writeFileSync(path, text)
    }
  }
}
walk(targetDir)

const packagePath = join(targetDir, "package.json")
const pkg = JSON.parse(readFileSync(packagePath, "utf8"))
if (type === "website") {
  for (const library of selectedLibraries) {
    const { version, devDependencies = {} } = websiteLibraries[library]
    pkg.dependencies[library] = version
    Object.assign(pkg.devDependencies, devDependencies)
  }
}
if (multilingual) {
  pkg.dependencies["next-intl"] = i18nVersion
  const scripts = {}
  for (const [name, command] of Object.entries(pkg.scripts)) {
    if (name === "build") scripts.prebuild = "npm run lint:i18n"
    scripts[name] = command
    if (name === "lint:fix") scripts["lint:i18n"] = "node scripts/check-i18n.mjs"
  }
  pkg.scripts = scripts
}
pkg.dependencies = Object.fromEntries(Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b)))
pkg.devDependencies = Object.fromEntries(Object.entries(pkg.devDependencies).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)

// Both agents read the same architecture rules without maintaining two template files.
writeFileSync(join(targetDir, "AGENTS.md"), readFileSync(join(targetDir, "CLAUDE.md"), "utf8"))
writeFileSync(join(targetDir, ".env.local"), readFileSync(join(targetDir, ".env.example"), "utf8"))

// ---------- install / git ----------
const run = (cmd) => execSync(cmd, { cwd: targetDir, stdio: "inherit" })

if (!flags.has("install")) {
  console.log("\n▸ Installing dependencies (npm install)…")
  try {
    run("npm install --no-audit --no-fund")
  } catch {
    fail("npm install failed. Fix the error above, then run `npm install` inside the project.")
  }
  // Re-format files touched by placeholder/example replacement. Websites ship without Prettier.
  if (type === "application") {
    try {
      execSync("npx prettier --write . --log-level warn", { cwd: targetDir, stdio: "inherit" })
    } catch {
      console.warn("⚠ Prettier formatting skipped.")
    }
  }
}

if (!flags.has("git")) {
  try {
    run("git init -q -b main")
    run("git add -A")
    run('git commit -q -m "chore: scaffold from nextjs-starter"')
  } catch {
    console.warn("⚠ Skipped the initial git commit (git missing or user.name/email not configured).")
  }
}

console.log(`
✔ ${appName} is ready.

  cd ${target}
  npm run dev        → http://localhost:3000${multilingual ? ` (redirects to /${languages[0]})` : ""}
${type === "application" ? `                       http://localhost:3000/${multilingual ? `${languages[0]}/` : ""}design-system (gallery)\n` : ""}
Architecture rules: ${join(target, "AGENTS.md")} (Codex), ${join(target, "CLAUDE.md")} (Claude Code)
${keepExample ? "Example feature:    src/features/posts (delete it when you add real features)\n" : ""}${
  multilingual
    ? `Languages:          ${languages.join(", ")} (default ${languages[0]}), text in messages/<language>.json\n${untranslated.length > 0 ? `Translate:          ${untranslated.map((code) => `messages/${code}.json`).join(", ")} (copied from English)\n` : ""}`
    : ""
}`)
