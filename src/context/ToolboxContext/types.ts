import React from 'react';

// eslint-disable-next-line import/no-unresolved
import { FeatureCollection } from 'geojson';

import { Collection, Feature as StacFeature } from '@/typings/stac';

export interface ToolboxState {
  activePage: string;
  selectedCollection: Collection | null;
  selectedCollectionItems: FeatureCollection;
  selectedCollectionItem: StacFeature;
}

export type ToolboxAction =
  | { type: 'SET_ACTIVE_PAGE'; payload: string }
  | { type: 'SET_SELECTED_COLLECTION'; payload: Collection }
  | { type: 'SET_SELECTED_COLLECTION_ITEMS'; payload: FeatureCollection }
  | { type: 'SET_SELECTED_COLLECTION_ITEM'; payload: StacFeature };

export interface ToolboxContextType {
  state: ToolboxState;
  actions: {
    setActivePage: (activePage: string) => void;
    setSelectedCollection: (selectedCollection: Collection) => void;
    setSelectedCollectionItems: (selectedCollectionItems: FeatureCollection) => void;
    setSelectedCollectionItem: (selectedCollectionItem: StacFeature) => void;
  };
}

export interface ToolboxProviderProps {
  children: React.ReactNode;
}
