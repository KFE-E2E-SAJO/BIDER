export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0'); // 0-based → +1
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}.${month}.${day}`;
};
