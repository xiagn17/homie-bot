export function validateObjectNumber(objectNumberString: string): boolean {
  const objectNumber = Number(objectNumberString);
  return !isNaN(objectNumber) && Number.isInteger(objectNumber);
}

export function getObjectNumber(objectNumberString?: string): number | undefined {
  if (!objectNumberString) {
    return undefined;
  }
  const numberString = objectNumberString.split('home')[1];
  if (!validateObjectNumber(numberString)) {
    return undefined;
  }
  return Number(numberString);
}
