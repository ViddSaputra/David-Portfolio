import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility: merge Tailwind classes safely.
 * Handles conditional classes and resolves conflicts (e.g. px-4 + px-6 → px-6).
 * Every component imports cn() instead of writing raw string concatenation.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
