export interface StacCollection {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  thumbnailUrl: string;
  type: string;
}

export interface StacCollectionsResponse {
  collections: StacCollection[];
}
