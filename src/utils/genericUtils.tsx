/**
 *
 * @param date
 * @returns string
 *
 * This function is used to parse a date in any format into a string.
 */
export const parseDate = (date: unknown, includeTime = false): string => {
  if (typeof date === 'string' || typeof date === 'number' || date instanceof Date) {
    return (
      new Date(date).toLocaleDateString() +
      (includeTime ? ' ' + new Date(date).toLocaleTimeString() : '')
    );
  } else {
    console.error('Invalid date:', date);
    return 'N/A';
  }
};

/**
 *
 * @param date
 * @returns string
 *
 * This function is used to format a date as an ISO8601 string.
 */
export const formatDateAsISO8601 = (date: string) =>
  new Date(date).toISOString().replace(/T.*Z$/, 'T00:00:00.000Z');

/**
 *
 * @param key
 * @returns string
 *
 * This function converts an ID into a title.
 * It replaces underscores and hyphens with spaces, and capitalises the first letter of each word.
 */
export const titleFromId = (key: string): string => {
  key = key.replace(/_/g, ' ').replace(/-/g, ' ');
  key = key
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return key;
};

export const fetchPathPartsFromUrl = () => {
  const path = window.location.pathname;
  const basePath = import.meta.env.VITE_BASE_PATH || '';
  let relativePath = path;
  if (basePath && path.startsWith(basePath)) {
    relativePath = path.slice(basePath.length);
  }
  relativePath = relativePath.replace(/\/(map|list|dataset|qa)$/, '');
  const pathParts = relativePath.split('/').filter(Boolean);
  const catalogsIndex = pathParts.indexOf('catalogs');
  let catalogPathParts = [];
  if (catalogsIndex !== -1) {
    catalogPathParts = pathParts.slice(catalogsIndex + 1);
  }
  return catalogPathParts;
};

export const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error fetching data');
  }
  return response.json();
};
