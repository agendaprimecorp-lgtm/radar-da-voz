import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        primary: "bg-primary-500/20 text-primary-300 border border-primary-500/30 hover:bg-primary-500/30",
        secondary: "bg-secondary-500/20 text-secondary-300 border border-secondary-500/30 hover:bg-secondary-500/30",
        success: "bg-success-500/20 text-success-300 border border-success-500/30 hover:bg-success-500/30",
        error: "bg-error-500/20 text-error-300 border border-error-500/30 hover:bg-error-500/30",
        warning: "bg-warning-500/20 text-warning-300 border border-warning-500/30 hover:bg-warning-500/30",
        default: "bg-dark-700 text-dark-200 border border-dark-600 hover:bg-dark-600",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-1",
        lg: "text-base px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
