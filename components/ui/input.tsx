import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border-2 bg-dark-800 px-4 py-2 text-base text-dark-50 placeholder:text-dark-400 transition-all duration-200",
        "border-dark-600 focus:border-primary-500 focus:outline-none focus:ring-3 focus:ring-primary-500/20 focus:ring-offset-2 focus:ring-offset-dark-900",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-dark-700",
        className
      )}
      style={{
        backgroundColor: "rgba(203, 213, 225, 0.05)",
        borderColor: "rgba(203, 213, 225, 0.2)",
      }}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
