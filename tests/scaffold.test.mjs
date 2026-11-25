import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { test } from "node:test"

const script = resolve("plugins/nextjs-starter/skills/nextjs-starter/scripts/scaffold.mjs")

function scaffold(args) {
  const parent = mkdtempSync(join(tmpdir(), "nextjs-starter-test-"))
  const target = join(parent, "site")
  try {
    execFileSync(process.execPath, [script, target, ...args, "--no-install", "--no-git"], { stdio: "pipe" })
    return { target, cleanup: () => rmSync(parent, { recursive: true, force: true }) }
  } catch (error) {
    rmSync(parent, { recursive: true, force: true })
    throw error
  }
}

test("website scaffold uses the marketing structure and selected libraries", () => {
  const { target, cleanup } = scaffold([
    "--type", "website", "--name", "Acme Studio", "--site-url", "https://acme.example",
    "--libraries", "gsap,three,axios",
  ])
  try {
    const pkg = JSON.parse(readFileSync(join(target, "package.json"), "utf8"))
    assert.equal(pkg.name, "site")
    assert.ok(existsSync(join(target, "src/components/pages/home-page/home-page.tsx")))
    assert.ok(existsSync(join(target, "src/app/sitemap.ts")))
    assert.ok(!existsSync(join(target, "src/features")))
    assert.ok(pkg.dependencies.gsap)
    assert.ok(pkg.dependencies.three)
    assert.ok(pkg.dependencies.axios)
    assert.ok(pkg.devDependencies["@types/three"])
    assert.ok(!pkg.dependencies["embla-carousel-react"])
    assert.equal(readFileSync(join(target, "AGENTS.md"), "utf8"), readFileSync(join(target, "CLAUDE.md"), "utf8"))
    assert.match(readFileSync(join(target, ".env.example"), "utf8"), /https:\/\/acme\.example/)
  } finally {
    cleanup()
  }
})

test("application remains the default profile", () => {
  const { target, cleanup } = scaffold([])
  try {
    assert.ok(existsSync(join(target, "src/features/posts")))
    assert.ok(existsSync(join(target, "src/app/design-system")))
  } finally {
    cleanup()
  }
})
