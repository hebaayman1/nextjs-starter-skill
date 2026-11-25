import type { Metadata } from "next"
import { AboutPage } from "@/components"

export const metadata: Metadata = { title: "About" }

export default function Page() {
  return <AboutPage />
}
