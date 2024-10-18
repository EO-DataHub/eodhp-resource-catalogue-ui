import { format } from 'date-fns';

export const formatDate = (date: string | Date, formatType = 'ISO8601'): string => {
  try {
    if (!date) date = new Date();
    if (formatType === 'ISO8601') {
      return format(new Date(date), 'yyyy-MM-dd');
    }
    throw new Error(`Format type: ${formatType} not implemented`);
  } catch (error) {
    throw new Error(error.message);
  }
};
