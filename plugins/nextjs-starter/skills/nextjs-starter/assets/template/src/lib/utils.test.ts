import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("keeps a custom font size and a semantic text color together", () => {
    expect(cn("text-body text-content-primary")).toBe("text-body text-content-primary")
  })

  it("lets a later custom spacing value win", () => {
    expect(cn("gap-xs p-s", "gap-m")).toBe("p-s gap-m")
  })

  it("lets a later custom radius win", () => {
    expect(cn("rounded-sm", "rounded-lg")).toBe("rounded-lg")
  })

  it("supports conditional classes", () => {
    const active = false
    expect(cn("px-m", active && "bg-bg-brand", { "text-content-error": true })).toBe("px-m text-content-error")
  })
})
