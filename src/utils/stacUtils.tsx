import { CiCalendarDate } from 'react-icons/ci';
import { IoTimeOutline } from 'react-icons/io5';
import { TbAxisX } from 'react-icons/tb';

import { DataPoint } from '@/pages/MapViewer/components/Toolbox/components/ToolboxRow/types';
import { Collection, StacItem, TemporalExtentObject } from '@/typings/stac';

import { DEFAULT_DATE_FORMAT, formatDate } from './date';
import { titleFromId } from './genericUtils';

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
      id: `${collection.id}_last_updated`,
      icon: CiCalendarDate,
      alt: 'Calendar Icon',
      value: formatDate(lastUpdated),
      tooltip: 'Last Updated',
    });
  }
  if (temporal) handleTemporalDataPoints(collection, temporal, dataPoints);

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
          id: `${collection.id}_${key}`,
          icon: TbAxisX,
          alt: 'Cloud Coverage Icon',
          value: `${titleFromId(key)} - ${summaries[key].toString()}`,
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

const handleTemporalDataPoints = (
  collection: Collection,
  temporal: TemporalExtentObject,
  dataPoints: DataPoint[],
) => {
  if (!temporal.interval) return;
  dataPoints.push({
    id: `${collection.id}_temporal`,
    icon: IoTimeOutline,
    alt: 'Time Icon',
    value:
      temporal?.interval.length > 0 ? (
        <div>
          <div>{formatDate(temporal.interval[0][0])} - </div>
          <div>{formatDate(temporal.interval[0][1])}</div>
        </div>
      ) : (
        'No date given'
      ),
    tooltip: 'Temporal Extent',
  });
};

export const parseFeatureDataPoints = (feature: StacItem): DataPoint[] => {
  // just return the time
  const dataPoints: DataPoint[] = [];
  const {
    properties: { datetime },
  } = feature;

  if (datetime) {
    dataPoints.push({
      id: `${feature.collection}_datetime`,
      icon: IoTimeOutline,
      alt: 'Time Icon',
      value: formatDate(datetime, `${DEFAULT_DATE_FORMAT} hh:mm:ss`),
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
