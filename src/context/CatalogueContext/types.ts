import React from "react";

export interface CatalogueState {
  headerTitle: string;
  collectionSearchResults: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  textQuery: string;
  activePage: number;
}

export interface CatalogueAction {
  type: string;
  payload?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface CatalogueContextType {
  state: {
    headerTitle: string;
    collectionSearchResults: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    textQuery: string;
    activePage: number;
  };
  actions: {
    setHeaderTitle: (title: string) => void;
    setCollectionSearchResults: (query: string) => void;
    setTextQuery: (query: string) => void;
    setActivePage: (page: number) => void;
  };
}

export interface CatalogueProviderProps {
  children: React.ReactNode;
}
