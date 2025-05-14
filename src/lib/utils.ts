
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateGradient(color: string, opacity1 = 0.8, opacity2 = 0.1) {
  return {
    start: `${color}${Math.round(opacity1 * 100)}`,
    end: `${color}${Math.round(opacity2 * 100)}`
  }
}
