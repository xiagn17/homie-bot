export function validatePrice(price: string): boolean {
  const priceNumber = Number(price);
  return !isNaN(priceNumber) && Number.isInteger(priceNumber);
}

export function getPrice(priceString?: string): string | undefined {
  if (!priceString || !validatePrice(priceString)) {
    return undefined;
  }
  return String(Number(priceString));
}
