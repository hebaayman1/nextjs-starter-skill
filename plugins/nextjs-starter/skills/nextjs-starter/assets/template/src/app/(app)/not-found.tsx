import Link from "next/link"
import { buttonVariants } from "@/components/ui/button-variants"
import { EmptyState } from "@/components/ui/empty-state"

export default function PortalNotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you are looking for does not exist or has moved."
      action={
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          Back home
        </Link>
      }
    />
  )
}
