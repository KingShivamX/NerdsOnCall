// Currency conversion utilities
const USD_TO_INR_RATE = 83 // Current approximate exchange rate

/**
 * Convert USD to INR and format as currency
 * @param usdAmount - Amount in USD
 * @returns Formatted INR string with ₹ symbol
 */
export function formatINR(usdAmount: number): string {
    const inrAmount = Math.round(usdAmount * USD_TO_INR_RATE)
    return `₹${inrAmount.toLocaleString("en-IN")}`
}

/**
 * Convert USD to INR (numeric value only)
 * @param usdAmount - Amount in USD
 * @returns INR amount as number
 */
export function convertToINR(usdAmount: number): number {
    return Math.round(usdAmount * USD_TO_INR_RATE)
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
