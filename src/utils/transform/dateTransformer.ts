// dd.mm.yyyy
export const dateTransformer = (date: string): Date => {
  const splattedDate: number[] = date.split('.').map(d => Number(d));
  return new Date(splattedDate[2], splattedDate[1] - 1, splattedDate[0]);
};
