import assert from "node:assert/strict"
import { execFileSync, spawnSync } from "node:child_process"
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import { fileURLToPath } from "node:url"

const script = fileURLToPath(new URL("../plugins/nextjs-starter/skills/nextjs-starter/scripts/scaffold.mjs", import.meta.url))

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

function scaffoldFails(args) {
  const parent = mkdtempSync(join(tmpdir(), "nextjs-starter-test-"))
  const target = join(parent, "site")
  try {
    const result = spawnSync(process.execPath, [script, target, ...args, "--no-install", "--no-git"], { encoding: "utf8" })
    assert.notEqual(result.status, 0, "expected the scaffold to fail")
    assert.ok(!existsSync(target), "a failed scaffold must not create the target")
    return result.stderr
  } finally {
    rmSync(parent, { recursive: true, force: true })
  }
}

function leftoverPlaceholders(dir) {
  const hits = []
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) hits.push(...leftoverPlaceholders(path))
    else if (readFileSync(path, "utf8").includes("%%")) hits.push(path)
  }
  return hits
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
    assert.match(readFileSync(join(target, "src/config/site.ts"), "utf8"), /name: "Acme Studio"/)
    assert.ok(pkg.dependencies.gsap)
    assert.ok(pkg.dependencies.three)
    assert.ok(pkg.dependencies.axios)
    assert.ok(pkg.devDependencies["@types/three"])
    assert.ok(!pkg.dependencies["embla-carousel-react"])
    assert.ok(pkg.scripts["lint:fix"])
    assert.equal(readFileSync(join(target, "AGENTS.md"), "utf8"), readFileSync(join(target, "CLAUDE.md"), "utf8"))
    assert.match(readFileSync(join(target, ".env.example"), "utf8"), /https:\/\/acme\.example/)
    const gitignore = readFileSync(join(target, ".gitignore"), "utf8")
    for (const entry of ["next-env.d.ts", "*.tsbuildinfo", ".env*"]) assert.ok(gitignore.includes(entry), entry)
    assert.ok(!gitignore.includes("design-system.md"))
    assert.deepEqual(leftoverPlaceholders(target), [])
  } finally {
    cleanup()
  }
})

test("application remains the default profile", () => {
  const { target, cleanup } = scaffold([])
  try {
    assert.ok(existsSync(join(target, "src/features/posts")))
    assert.ok(existsSync(join(target, "src/app/design-system")))
    assert.deepEqual(leftoverPlaceholders(target), [])
  } finally {
    cleanup()
  }
})

test("options for the other profile are rejected", () => {
  assert.match(scaffoldFails(["--libraries", "gsap"]), /--libraries is available only for websites/)
  assert.match(scaffoldFails(["--site-url", "https://acme.example"]), /--site-url is available only for websites/)
  assert.match(scaffoldFails(["--type", "website", "--api-url", "https://api.example"]), /--api-url is available only for applications/)
  assert.match(scaffoldFails(["--type", "website", "--no-example"]), /--no-example is available only for applications/)
})

test("invalid input is rejected before anything is written", () => {
  assert.match(scaffoldFails(["--type", "blog"]), /Unknown type "blog"/)
  assert.match(scaffoldFails(["--type", "website", "--libraries", "jquery"]), /Unknown website library "jquery"/)
  assert.match(scaffoldFails(["--type", "website", "--site-url", ""]), /--site-url must be an http\(s\) URL/)
  assert.match(scaffoldFails(["--type", "website", "--site-url", "acme.example"]), /--site-url must be an http\(s\) URL/)
})
