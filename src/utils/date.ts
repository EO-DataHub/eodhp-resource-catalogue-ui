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

type Asset = {
  datetime?: string;
  created?: string;
  updated?: string;
  start_datetime?: string;
  end_datetime?: string;
};

type StacData = Collection | StacItem;

export type ExtractedDates = {
  start: string | null;
  end: string | null;
  datetime: string | null;
  created: string | null;
  updated: string | null;
  start_datetime: string | null;
  end_datetime: string | null;
};

export const extractDates = (stacData: StacData): ExtractedDates => {
  const dates: ExtractedDates = {
    start: null,
    end: null,
    datetime: null,
    created: null,
    updated: null,
    start_datetime: null,
    end_datetime: null,
  };

  // Handle Collection temporal extent
  if (stacData.type === 'Collection') {
    const temporalExtent = stacData?.extent?.temporal?.interval?.[0]; // First interval
    if (temporalExtent) {
      dates.start = temporalExtent[0] || null;
      dates.end = temporalExtent[1] || null;
    }
  }

  // Handle Item datetime in properties
  if (stacData.type === 'Feature') {
    dates.start = stacData.properties.datetime || stacData.properties.start_datetime || null;
    dates.end = stacData.properties.end_datetime || null;
  }

  // Handle assets (in both Collection and Item)
  if (stacData.assets) {
    Object.values(stacData.assets).forEach((asset: Asset) => {
      dates.datetime = asset.datetime || dates.datetime;
      dates.created = asset.created || dates.created;
      dates.updated = asset.updated || dates.updated;
      dates.start_datetime = asset.start_datetime || dates.start_datetime;
      dates.end_datetime = asset.end_datetime || dates.end_datetime;
    });
  }

  return dates;
};
