import { StacCollectionsResponse } from './types';

export const getStacCollections = async (): Promise<StacCollectionsResponse> => {
  const url = 'https://example.com/stac/collections';
  
  try {
    const response = await fetch(url); // Will use axios in the future
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: StacCollectionsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching STAC collections:', error);
    throw error;
  }
}
