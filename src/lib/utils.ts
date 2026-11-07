import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number | undefined | null) =>
    new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
    }).format(price ?? 0);