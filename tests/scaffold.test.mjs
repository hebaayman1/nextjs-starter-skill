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

const read = (target, path) => readFileSync(join(target, path), "utf8")
const messages = (target, locale) => JSON.parse(read(target, `messages/${locale}.json`))

function keyPaths(value, prefix = "") {
  if (typeof value !== "object") return [prefix]
  return Object.entries(value).flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key))
}

test("single-language projects get no i18n files or rules", () => {
  for (const type of ["application", "website"]) {
    const { target, cleanup } = scaffold(["--type", type])
    try {
      assert.ok(!existsSync(join(target, "messages")))
      assert.ok(!existsSync(join(target, "src/proxy.ts")))
      assert.ok(!existsSync(join(target, "src/app/[locale]")))
      assert.ok(!JSON.parse(read(target, "package.json")).dependencies["next-intl"])
      assert.doesNotMatch(read(target, "CLAUDE.md"), /next-intl|@i18n|@no-i18n/)
      assert.doesNotMatch(read(target, "vitest.config.mts"), /next-intl|@i18n/)
      assert.deepEqual(leftoverPlaceholders(target), [])
    } finally {
      cleanup()
    }
  }
})

test("multilingual application moves routes under [locale] with Arabic as the default", () => {
  const { target, cleanup } = scaffold(["--name", "Yas Now", "--description", 'Say "hi"', "--languages", "ar,en"])
  try {
    for (const path of [
      "src/app/[locale]/layout.tsx",
      "src/app/[locale]/(app)/posts/page.tsx",
      "src/app/[locale]/design-system/page.tsx",
      "src/i18n/routing.ts",
      "src/i18n/request.ts",
      "src/proxy.ts",
      "src/hooks/use-language.ts",
      "src/lib/localized-name.ts",
      "src/components/app-shell/language-toggle.tsx",
      "scripts/check-i18n.mjs",
    ]) assert.ok(existsSync(join(target, path)), path)
    assert.ok(!existsSync(join(target, "src/app/(app)")))
    assert.ok(!existsSync(join(target, "src/app/design-system")))
    assert.deepEqual(readdirSync(join(target, "messages")).sort(), ["ar.json", "en.json"])

    const routing = read(target, "src/i18n/routing.ts")
    assert.match(routing, /locales: \["ar", "en"\]/)
    assert.match(routing, /defaultLocale: "ar"/)
    assert.match(routing, /localeDetection: false/)
    assert.match(read(target, "src/app/not-found.tsx"), /lang="ar" dir="rtl"/)

    const pkg = JSON.parse(read(target, "package.json"))
    assert.ok(pkg.dependencies["next-intl"])
    assert.equal(pkg.scripts.prebuild, "npm run lint:i18n")
    assert.equal(pkg.scripts["lint:i18n"], "node scripts/check-i18n.mjs")
    assert.match(read(target, "vitest.config.mts"), /inline: \["next-intl"\]/)

    // Arabic gets a font that covers its script.
    assert.match(read(target, "src/app/fonts.ts"), /Noto_Sans_Arabic/)
    assert.match(read(target, "src/styles/theme.css"), /var\(--font-inter\), var\(--font-arabic\)/)

    // Quotes in the description are escaped, and both languages share the same keys.
    assert.equal(messages(target, "en").metadata.description, 'Say "hi"')
    assert.notEqual(messages(target, "ar").navigation.home, messages(target, "en").navigation.home)
    assert.deepEqual(keyPaths(messages(target, "ar")), keyPaths(messages(target, "en")))

    const rules = read(target, "CLAUDE.md")
    assert.match(rules, /Arabic \(`ar`\), English \(`en`\)/)
    assert.match(rules, /## Languages/)
    assert.doesNotMatch(rules, /@i18n|@no-i18n/)
    assert.equal(read(target, "AGENTS.md"), rules)
    assert.deepEqual(leftoverPlaceholders(target), [])
  } finally {
    cleanup()
  }
})

test("extra languages start as English copies and non-Arabic projects skip the Arabic font", () => {
  const { target, cleanup } = scaffold(["--languages", "en, FR ,pt-br", "--no-example"])
  try {
    assert.deepEqual(readdirSync(join(target, "messages")).sort(), ["en.json", "fr.json", "pt-BR.json"])
    assert.deepEqual(messages(target, "fr"), messages(target, "en"))
    assert.match(read(target, "src/i18n/routing.ts"), /locales: \["en", "fr", "pt-BR"\]/)
    assert.doesNotMatch(read(target, "src/app/fonts.ts"), /Arabic/)
    assert.doesNotMatch(read(target, "src/styles/theme.css"), /font-arabic/)
    // --no-example removes the example route, feature, and its messages.
    assert.ok(!existsSync(join(target, "src/app/[locale]/(app)/posts")))
    assert.ok(!existsSync(join(target, "src/features/posts")))
    assert.equal(messages(target, "en").posts, undefined)
    assert.equal(messages(target, "en").navigation.posts, undefined)
    assert.deepEqual(leftoverPlaceholders(target), [])
  } finally {
    cleanup()
  }
})

test("multilingual website localizes pages, sitemap, and llms.txt", () => {
  const { target, cleanup } = scaffold(["--type", "website", "--languages", "ar,en"])
  try {
    for (const path of [
      "src/app/[locale]/layout.tsx",
      "src/app/[locale]/page.tsx",
      "src/app/[locale]/about/page.tsx",
      "src/app/[locale]/not-found.tsx",
      "src/components/layout/language-switcher.tsx",
      "src/lib/localized-url.ts",
      "src/proxy.ts",
    ]) assert.ok(existsSync(join(target, path)), path)
    assert.ok(!existsSync(join(target, "src/app/page.tsx")))
    assert.ok(!existsSync(join(target, "src/app/about")))
    assert.match(read(target, "src/app/sitemap.ts"), /alternates: \{ languages \}/)
    assert.match(read(target, "src/components/ui/button.tsx"), /from "@\/i18n\/routing"/)
    assert.deepEqual(keyPaths(messages(target, "ar")), keyPaths(messages(target, "en")))
    assert.doesNotMatch(read(target, "CLAUDE.md"), /@i18n|@no-i18n/)
    assert.deepEqual(leftoverPlaceholders(target), [])
  } finally {
    cleanup()
  }
})

test("single-theme projects keep the OS-driven dark mode and no theme files", () => {
  for (const type of ["application", "website"]) {
    const { target, cleanup } = scaffold(["--type", type])
    try {
      assert.ok(!existsSync(join(target, "src/lib/theme.ts")))
      assert.ok(!existsSync(join(target, "src/hooks/use-theme.ts")))
      assert.doesNotMatch(read(target, "src/app/layout.tsx"), /themeScript|suppressHydrationWarning/)
      assert.doesNotMatch(read(target, "CLAUDE.md"), /## Themes/)
      assert.doesNotMatch(read(target, "src/app/globals.css"), /@themes|@no-themes|custom-variant/)
    } finally {
      cleanup()
    }
  }
  const { target, cleanup } = scaffold(["--type", "website"])
  try {
    assert.match(read(target, "src/app/globals.css"), /prefers-color-scheme: dark/)
  } finally {
    cleanup()
  }
})

test("multi-theme application adds the picker, no-flash script, and custom theme blocks", () => {
  const { target, cleanup } = scaffold(["--themes", "dark, light,High-Contrast"])
  try {
    assert.match(read(target, "src/lib/theme.ts"), /themes = \["light", "dark", "high-contrast"\] as const/)
    const layout = read(target, "src/app/layout.tsx")
    assert.match(layout, /suppressHydrationWarning/)
    assert.match(layout, /__html: themeScript/)
    assert.match(read(target, "src/components/app-shell/app-shell.tsx"), /<ThemeToggle \/>/)
    const toggle = read(target, "src/components/app-shell/theme-toggle.tsx")
    assert.match(toggle, /"high-contrast": "High contrast"/)
    assert.doesNotMatch(toggle, /next-intl/)
    assert.match(read(target, "src/styles/tokens.css"), /\[data-theme="high-contrast"\] \{/)
    assert.match(read(target, "src/app/globals.css"), /@custom-variant dark/)
    assert.ok(!existsSync(join(target, "src/hooks/.gitkeep")))
    assert.match(read(target, "CLAUDE.md"), /## Themes/)
    assert.ok(!JSON.parse(read(target, "package.json")).dependencies["next-themes"])
    assert.deepEqual(leftoverPlaceholders(target), [])
  } finally {
    cleanup()
  }
})

test("themes and languages combine: picker labels are translated", () => {
  for (const type of ["application", "website"]) {
    const { target, cleanup } = scaffold(["--type", type, "--languages", "ar,en,fr", "--themes", "light,dark,brand"])
    try {
      assert.deepEqual(messages(target, "ar").theme, {
        label: "المظهر", system: "حسب النظام", light: "فاتح", dark: "داكن", brand: "Brand",
      })
      assert.equal(messages(target, "fr").theme.dark, "Dark")
      assert.deepEqual(keyPaths(messages(target, "ar")), keyPaths(messages(target, "en")))
      const layout = read(target, "src/app/[locale]/layout.tsx")
      assert.match(layout, /suppressHydrationWarning/)
      assert.match(layout, /__html: themeScript/)
      const toggle = read(target, type === "application"
        ? "src/components/app-shell/theme-toggle.tsx"
        : "src/components/layout/theme-toggle.tsx")
      assert.match(toggle, /useTranslations\("theme"\)/)
      assert.doesNotMatch(toggle, /const labels/)
      assert.doesNotMatch(read(target, "CLAUDE.md"), /@themes|@i18n|@no-/)
      assert.deepEqual(leftoverPlaceholders(target), [])
    } finally {
      cleanup()
    }
  }
})

test("invalid theme lists are rejected", () => {
  assert.match(scaffoldFails(["--themes", "light"]), /must include light and dark/)
  assert.match(scaffoldFails(["--themes", "light,dark,system"]), /"system" is always available/)
  assert.match(scaffoldFails(["--themes", "light,dark,Dark"]), /lists "dark" twice/)
  assert.match(scaffoldFails(["--themes", "light,dark,my theme"]), /Invalid theme name "my theme"/)
  assert.match(scaffoldFails(["--themes"]), /--themes needs a comma-separated list/)
})

test("invalid language lists are rejected", () => {
  assert.match(scaffoldFails(["--languages", "ar"]), /at least two languages/)
  assert.match(scaffoldFails(["--languages", "ar,en,AR"]), /lists "ar" twice/)
  assert.match(scaffoldFails(["--languages", "ar,english"]), /Unknown language code "english"/)
  assert.match(scaffoldFails(["--languages", "ar,../en"]), /Unknown language code/)
  assert.match(scaffoldFails(["--languages"]), /--languages needs a comma-separated list/)
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
