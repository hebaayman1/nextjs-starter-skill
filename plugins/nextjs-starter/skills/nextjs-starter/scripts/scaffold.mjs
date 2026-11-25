#!/usr/bin/env node
/**
 * Scaffold a Next.js project from ../assets/template.
 *
 * Usage:
 *   node scaffold.mjs <target-dir> [--name "App Name"] [--description "..."]
 *        [--api-url https://api.example.com] [--no-example] [--no-install] [--no-git]
 */
import { execSync } from "node:child_process"
import { cpSync, existsSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs"
import { basename, dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const templateDir = resolve(here, "../assets/template")

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
}

// ---------- copy ----------
console.log(`\n▸ Creating ${appName} in ${targetDir}`)
cpSync(templateDir, targetDir, { recursive: true })
renameSync(join(targetDir, "_gitignore"), join(targetDir, ".gitignore"))

// ---------- example feature ----------
const keepExample = !flags.has("example")
if (!keepExample) {
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
  // Re-format files touched by placeholder/example replacement.
  try {
    execSync("npx prettier --write . --log-level warn", { cwd: targetDir, stdio: "inherit" })
  } catch {
    console.warn("⚠ Prettier formatting skipped.")
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
                       http://localhost:3000/design-system (gallery)

Architecture rules: ${join(target, "CLAUDE.md")}
${keepExample ? "Example feature:    src/features/posts (delete it when you add real features)\n" : ""}`)
