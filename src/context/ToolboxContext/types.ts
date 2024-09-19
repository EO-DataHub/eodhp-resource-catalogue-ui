import React from 'react';

import { FeatureCollection } from 'geojson';

import { Collection, StacItem } from '@/typings/stac';

export interface ToolboxState {
  activePage: string;
  selectedCollection: Collection | null;
  selectedCollectionItems: FeatureCollection;
  selectedCollectionItem: StacItem;
}

export type ToolboxAction =
  | { type: 'SET_ACTIVE_PAGE'; payload: string }
  | { type: 'SET_SELECTED_COLLECTION'; payload: Collection }
  | { type: 'SET_SELECTED_COLLECTION_ITEMS'; payload: FeatureCollection }
  | { type: 'SET_SELECTED_COLLECTION_ITEM'; payload: StacItem };

export interface ToolboxContextType {
  state: ToolboxState;
  actions: {
    setActivePage: (activePage: string) => void;
    setSelectedCollection: (selectedCollection: Collection) => void;
    setSelectedCollectionItems: (selectedCollectionItems: FeatureCollection) => void;
    setSelectedCollectionItem: (selectedCollectionItem: StacItem) => void;
  };
}

export interface ToolboxProviderProps {
  children: React.ReactNode;
}
