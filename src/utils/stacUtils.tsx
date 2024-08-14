import { Collection } from "typings/stac";
import { CiCalendarDate } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { TbAxisX } from "react-icons/tb";
import { DataPoint } from "@/pages/MapViewer/components/Toolbox/components/ToolboxItem/types";

/**
 * Further discussion needed around this function.
 * According to the design there are data points under each of the collection titles.
 * We can't ever assume what these data points are, so we need to be able to handle any data.
 *
 * This works as it is, but it's not very pretty.
 */
export const parseCollectionDataPoints = (
  collection: Collection
): DataPoint[] => {
  const dataPoints: DataPoint[] = [];

  const { lastUpdated, summaries } = collection;
  const { temporal } = collection.extent;

  // Add the Last Updated and Temporal Extent data points
  if (lastUpdated) {
    dataPoints.push({
      icon: CiCalendarDate,
      alt: "Calendar Icon",
      text: parseDate(lastUpdated),
      tooltip: "Last Updated",
    });
  }

  temporal &&
    temporal.interval &&
    dataPoints.push({
      icon: IoTimeOutline,
      alt: "Time Icon",
      text: `${new Date(
        temporal.interval[0][0]
      ).toLocaleDateString()} - ${new Date(
        temporal.interval[0][1]
      ).toLocaleDateString()}`,
      tooltip: "Temporal Extent",
    });

  // Summaries could be anything, so there needs to be some checks and processing.
  // We may not even want this, but it's here for now.
  // At least it gives some potentially useful information.
  if (summaries) {
    Object.keys(summaries).forEach((key) => {
      // We don't want values that are too long, or invalid values
      const invalidValues = ["null", "undefined", "nan", "", "none"];
      if (
        summaries[key].toString().length < 14 &&
        !invalidValues.includes(summaries[key].toString().toLowerCase()) &&
        key.toString().length < 10
      ) {
        dataPoints.push({
          icon: TbAxisX,
          alt: "Cloud Coverage Icon",
          text: `${beautifyKey(key)} - ${summaries[key].toString()}`,
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

/**
 *
 * @param date
 * @returns string
 *
 * This function is used to parse a date in any format into a string.
 */
const parseDate = (date: unknown): string => {
  if (
    typeof date === "string" ||
    typeof date === "number" ||
    date instanceof Date
  ) {
    return new Date(date).toLocaleDateString();
  } else {
    console.error("Invalid date:", date);
    return "N/A";
  }
};

/**
 *
 * @param key
 * @returns string
 *
 * This function is used to beautify a key string.
 */
const beautifyKey = (key: string): string => {
  key = key.replace(/_/g, " ").replace(/-/g, " ");
  key = key
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return key;
};
