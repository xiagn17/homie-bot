export function validateApartmentsFloors(floors: string): boolean {
  const regexp = /^\s*\d+\/\d+\s*$/;
  return regexp.test(floors);
}

export function getApartmentsFloors(floorsString?: string): string | undefined {
  if (!floorsString || !validateApartmentsFloors(floorsString)) {
    return undefined;
  }
  return floorsString.trim();
}
