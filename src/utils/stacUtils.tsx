import { CiCalendarDate } from 'react-icons/ci';
import { IoTimeOutline } from 'react-icons/io5';
import { TbAxisX } from 'react-icons/tb';

import { DataPoint } from '@/pages/MapViewer/components/Toolbox/components/ToolboxRow/types';
import { Collection, StacItem } from '@/typings/stac';

import { parseDate, titleFromId } from './genericUtils';

/**
 * Further discussion needed around this function.
 * According to the design there are data points under each of the collection titles.
 * We can't ever assume what these data points are, so we need to be able to handle any data.
 *
 * This works as it is, but it's not very pretty.
 */
export const parseCollectionDataPoints = (collection: Collection): DataPoint[] => {
  const dataPoints: DataPoint[] = [];

  const { lastUpdated, summaries } = collection;
  const { temporal } = collection.extent;

  // Add the Last Updated and Temporal Extent data points
  if (lastUpdated) {
    dataPoints.push({
      icon: CiCalendarDate,
      alt: 'Calendar Icon',
      text: parseDate(lastUpdated),
      tooltip: 'Last Updated',
    });
  }

  temporal &&
    temporal.interval &&
    dataPoints.push({
      icon: IoTimeOutline,
      alt: 'Time Icon',
      text: `${new Date(temporal.interval[0][0]).toLocaleDateString()} - ${new Date(
        temporal.interval[0][1],
      ).toLocaleDateString()}`,
      tooltip: 'Temporal Extent',
    });

  // Summaries could be anything, so there needs to be some checks and processing.
  // We may not even want this, but it's here for now.
  // At least it gives some potentially useful information.
  if (summaries) {
    Object.keys(summaries).forEach((key) => {
      // We don't want values that are too long, or invalid values
      const invalidValues = ['null', 'undefined', 'nan', '', 'none'];
      if (
        summaries[key].toString().length < 14 &&
        !invalidValues.includes(summaries[key].toString().toLowerCase()) &&
        key.toString().length < 10
      ) {
        dataPoints.push({
          icon: TbAxisX,
          alt: 'Cloud Coverage Icon',
          text: `${titleFromId(key)} - ${summaries[key].toString()}`,
          tooltip: key,
        });
      }
    });
  }

  // If more than 4 data points were found, return only the first 4
  if (dataPoints.length > 4) {
    return dataPoints.slice(0, 4);
  }

  return dataPoints;
};

export const parseFeatureDataPoints = (feature: StacItem): DataPoint[] => {
  // just return the time
  const dataPoints: DataPoint[] = [];
  const {
    properties: { datetime },
  } = feature;

  if (datetime) {
    dataPoints.push({
      icon: IoTimeOutline,
      alt: 'Time Icon',
      text: parseDate(datetime, true),
      tooltip: 'Datetime',
    });
  }

  return dataPoints;
};

export const returnFeatureThumbnail = (feature: StacItem): string => {
  const assetsArray = Object.values(feature.assets);
  const thumbnailAsset = assetsArray.find(
    (asset) => asset.roles && asset.roles.includes('thumbnail'),
  );
  return thumbnailAsset?.href || 'https://via.placeholder.com/100';
};
