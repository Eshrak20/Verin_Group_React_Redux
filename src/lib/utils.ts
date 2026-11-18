import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number | undefined | null) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(price ?? 0);

export const getOrderStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
    case "shipped":
    case "delivered":
    case "paid":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50";
    case "pending":
    case "processing":
    case "unpaid":
      return "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50";
    case "cancelled":
    case "failed":
      return "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50";
    default:
      return "bg-secondary text-secondary-foreground border-border";
  }
};