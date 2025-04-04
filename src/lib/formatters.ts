
/**
 * Format a number as Indian currency (with commas)
 * @param amount The amount to format
 * @returns Formatted string with thousands separators
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(amount);
}

/**
 * Parse a string with Indian currency formatting back to a number
 * @param formattedAmount The formatted amount string
 * @returns The numeric value
 */
export function parseCurrency(formattedAmount: string): number {
  // Remove all non-numeric characters except decimal point
  const cleanedString = formattedAmount.replace(/[^0-9.]/g, '');
  return parseFloat(cleanedString) || 0;
}

/**
 * Format date string to DD/MM/YYYY
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
