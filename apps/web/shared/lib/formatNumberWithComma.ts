export const formatNumberWithComma = (value: number | string): string => {
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '';
  return num.toLocaleString('ko-KR');
};
