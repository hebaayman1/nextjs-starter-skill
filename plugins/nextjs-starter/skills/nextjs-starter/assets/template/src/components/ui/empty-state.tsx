import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type EmptyStateProps = { title: string; description?: string; action?: ReactNode; className?: string }

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center gap-xs rounded-lg bg-bg-secondary px-l py-2xl text-center", className)}
    >
      <p className="text-title font-semibold text-content-primary">{title}</p>
      {description ? <p className="max-w-md text-body text-content-secondary">{description}</p> : null}
      {action ? <div className="mt-xs">{action}</div> : null}
    </div>
  )
}
