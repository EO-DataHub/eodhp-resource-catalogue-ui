import React from 'react';

import { Collection } from '@/typings/stac';

export interface CatalogueState {
  collectionSearchResults: Collection[];
  favouritedItems: { [collectionId: string]: Set<string> };
  textQuery: string;
  activePage: number;
}

export type CatalogueAction =
  | { type: 'SET_COLLECTION_SEARCH_RESULTS'; payload: Collection[] }
  | { type: 'SET_TEXT_QUERY'; payload: string }
  | { type: 'SET_ACTIVE_PAGE'; payload: number }
  | { type: 'SET_FAVOURITED_ITEMS'; payload: { collectionId: string; itemIds: string[] } };

export interface CatalogueContextType {
  state: CatalogueState;
  actions: {
    setCollectionSearchResults: (collections: Collection[]) => void;
    setTextQuery: (query: string) => void;
    setActivePage: (page: number) => void;
    setFavouritedItems: (collectionId: string, itemIds: string[]) => void;
  };
}

export interface CatalogueProviderProps {
  children: React.ReactNode;
}
