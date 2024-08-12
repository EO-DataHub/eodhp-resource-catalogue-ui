
// This will need to be extended to match Collection spec https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md
export interface Collection {
  id: string;
  title: string;
  description: string;
  lastUpdated?: string;
  stacUrl: string;
  thumbnailUrl?: string;
  type: string;
}

// Item, Catalog, Workflow etc. will be added here as needed