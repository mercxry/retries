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

const strategies = [
    {
        label: "Simple",
        value: "simple",
    },
    {
        label: "Exponential Backoff",
        value: "exponential_backoff",
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
