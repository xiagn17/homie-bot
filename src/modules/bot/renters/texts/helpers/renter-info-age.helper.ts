export function getRenterInfoAgeText(age: number): string {
  if (age === 11 || age === 12 || age === 13 || age === 14) {
    return `${age} лет`;
  }
  const lastNumber = Number(String(age)[String(age).length - 1]);
  if (lastNumber === 1) {
    return `${age} год`;
  }
  if (lastNumber === 2 || lastNumber === 3 || lastNumber === 4) {
    return `${age} года`;
  }
  return `${age} лет`;
}
