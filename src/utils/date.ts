import { format } from 'date-fns';

export const formatDate = (
  date: string | Date,
  includeTime = false,
  formatType = 'ISO8601',
): string => {
  if (!date) date = new Date();
  let newDate = date.toLocaleString();
  try {
    if (formatType === 'ISO8601') {
      newDate = format(new Date(date), 'yyyy-MM-dd');
    }
  } catch (error) {
    throw new Error(error.message);
  }
  if (includeTime) {
    newDate = newDate + ' ' + new Date(date).toLocaleTimeString();
  }
  return newDate;
};
