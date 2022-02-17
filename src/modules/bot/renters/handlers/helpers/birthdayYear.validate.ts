export const validateBirthdayYear = (year: string): boolean => {
  return Number(year) >= 1930 && Number(year) <= 2008;
};
