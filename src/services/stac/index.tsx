import axios from 'axios';
import { FeatureCollection } from 'geojson';
import { GeoJSONGeometry } from 'ol/format/GeoJSON';

import hgb from '@/assets/placeholders/hgb.png';
import landsat from '@/assets/placeholders/landsat.png';
import sentinel2 from '@/assets/placeholders/sentinel-2.png';
import terraclimate from '@/assets/placeholders/terraclimate.png';
import { Collection, StacItem } from '@/typings/stac';
import { extractDates } from '@/utils/date';
import { formatDateAsISO8601 } from '@/utils/genericUtils';
import { HttpCodes } from '@/utils/http';
import { getFormattedSTACDateStr } from '@/utils/stacUtils';

import { StacCollectionsResponse } from './types';

// There's two ways to go about this:
// 1. As seen below, retrieve every single collection matching the query and then paginate on the client side
// 2. Or, retrieve a limited number of collections and paginate on the server side
// The latter requires more network requests, however it's more efficient for large datasets
export const getStacCollections = async (
  privateCatalog: string,
  searchQuery: string = '',
  limit: number = 99999,
): Promise<Collection[]> => {
  const url = privateCatalog
    ? `${import.meta.env.VITE_STAC_ENDPOINT}/catalogs/${privateCatalog}/collections?limit=${limit}&q=${searchQuery}`
    : `${import.meta.env.VITE_STAC_ENDPOINT}/collections?limit=${limit}&q=${searchQuery}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === HttpCodes.UNAUTHORIZED) {
        window.location.href = import.meta.env.VITE_SIGN_IN;
      } else {
        throw new Error('Network response was not ok');
      }
    }
    const data: StacCollectionsResponse = await response.json();

    // For each data.collections add a thumbnailUrl, none of collections in the response have these fields
    data.collections.forEach((collection) => {
      const dates = extractDates(collection);
      collection.thumbnailUrl = getRandomImage();
      collection.lastUpdated = getFormattedSTACDateStr(dates);
      collection.stacUrl = getStacUrl(collection);
    });
    return data.collections;
  } catch (error) {
    console.error('Error fetching STAC collections:', error);
    throw error;
  }
};

// In the future we are going to use `cql2-json`, this item search is temporary
export const getStacItems = async (
  privateCatalog: string,
  collection: Collection,
  geometry: GeoJSONGeometry,
  startDate: string,
  endDate: string,
): Promise<FeatureCollection> => {
  const itemsUrl = privateCatalog
    ? `${import.meta.env.VITE_STAC_ENDPOINT}/catalogs/${privateCatalog}/search`
    : `${import.meta.env.VITE_STAC_ENDPOINT}/search`;

  const data = {
    collections: [collection.id],
    limit: 100,
    catalog_paths: [getStacCatalogUrl(collection)],
    intersects: geometry,
  };

  if (startDate || endDate) {
    data['datetime'] = renderDateInterval(startDate, endDate);
  }

  try {
    const response = await axios.post(itemsUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/geo+json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching STAC items:', error);
  }

  return {
    type: 'FeatureCollection',
    features: [],
  };
};

export const fetchFavouritedItems = async (collectionId: string): Promise<string[]> => {
  const workspace = (await getActiveWorkspace()) || 'james-hinton';
  const url = `${import.meta.env.VITE_STAC_ENDPOINT}/catalogs/user-datasets/${workspace}/saved-data/collections/${collectionId}/items?limit=99999`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.log('Error fetching favourited items:', response);
    }
    const data = await response.json();

    const itemIds = data.features.map((item: StacItem) => item.id);
    return itemIds;
  } catch (error) {
    console.error('Error fetching favourited items:', error);
    return [];
  }
};

export const favouriteItem = async (itemUrl: string): Promise<void> => {
  const workspace = (await getActiveWorkspace()) || 'james-hinton';
  const url = `${import.meta.env.VITE_STAC_WORKSPACE_ENDPOINT}/${workspace}`;
  const payload = {
    url: itemUrl,
  };

  try {
    await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Error favouriting item:', error);
    throw error;
  }
};

export const unFavouriteItem = async (itemUrl: string): Promise<void> => {
  const workspace = (await getActiveWorkspace()) || 'james-hinton';
  const url = `${import.meta.env.VITE_STAC_WORKSPACE_ENDPOINT}/${workspace}`;
  const payload = {
    url: itemUrl,
  };

  try {
    await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Error unfavouriting item:', error);
    throw error;
  }
};

const getActiveWorkspace = async (): Promise<string> => {
  const url = import.meta.env.VITE_WORKSPACE_ENDPOINT;
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.log('Error fetching active workspace:', response);
    }
    const data = await response.json();

    return data.workspaces[0].name;
  } catch (error) {
    console.error('Error fetching active workspace:', error);
    return 'james-hinton';
  }
};

export const sendPurchaseRequest = async (): Promise<void> => {
  const workspace = (await getActiveWorkspace()) || 'james-hinton';
  const url = `${import.meta.env.VITE_STAC_WORKSPACE_ENDPOINT}/${workspace}/ordered-data`;

  try {
    await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({}),
    });
  } catch (error) {
    console.error('Error favouriting item:', error);
    throw error;
  }
};

const getStacCatalogUrl = (collection: Collection): string => {
  const selfLink = collection.links.find((link) => link.rel === 'self');
  if (!selfLink?.href) return '';

  const index =
    selfLink.href.indexOf(import.meta.env.VITE_STAC_ENDPOINT) +
    import.meta.env.VITE_STAC_ENDPOINT.length;

  // Remove everything up to the end of the Env Var `VITE_STAC_ENDPOINT`.
  let url = selfLink.href.slice(index, selfLink.href.length);

  if (url.startsWith('/catalogs/')) {
    url = url.replace('/catalogs/', '');
  }

  const [catalogUrl] = url.split('/collections/');
  return catalogUrl;
};

const renderDateInterval = (startDate: string, endDate?: string): string => {
  const formattedStartDate = formatDateAsISO8601(startDate);
  return endDate ? `${formattedStartDate}/${formatDateAsISO8601(endDate)}` : formattedStartDate;
};

const getStacUrl = (collection: Collection): string => {
  let stacUrl: string;
  try {
    collection.links.forEach((link) => {
      if (link.rel == 'self') {
        stacUrl = `${import.meta.env.VITE_STAC_BROWSER}/#/external/${link.href}`;
      }
    });
    return stacUrl;
  } catch (error) {
    console.error('Error fetching STAC collection URL: ', error);
    throw error;
  }
};

// Return self url
export const getStacItemUrl = (item: StacItem): string => {
  const selfLink = item.links.find((link) => link.rel === 'self');
  return selfLink?.href ?? '';
};

// Temporary function to return random image
const getRandomImage = () => {
  const images = [hgb, landsat, sentinel2, terraclimate];
  return images[Math.floor(Math.random() * images.length)];
};
