import { Collection } from "typings/stac"
import { StacCollectionsResponse } from "./types";

// There's two ways to go about this:
// 1. As seen below, retrieve every single collection matching the query and then paginate on the client side
// 2. Or, retrieve a limited number of collections and paginate on the server side
// The latter requires more network requests, however it's more efficient for large datasets
export const getStacCollections = async (
  searchQuery: string = '',
  limit: number = 99999,
): Promise<Collection[]> => {
  const url = `${import.meta.env.VITE_COLLECTION_ENDPOINT}?limit=${limit}&q=${searchQuery}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: StacCollectionsResponse = await response.json();

    // For each data.collections add a thumbnailUrl, none of collections in the response have these fields
    data.collections.forEach(collection => {
      collection.thumbnailUrl = getRandomImage();
      collection.lastUpdated = getRandomDate();
    });
    return data.collections;
  } catch (error) {
    console.error('Error fetching STAC collections:', error);
    throw error;
  }
}

// Temporary function to return random image
const getRandomImage = (): string => {
  const images = ['terraclimate.png', 'landsat.png', 'sentinel-2.png', 'hgb.png'];
  return '/placeholders/' + images[Math.floor(Math.random() * images.length)];
}

// Temporary function to return random last updated date
const getRandomDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 100));
  return date.toISOString().split('T')[0];
}