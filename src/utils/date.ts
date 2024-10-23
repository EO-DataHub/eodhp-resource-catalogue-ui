import { format } from 'date-fns';

export const DEFAULT_DATE_FORMAT = 'yyyy-mm-dd';
export const TIME_DATE_FORMAT = `${DEFAULT_DATE_FORMAT}Thh:mm:ss`;

export const formatDate = (date: string | Date, formatType = DEFAULT_DATE_FORMAT): string => {
  if (!date) date = new Date();
  let newDate = date.toLocaleString();
  try {
    switch (formatType) {
      case DEFAULT_DATE_FORMAT:
        newDate = format(new Date(date), 'yyyy-MM-dd');
        break;
      case TIME_DATE_FORMAT:
        newDate = format(new Date(date), 'yyyy-MM-dd') + ' ' + new Date(date).toLocaleTimeString();
        break;
      default:
        throw new Error(`Format type: ${formatType} not implemented`);
    }
  } catch (error) {
    throw new Error(error.message);
  }
  return newDate;
};
