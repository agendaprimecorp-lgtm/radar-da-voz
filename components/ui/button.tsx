import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-dark-900 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg active:scale-95",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 shadow-md hover:shadow-lg active:scale-95",
        outline: "border-2 border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-950 active:scale-95",
        ghost: "text-primary-500 hover:bg-primary-50 dark:hover:bg-dark-800 active:scale-95",
        link: "text-primary-500 underline-offset-4 hover:underline active:scale-95",
        destructive: "bg-error-500 text-white hover:bg-error-600 shadow-md hover:shadow-lg active:scale-95",
        success: "bg-success-500 text-white hover:bg-success-600 shadow-md hover:shadow-lg active:scale-95",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-10 px-4 py-2 rounded-lg",
        lg: "h-12 px-6 text-base rounded-lg",
        xl: "h-14 px-8 text-lg rounded-lg",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
