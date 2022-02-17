export const validateFiltersPrice = (price: string): boolean => {
  const priceRegexp = /^\d+-\d+$/;
  const isValidRange = priceRegexp.test(price);
  if (!isValidRange) {
    return false;
  }
  const princeRangeStart = Number(price.split('-')[0]);
  const princeRangeEnd = Number(price.split('-')[1]);
  return princeRangeStart < princeRangeEnd;
};
