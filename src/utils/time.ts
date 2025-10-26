import { differenceInMinutes, differenceInSeconds, format, parseISO } from 'date-fns';

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDuration = (start: string, end?: string): string => {
  const startDate = parseISO(start);
  const endDate = end ? parseISO(end) : new Date();
  const minutes = differenceInMinutes(endDate, startDate);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) {
    return `${remainingMinutes} хв`;
  }
  return `${hours} год ${remainingMinutes} хв`;
};

export const calculateRevenue = (
  start: string,
  rate: number,
  end?: string,
): number => {
  const startDate = parseISO(start);
  const endDate = end ? parseISO(end) : new Date();
  const minutes = Math.max(differenceInMinutes(endDate, startDate), 0);
  const hours = minutes / 60;
  return Math.round(hours * rate);
};

export const secondsUntil = (isoTime: string | undefined): number => {
  if (!isoTime) return 0;
  const target = parseISO(isoTime);
  const now = new Date();
  return differenceInSeconds(target, now);
};

export const formatDateTime = (iso: string): string => {
  const date = parseISO(iso);
  return format(date, 'dd.MM.yyyy HH:mm');
};
