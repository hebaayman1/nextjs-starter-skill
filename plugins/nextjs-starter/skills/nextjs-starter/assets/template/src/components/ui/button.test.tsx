import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("calls onClick", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("is disabled and busy while loading", () => {
    render(<Button loading>Save</Button>)
    const button = screen.getByRole("button", { name: /save/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
  })

  it("merges className over variant classes", () => {
    render(<Button className="rounded-sm">Save</Button>)
    expect(screen.getByRole("button")).toHaveClass("rounded-sm")
    expect(screen.getByRole("button")).not.toHaveClass("rounded-md")
  })
})
