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
