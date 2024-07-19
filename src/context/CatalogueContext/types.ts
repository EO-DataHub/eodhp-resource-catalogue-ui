import React from "react";

export interface Collection {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  thumbnailUrl: string;
  type: string;
}

export interface CatalogueState {
  collectionSearchResults: Collection[];
  textQuery: string;
  activePage: number;
}

export type CatalogueAction =
  | { type: "SET_COLLECTION_SEARCH_RESULTS"; payload: Collection[] }
  | { type: "SET_TEXT_QUERY"; payload: string }
  | { type: "SET_ACTIVE_PAGE"; payload: number };

export interface CatalogueContextType {
  state: CatalogueState;
  actions: {
    setCollectionSearchResults: (collections: Collection[]) => void;
    setTextQuery: (query: string) => void;
    setActivePage: (page: number) => void;
  };
}

export interface CatalogueProviderProps {
  children: React.ReactNode;
}
