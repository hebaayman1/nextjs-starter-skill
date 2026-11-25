import { notFound } from "next/navigation"

// Unknown portal URLs render the in-shell 404 instead of the bare root one.
export default function MissingPage() {
  notFound()
}
