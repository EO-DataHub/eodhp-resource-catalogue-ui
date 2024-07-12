export interface StacCollection {
  id: string;
  title: string;
  description: string;
}

export interface StacCollectionsResponse {
  collections: StacCollection[];
}
