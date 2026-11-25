import { cva, type VariantProps } from "class-variance-authority"
import { disabledState, focusRing } from "@/lib/variants"

// Server-safe: no React import, so server components can style links as buttons.
export const buttonVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2xs rounded-md font-medium whitespace-nowrap transition-colors",
    focusRing,
    disabledState,
  ],
  {
    variants: {
      variant: {
        primary: "bg-bg-brand text-content-on-brand hover:bg-bg-brand-hover",
        secondary: "border border-border-default bg-bg-primary text-content-primary hover:bg-bg-secondary",
        ghost: "text-content-primary hover:bg-bg-tertiary",
        danger: "bg-content-error text-content-on-brand hover:opacity-90",
      },
      size: {
        s: "h-8 px-s text-caption",
        m: "h-10 px-m text-body",
        l: "h-12 px-l text-title",
      },
    },
    defaultVariants: { variant: "primary", size: "m" },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
