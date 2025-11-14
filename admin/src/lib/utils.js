import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Shared toast styling constant (DRY principle)
export const TOAST_STYLE = {
  borderRadius: "10px",
  background: "#121420",
  color: "#fff",
  border: "0.4px solid gray",
};
