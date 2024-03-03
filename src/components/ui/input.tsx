import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "focus-visible:ring-ring",
                destructive:
                    "ring-2 ring-[#D5252E]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ id, className, variant, ...props }, ref) => {
        return (
            <>
                <input
                    id={id}
                    className={cn(inputVariants({ variant, className }))}
                    ref={ref}
                    {...props}
                />
            </>
        )
    }
)
Input.displayName = "Input"
