import axios from 'axios';
import { FeatureCollection } from 'geojson';
import { GeoJSONGeometry } from 'ol/format/GeoJSON';

import hgb from '@/assets/placeholders/hgb.png';
import landsat from '@/assets/placeholders/landsat.png';
import sentinel2 from '@/assets/placeholders/sentinel-2.png';
import terraclimate from '@/assets/placeholders/terraclimate.png';
import { Collection } from '@/typings/stac';
import { formatDateAsISO8601 } from '@/utils/genericUtils';
import { HttpCodes } from '@/utils/http';

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
      // credentials: 'include',
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
      collection.thumbnailUrl = getRandomImage();
      collection.lastUpdated = getRandomDate();
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

// Temporary function to return random image
const getRandomImage = () => {
  const images = [hgb, landsat, sentinel2, terraclimate];
  return images[Math.floor(Math.random() * images.length)];
};

// Temporary function to return random last updated date
const getRandomDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 100));
  return date.toISOString().split('T')[0];
};
