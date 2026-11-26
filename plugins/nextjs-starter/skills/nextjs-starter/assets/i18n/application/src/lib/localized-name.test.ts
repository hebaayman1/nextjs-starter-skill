import { describe, expect, it } from "vitest"
import { localizedField } from "./localized-name"

const role = { nameAr: "مدير", nameEn: "Manager" }

describe("localizedField", () => {
  it("picks the field for the requested language", () => {
    expect(localizedField(role, "name", "ar", [])).toBe("مدير")
    expect(localizedField(role, "name", "en", [])).toBe("Manager")
  })

  it("falls back in order when the requested language is empty or missing", () => {
    expect(localizedField({ nameAr: " ", nameEn: "Manager" }, "name", "ar", ["en"])).toBe("Manager")
    expect(localizedField(role, "name", "fr", ["en", "ar"])).toBe("Manager")
  })

  it("returns an empty string when no language has a value", () => {
    expect(localizedField({}, "name", "ar", ["en"])).toBe("")
  })

  it("supports any field name and region subtags", () => {
    expect(localizedField({ titlePtBr: "Olá" }, "title", "pt-BR", [])).toBe("Olá")
  })
})
