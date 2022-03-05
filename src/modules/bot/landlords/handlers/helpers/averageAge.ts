export function validateAverageAge(averageAgeString: string): boolean {
  const averageAge = Number(averageAgeString);
  return !isNaN(averageAge) && Number.isInteger(averageAge) && averageAge > 0 && averageAge < 100;
}

export function getAverageAge(averageAgeString?: string): number | undefined {
  if (!averageAgeString || !validateAverageAge(averageAgeString)) {
    return undefined;
  }

  return Number(averageAgeString);
}
