import { CURRENCIES, CurrencyCode } from '../types';

export function formatCurrency(amount: number, currency: CurrencyCode = 'EGP'): string {
  const config = CURRENCIES[currency] || CURRENCIES.EGP;
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Formatter with standard western digits (standard in modern fintech apps in the Arab world, e.g. Instapay/Telda/Vodafone Cash)
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  const sign = isNegative ? '-' : '';
  return `${sign}${formattedNumber} ${config.symbolAr}`;
}

export function formatCompactCurrency(amount: number, currency: CurrencyCode = 'EGP'): string {
  const config = CURRENCIES[currency] || CURRENCIES.EGP;
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  let formatted = '';
  if (abs >= 1_000_000) {
    formatted = (abs / 1_000_000).toFixed(1) + 'M';
  } else if (abs >= 1_000) {
    formatted = (abs / 1_000).toFixed(1) + 'K';
  } else {
    formatted = abs.toFixed(0);
  }

  const sign = isNegative ? '-' : '';
  return `${sign}${formatted} ${config.symbolAr}`;
}

export function formatTransactionDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    if (isToday) {
      return `اليوم، ${timeStr}`;
    }
    if (isYesterday) {
      return `أمس، ${timeStr}`;
    }

    const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' });
    const monthName = date.toLocaleDateString('ar-EG', { month: 'short' });
    const dayNum = date.getDate();

    return `${dayName}، ${dayNum} ${monthName} - ${timeStr}`;
  } catch {
    return isoString;
  }
}

export function formatFullDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}
