import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { VariableKind } from "@/lib/variables"
import { PresetSelectedEvent } from "@/lib/events/preset-selected"

const strategies = [
    {
        label: "Simple",
        value: "simple",

        formula: "minSleep",
        variables: {
            base: {
                kind: VariableKind.Number,
                value: 0,
            },
            minSleep: {
                kind: VariableKind.Duration,
                value: 1000, // 1000ms = 1s
            },
            maxSleep: {
                kind: VariableKind.Duration,
                value: 1800000, // 1800000ms = 30m
            },
            minJitterFactor: {
                kind: VariableKind.Float,
                value: 0.0,
            },
            maxJitterFactor: {
                kind: VariableKind.Float,
                value: 0.0,
            },
            maxAttempts: {
                kind: VariableKind.Number,
                value: 10
            },
        },
    },
    {
        label: "Exponential Backoff",
        value: "exponential_backoff",

        formula: "min(maxSleep, minSleep * (base ** attempt))",
        variables: {
            base: {
                kind: VariableKind.Number,
                value: 2,
            },
            minSleep: {
                kind: VariableKind.Duration,
                value: 1000, // 1000ms = 1s
            },
            maxSleep: {
                kind: VariableKind.Duration,
                value: 1800000, // 1800000ms = 30m
            },
            minJitterFactor: {
                kind: VariableKind.Float,
                value: 0.0,
            },
            maxJitterFactor: {
                kind: VariableKind.Float,
                value: 1.0,
            },
            maxAttempts: {
                kind: VariableKind.Number,
                value: 10
            },
        },
    },
]

export function StrategySelector() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[320px] justify-between"
                >
                    {value
                        ? strategies.find((strategy) => strategy.value === value)?.label
                        : "Select strategy..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0">
                <Command>
                    <CommandInput placeholder="Search strategy..." />
                    <CommandEmpty>No strategy found.</CommandEmpty>
                    <CommandGroup>
                        {strategies.map((strategy) => (
                            <CommandItem
                                key={strategy.value}
                                value={strategy.value}
                                onSelect={(currentValue) => {
                                    const strategy = strategies.find(s => s.value === currentValue);
                                    const event = new CustomEvent<PresetSelectedEvent>("presetSelected", {
                                        detail: {
                                            formula: strategy!.formula,
                                            variables: strategy!.variables,
                                        }
                                    });
                                    window.dispatchEvent(event);

                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === strategy.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {strategy.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
