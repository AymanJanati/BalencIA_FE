// lib/utils.ts — BalencIA
// Score formatting, date helpers, and general utility functions.

/**
 * Format a numeric score for display with one decimal place.
 */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

/**
 * Format an ISO date string to a short readable format.
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
  });
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
