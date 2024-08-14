/**
 *
 * @param date
 * @returns string
 *
 * This function is used to parse a date in any format into a string.
 */
export const parseDate = (date: unknown): string => {
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
export const beautifyKey = (key: string): string => {
  key = key.replace(/_/g, " ").replace(/-/g, " ");
  key = key
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return key;
};
