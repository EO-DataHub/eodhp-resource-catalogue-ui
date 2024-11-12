import { CiCalendarDate } from 'react-icons/ci';
import { IoTimeOutline } from 'react-icons/io5';
import { TbAxisX, TbLicense } from 'react-icons/tb';

import { DataPoint } from '@/pages/MapViewer/components/Toolbox/components/ToolboxRow/types';
import { Collection, StacItem, TemporalExtentObject } from '@/typings/stac';

import { ExtractedDates, extractDates, formatDate } from './date';
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

  const { lastUpdated, summaries, license } = collection;
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

  if (license) {
    dataPoints.push({
      id: `${collection.id}_licence`,
      icon: TbLicense,
      alt: 'Licence Icon',
      value:
        addLicenceLink(collection).length > 0 ? (
          <a
            className="licence-link"
            href={addLicenceLink(collection)}
            rel="noreferrer"
            target="_blank"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {license}
          </a>
        ) : (
          license
        ),
      tooltip: 'Licence',
    });
  }

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

  // If more than 3 data points were found, return only the first 3
  if (dataPoints.length > 3) {
    return dataPoints.slice(0, 3);
  }

  return dataPoints;
};

const handleTemporalDataPoints = (
  collection: Collection,
  temporal: TemporalExtentObject,
  dataPoints: DataPoint[],
) => {
  if (!temporal.interval) return;
  const dates = extractDates(collection);
  const date = getFormattedSTACDateStr(dates);
  dataPoints.push({
    id: `${collection.id}_temporal`,
    icon: IoTimeOutline,
    alt: 'Time Icon',
    value: date,
    tooltip: 'Temporal Extent',
  });
};

export const parseFeatureDataPoints = (feature: StacItem): DataPoint[] => {
  // just return the time
  const dataPoints: DataPoint[] = [];
  const datetime = feature?.properties?.datetime;

  if (datetime) {
    const dates = extractDates(feature);
    dataPoints.push({
      id: `${feature.collection}_datetime`,
      icon: IoTimeOutline,
      alt: 'Time Icon',
      value: getFormattedSTACDateStr(dates),
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

// Given all the dates on a STAC object, return the most relevant date as a formatted string.
export const getFormattedSTACDateStr = (dates: ExtractedDates): string => {
  let date: string = 'No date provided';
  if (dates.datetime) date = dates.datetime;
  if (dates.start && dates.end) date = `${dates.start} - ${dates.end}`;
  if (dates.start && !dates.end) date = `From ${dates.start} onwards`;
  if (!dates.start && dates.end) date = `Up to ${dates.end}`;
  return date;
};

export const addLicenceLink = (collection: Collection): string => {
  const licenceLinkHtml = collection.links.find(
    (link) => link.rel === 'license' && link.href.endsWith('.html'),
  );
  if (licenceLinkHtml) {
    return licenceLinkHtml.href;
  }
  const firstLicenceLink = collection.links.find((link) => link.rel === 'license');
  return firstLicenceLink ? firstLicenceLink.href : '';
};
