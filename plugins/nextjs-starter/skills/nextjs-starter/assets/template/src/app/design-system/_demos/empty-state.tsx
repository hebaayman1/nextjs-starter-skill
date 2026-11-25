import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export function EmptyStateDemo() {
  return (
    <EmptyState
      title="Nothing here yet"
      description="Create your first item to get started."
      action={<Button>Create</Button>}
    />
  )
}
