#!/usr/bin/env node
/**
 * `npm run lint:i18n` (also runs before every build).
 * Fails when a messages file is invalid JSON, defines a key twice, or has keys another language lacks.
 */
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const dir = join(process.cwd(), "messages")
const files = readdirSync(dir).filter((file) => file.endsWith(".json"))
const problems = []

/** JSON.parse silently keeps the last duplicate, so scan the raw text for repeated keys. */
function duplicateKeys(text) {
  const duplicates = []
  const stack = []
  let i = 0
  const readString = () => {
    const start = i++
    while (text[i] !== '"') i += text[i] === "\\" ? 2 : 1
    return JSON.parse(text.slice(start, ++i))
  }
  while (i < text.length) {
    const char = text[i]
    const top = stack.at(-1)
    if (char === '"') {
      const value = readString()
      if (top?.object && top.expectKey) {
        const path = top.path ? `${top.path}.${value}` : value
        if (top.keys.has(value)) duplicates.push(path)
        top.keys.add(value)
        top.expectKey = false
        top.current = path
      }
      continue
    }
    const parentPath = top?.object ? top.current : (top?.path ?? "")
    if (char === "{") stack.push({ object: true, keys: new Set(), path: parentPath, expectKey: true })
    else if (char === "[") stack.push({ object: false, path: parentPath })
    else if (char === "}" || char === "]") stack.pop()
    else if (char === "," && top?.object) top.expectKey = true
    i++
  }
  return duplicates
}

function leafKeys(value, prefix = "") {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return [prefix]
  return Object.entries(value).flatMap(([key, child]) => leafKeys(child, prefix ? `${prefix}.${key}` : key))
}

const keysByFile = new Map()
for (const file of files) {
  const text = readFileSync(join(dir, file), "utf8")
  try {
    keysByFile.set(file, new Set(leafKeys(JSON.parse(text))))
  } catch (error) {
    problems.push(`${file}: invalid JSON (${error.message})`)
    continue
  }
  for (const key of duplicateKeys(text)) problems.push(`${file}: "${key}" is defined more than once`)
}

const allKeys = new Set([...keysByFile.values()].flatMap((keys) => [...keys]))
for (const [file, keys] of keysByFile) {
  for (const key of allKeys) if (!keys.has(key)) problems.push(`${file}: missing "${key}"`)
}

if (problems.length > 0) {
  console.error(`✖ i18n check failed:\n  ${problems.join("\n  ")}`)
  process.exit(1)
}
console.log(`✔ i18n: ${files.length} languages, ${allKeys.size} keys each`)
