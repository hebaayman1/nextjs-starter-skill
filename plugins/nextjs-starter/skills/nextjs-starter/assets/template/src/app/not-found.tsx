import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-s p-l text-center">
      <p className="text-display font-semibold text-content-primary">404</p>
      <p className="text-body text-content-secondary">This page does not exist.</p>
      <Link href="/" className={buttonVariants({ variant: "secondary" })}>
        Back home
      </Link>
    </main>
  )
}
