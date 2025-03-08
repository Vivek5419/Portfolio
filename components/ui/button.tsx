import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-gray-100 active:bg-gray-200 rounded-full shadow-lg",
        outline: "border-2 border-white bg-transparent text-white hover:bg-white/10 active:bg-white/20 rounded-full",
        secondary: "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-700 rounded-full",
        ghost: "text-white hover:bg-white/10 active:bg-white/20 rounded-full",
        link: "text-primary underline-offset-4 hover:underline rounded-full",
      },
      size: {
        default: "h-14 px-8 text-base",
        sm: "h-10 px-4 text-sm",
        lg: "h-16 px-10 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

