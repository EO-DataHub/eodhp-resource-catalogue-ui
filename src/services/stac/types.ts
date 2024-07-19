// In your types.ts
export interface StacCollection {
  id: string;
  title: string;
  description: string;
  updated: string;
  thumbnail: string;
  type: string;
}

export interface StacCollectionsResponse {
  collections: StacCollection[];
}
