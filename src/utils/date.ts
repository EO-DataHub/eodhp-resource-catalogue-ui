import { format } from 'date-fns';

export const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

export const formatDate = (date: string | Date, formatStr = DEFAULT_DATE_FORMAT): string => {
  try {
    const newDate = typeof date === 'string' ? new Date(date) : date;
    return format(newDate, formatStr);
  } catch (error) {
    throw new Error(error.message);
  }
};
