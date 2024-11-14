// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React from 'react';

import { FeatureCollection } from 'geojson';

import { Collection, StacItem } from '@/typings/stac';

export interface ExtendedFeatureCollection extends FeatureCollection {
  context?: {
    matched?: number;
  };
}

export interface ToolboxState {
  activePage: string;
  selectedCollection: Collection | null;
  selectedCollectionItems: FeatureCollection;
  selectedCollectionItem: StacItem;
  isCollectionItemsPending: boolean;
}

export type ToolboxAction =
  | { type: 'SET_ACTIVE_PAGE'; payload: string }
  | { type: 'SET_SELECTED_COLLECTION'; payload: Collection }
  | { type: 'SET_SELECTED_COLLECTION_ITEMS'; payload: FeatureCollection }
  | { type: 'SET_SELECTED_COLLECTION_ITEM'; payload: StacItem }
  | { type: 'SET_COLLECTION_ITEMS_PENDING'; payload: boolean };

export interface ToolboxContextType {
  state: ToolboxState;
  actions: {
    setActivePage: (activePage: string) => void;
    setSelectedCollection: (selectedCollection: Collection) => void;
    setSelectedCollectionItems: (selectedCollectionItems: ExtendedFeatureCollection) => void;
    setSelectedCollectionItem: (selectedCollectionItem: StacItem) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    returnResultsPage: () => any;
  };
}

export interface ToolboxProviderProps {
  children: React.ReactNode;
}
