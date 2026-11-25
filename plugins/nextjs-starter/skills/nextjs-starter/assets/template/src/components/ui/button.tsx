import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { buttonVariants, type ButtonVariantProps } from "./button-variants"
import { Spinner } from "./spinner"

export type ButtonProps = ComponentProps<"button"> & ButtonVariantProps & { loading?: boolean }

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner label="" /> : null}
      {children}
    </button>
  )
}
