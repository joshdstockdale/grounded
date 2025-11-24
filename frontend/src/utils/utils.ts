export function parseCurrency(value: string): number {
  // Remove non-numeric characters (except decimal point and sign) to get the raw number
  const numericValue = value.toString().replace(/[^0-9.-]+/g, '');
  return numericValue ? parseFloat(numericValue) : 0;
}
