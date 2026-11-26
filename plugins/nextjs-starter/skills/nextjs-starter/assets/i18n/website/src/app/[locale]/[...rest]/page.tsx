import { notFound } from "next/navigation"

// Unknown URLs inside a locale render the localized 404 in the site layout.
export default function CatchAllPage() {
  notFound()
}
