// Currency utilities for INR (Indian Rupees)
// All amounts are now stored and processed in INR directly

/**
 * Format INR amount as currency string
 * @param inrAmount - Amount in INR
 * @returns Formatted INR string with ₹ symbol
 */
export function formatINR(inrAmount: number): string {
    return `₹${Math.round(inrAmount).toLocaleString("en-IN")}`
}

/**
 * Get INR amount (no conversion needed - already in INR)
 * @param inrAmount - Amount in INR
 * @returns INR amount as number
 */
export function getINRAmount(inrAmount: number): number {
    return Math.round(inrAmount)
}

/**
 * Format currency with proper Indian number formatting
 * @param amount - Amount to format
 * @param currency - Currency symbol (default: ₹)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = "₹"): string {
    return `${currency}${amount.toLocaleString("en-IN")}`
}
