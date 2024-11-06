import { format } from 'date-fns';

import { Collection, StacItem } from '@/typings/stac';

export const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

export const formatDate = (date: string | Date, formatStr = DEFAULT_DATE_FORMAT): string => {
  try {
    const newDate = typeof date === 'string' ? new Date(date) : date;
    return format(newDate, formatStr);
  } catch (error) {
    throw new Error(error.message);
  }
};

type StacData = Collection | StacItem;

export type ExtractedDates = {
  start: string | null;
  end: string | null;
  datetime: string | null;
};

export const extractDates = (stacData: StacData): ExtractedDates => {
  const dates: ExtractedDates = {
    start: null,
    end: null,
    datetime: null,
  };

  // Handle Collection temporal extent
  if (stacData.type === 'Collection') {
    const temporalExtent = stacData?.extent?.temporal?.interval?.[0];
    if (temporalExtent) {
      if (temporalExtent[0]) dates.start = formatDate(temporalExtent[0]);
      if (temporalExtent[1]) dates.end = formatDate(temporalExtent[1]);
    }
  }

  // Handle Item datetime in properties
  if (stacData.type === 'Feature') {
    const props = stacData.properties;
    if (props.datetime) dates.datetime = formatDate(props.datetime);
    if (props.start_datetime) dates.start = formatDate(props.start_datetime);
    if (props.end_datetime) dates.end = formatDate(props.end_datetime);
  }

  return dates;
};
