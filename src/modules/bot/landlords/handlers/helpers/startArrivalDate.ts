export const startArrivalDateRegexp =
  /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

export const validateStartArrivalDate = (startArrivalDate: string): boolean => {
  return startArrivalDateRegexp.test(startArrivalDate);
};

export const getDateFromString = (stringDate?: string): Date | null => {
  if (!stringDate) {
    return null;
  }
  const execed = startArrivalDateRegexp.exec(stringDate);
  if (!validateStartArrivalDate(stringDate) || !execed) {
    return null;
  }
  const separator = execed[4] || execed[2];

  if (!separator) {
    console.error('no separator in date ' + stringDate);
    return null;
  }
  const day = Number(stringDate.split(separator)[0]);
  const month = Number(stringDate.split(separator)[1]) - 1;
  const year = Number(stringDate.split(separator)[2]);

  return new Date(year, month, day);
};
