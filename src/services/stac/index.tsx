import { Collection } from "typings/stac"
import { StacCollectionsResponse } from "./types";

export const getStacCollections = async (
  searchQuery: string = '',
  limit: number = 99999,
): Promise<Collection[]> => {
  const url = 'https://test.eodatahub.org.uk/api/catalogue/stac/collections?limit=' + limit + '&q=' + searchQuery;;
  try {
    const response = await fetch(url); // Will use axios in the future
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