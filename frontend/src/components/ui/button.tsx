import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger" | "glass"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          "hover:-translate-y-[1px] active:translate-y-[0px]",
          {
            "bg-primary text-white shadow-lg hover:bg-primary/90 hover:shadow-primary/20":
              variant === "default",
            "border border-white/10 bg-transparent shadow-sm hover:bg-white/5 hover:text-white text-foreground":
              variant === "outline",
            "hover:bg-white/5 hover:text-white text-muted": variant === "ghost",
            "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20":
              variant === "danger",
            "glass hover:bg-white/5 text-foreground": variant === "glass",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-8": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
