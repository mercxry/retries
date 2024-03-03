import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/* function enumFromString<T>(enm: { [s: string]: T }, value: string): T | undefined { */
/*     return (Object.values(enm) as unknown as string[]).includes(value) */
/*         ? value as unknown as T */
/*         : undefined; */
/* } */
