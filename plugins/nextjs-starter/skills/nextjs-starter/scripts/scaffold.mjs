#!/usr/bin/env node
/**
 * Scaffold a Next.js application or website.
 *
 * Usage:
 *   node scaffold.mjs <target-dir> [--name "App Name"] [--description "..."]
 *        [--type application|website] [--api-url https://api.example.com]
 *        [--site-url https://example.com] [--libraries gsap,three]
 *        [--no-example] [--no-install] [--no-git]
 */
import { execSync } from "node:child_process"
import { cpSync, existsSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs"
import { basename, dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const templates = {
  application: resolve(here, "../assets/template"),
  website: resolve(here, "../assets/website-template"),
}
const websiteLibraries = {
  gsap: { version: "^3.13.0" },
  three: { version: "^0.180.0", types: "^0.180.0" },
  "embla-carousel-react": { version: "^8.6.0" },
  axios: { version: "^1.21.1" },
  "isomorphic-dompurify": { version: "2.26.0" },
}

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
const selectedLibraries = options.libraries ? options.libraries.split(",").map((name) => name.trim()).filter(Boolean) : []
if (type === "application" && selectedLibraries.length) fail("--libraries is available only for websites.")
for (const library of selectedLibraries) {
  if (!Object.hasOwn(websiteLibraries, library)) fail(`Unknown website library "${library}".`)
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
}

// ---------- copy ----------
console.log(`\n▸ Creating ${appName} in ${targetDir}`)
cpSync(templateDir, targetDir, { recursive: true })
renameSync(join(targetDir, "_gitignore"), join(targetDir, ".gitignore"))

// ---------- example feature ----------
const keepExample = type === "application" && !flags.has("example")
if (type === "application" && !keepExample) {
  rmSync(join(targetDir, "src/features/posts"), { recursive: true, force: true })
  rmSync(join(targetDir, "src/app/(app)/posts"), { recursive: true, force: true })
  writeFileSync(join(targetDir, "src/features/.gitkeep"), "")
}

// ---------- text replacements ----------
const TEXT_EXT = /\.(ts|tsx|mts|mjs|js|json|md|css|example)$/
const exampleBlock = /^[ \t]*(?:\/\/ @example-start|\{\/\* @example-start \*\/\})[\s\S]*?(?:\/\/ @example-end|\{\/\* @example-end \*\/\})[ \t]*\r?\n/gm
const exampleMarker = /^[ \t]*(?:\/\/ @example-(?:start|end)|\{\/\* @example-(?:start|end) \*\/\})[ \t]*\r?\n/gm

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) walk(path)
    else if (TEXT_EXT.test(entry) || entry.startsWith(".")) {
      let text = readFileSync(path, "utf8")
      const original = text
      text = keepExample ? text.replace(exampleMarker, "") : text.replace(exampleBlock, "")
      for (const [key, value] of Object.entries(replacements)) text = text.split(key).join(value)
      if (text !== original) writeFileSync(path, text)
    }
  }
}
walk(targetDir)

if (type === "website") {
  const packagePath = join(targetDir, "package.json")
  const pkg = JSON.parse(readFileSync(packagePath, "utf8"))
  for (const library of selectedLibraries) {
    const { version, types } = websiteLibraries[library]
    pkg.dependencies[library] = version
    if (types) pkg.devDependencies["@types/three"] = types
  }
  writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)
}

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
  npm run dev        → http://localhost:3000
${type === "application" ? "                       http://localhost:3000/design-system (gallery)\n" : ""}

Architecture rules: ${join(target, "AGENTS.md")} (Codex), ${join(target, "CLAUDE.md")} (Claude Code)
${keepExample ? "Example feature:    src/features/posts (delete it when you add real features)\n" : ""}`)
