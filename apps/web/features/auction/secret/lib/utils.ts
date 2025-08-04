export const isMoreThanOneHour = (endTime: string | Date): boolean => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  return diff > 60 * 60 * 1000;
};
