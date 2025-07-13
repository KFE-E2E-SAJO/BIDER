import { formatNumberWithComma } from '@/shared/lib/formatNumberWithComma';

export const formatBidPrice = (price: string): string => {
  const numericOnly = price.replace(/\D/g, '');
  return formatNumberWithComma(numericOnly);
};

export const formatBidPriceWithCurrency = (price: string): string => {
  const formatted = formatBidPrice(price);
  return formatted + ' 원';
};

export const parseBidPrice = (price: string): number => {
  return Number(price.replace(/,/g, ''));
};

export const validateBidPrice = (price: string): boolean => {
  const numericPrice = parseBidPrice(price);
  return numericPrice > 0;
};

export const getInitialBidPrice = (lastPrice: string): string => {
  return formatNumberWithComma(Number(lastPrice) + 1000);
};

export const formatBidDate = (dateString: string): string => {
  const date = new Date(dateString);

  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};
