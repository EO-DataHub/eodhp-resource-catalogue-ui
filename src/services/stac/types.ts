import { Collection } from '@/typings/stac';

interface Link {
  href: string;
  rel: string;
  type: string;
}

export interface StacCollectionsResponse {
  collections: Collection[];
  links: Link[];
}
