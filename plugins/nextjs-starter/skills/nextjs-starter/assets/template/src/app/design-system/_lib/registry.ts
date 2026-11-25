import type { ComponentType } from "react"
import { ButtonDemo } from "../_demos/button"
import { EmptyStateDemo } from "../_demos/empty-state"

export const sections = ["ui", "molecules", "organisms"] as const
export type Section = (typeof sections)[number]

export type DemoEntry = {
  slug: string
  title: string
  section: Section
  /** Optional Figma node id, so designers can jump to the source. */
  designNode?: string
  Demo: ComponentType
}

/** Add one entry per component when you create it. */
export const registry: DemoEntry[] = [
  { slug: "button", title: "Button", section: "ui", Demo: ButtonDemo },
  { slug: "empty-state", title: "Empty state", section: "ui", Demo: EmptyStateDemo },
]
