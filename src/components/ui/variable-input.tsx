import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import ms from "enhanced-ms"

import { cn } from "@/lib/utils"
import { defaultVariables } from "@/lib/variables"

const variants = cva(
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

export enum VariableInputKind {
    Number = "number",
    Duration = "duration",
}

export interface VariableInputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof variants> {
    kind: VariableInputKind
    error?: string
    inferPlaceholder?: boolean
}

export const VariableInput = React.forwardRef<HTMLInputElement, VariableInputProps>(
    ({ id, className, variant, kind, error, inferPlaceholder, ...props }, ref) => {
        if (error != undefined) {
            variant = "destructive";
        }

        return (
            <>
                <input
                    id={id}
                    data-kind={kind}
                    className={cn(variants({ variant, className }))}
                    placeholder={inferPlaceholder && id != undefined ? getDefaultPlaceholder(id, kind) : undefined}
                    ref={ref}
                    {...props}
                />
                <div className="text-[#D5252E] mt-3">{error}</div>
            </>
        )
    }
)
VariableInput.displayName = "VariableInput"

function getDefaultPlaceholder(id: string, inputKind: VariableInputKind): string {
    switch (inputKind) {
        case VariableInputKind.Number:
            return defaultVariables[id].toString() || "???";
        case VariableInputKind.Duration: {
            return defaultVariables[id] != undefined
                ? ms(defaultVariables[id], { shortFormat: true }) || "???"
                : "???";
        }
        default:
            return "???"
    }
}
