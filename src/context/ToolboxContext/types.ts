import React from 'react';

import { Collection, StacItem } from '@/typings/stac';

export interface ToolboxState {
  activePage: string;
  selectedCollection: Collection | null;
  selectedCollectionItems: ExtendedFeatureCollection;
  selectedCollectionItem: StacItem;
  isCollectionItemsPending: boolean;
}

export type ToolboxAction =
  | { type: 'SET_ACTIVE_PAGE'; payload: string }
  | { type: 'SET_SELECTED_COLLECTION'; payload: Collection }
  | { type: 'SET_SELECTED_COLLECTION_ITEMS'; payload: ExtendedFeatureCollection }
  | { type: 'SET_SELECTED_COLLECTION_ITEM'; payload: StacItem }
  | { type: 'SET_COLLECTION_ITEMS_PENDING'; payload: boolean };

export interface ToolboxContextType {
  state: ToolboxState;
  actions: {
    setActivePage: (activePage: string) => void;
    setSelectedCollection: (selectedCollection: Collection) => void;
    setSelectedCollectionItems: (selectedCollectionItems: ExtendedFeatureCollection) => void;
    setSelectedCollectionItem: (selectedCollectionItem: StacItem) => void;
    returnResultsPage: () => StacItem[];
  };
}

export interface ToolboxProviderProps {
  children: React.ReactNode;
}
