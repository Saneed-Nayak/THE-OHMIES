import { format, parseISO } from 'date-fns';

export const formatDateIST = (utcDateString) => {
  if (!utcDateString) return '';
  // date-fns automatically uses local timezone, but we can explicitly format
  try {
    const date = typeof utcDateString === 'string' ? parseISO(utcDateString) : new Date(utcDateString);
    return format(date, 'dd MMM yyyy, hh:mm a');
  } catch (e) {
    return utcDateString.toString();
  }
};

export const formatMonth = (yyyy_mm) => {
  if (!yyyy_mm) return '';
  try {
    const date = parseISO(`${yyyy_mm}-01`);
    return format(date, 'MMMM yyyy');
  } catch (e) {
    return yyyy_mm;
  }
};

export const getCurrentMonth = () => {
  return format(new Date(), 'yyyy-MM');
};

export const formatItems = (items) => {
  if (!items) return 'No items';
  const parts = [];
  if (items.rice) parts.push(`${items.rice}kg Rice`);
  if (items.wheat) parts.push(`${items.wheat}kg Wheat`);
  if (items.sugar) parts.push(`${items.sugar}kg Sugar`);
  if (items.oil) parts.push(`${items.oil}L Oil`);
  return parts.join(', ');
};