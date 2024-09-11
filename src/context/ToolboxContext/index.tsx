import React, { createContext, useEffect, useReducer } from 'react';

// eslint-disable-next-line import/no-unresolved
import { FeatureCollection } from 'geojson';

import { useFilters } from '@/hooks/useFilters';
import { getStacItems } from '@/services/stac';
import { Collection, Feature as StacFeature } from '@/typings/stac';

import { ToolboxAction, ToolboxContextType, ToolboxProviderProps, ToolboxState } from './types';

const initialState: ToolboxState = {
  activePage: 'collections',
  selectedCollection: null,
  selectedCollectionItems: {
    type: 'FeatureCollection',
    features: [],
  },
  selectedCollectionItem: null,
};

const reducer = (state: ToolboxState, action: ToolboxAction): ToolboxState => {
  switch (action.type) {
    case 'SET_ACTIVE_PAGE':
      return { ...state, activePage: action.payload };
    case 'SET_SELECTED_COLLECTION':
      return { ...state, selectedCollection: action.payload };
    case 'SET_SELECTED_COLLECTION_ITEMS':
      return { ...state, selectedCollectionItems: action.payload };
    case 'SET_SELECTED_COLLECTION_ITEM':
      return { ...state, selectedCollectionItem: action.payload };
  }
};

const ToolboxContext = createContext<ToolboxContextType | undefined>(undefined);

const ToolboxProvider: React.FC<ToolboxProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    state: { activeFilters },
  } = useFilters();

  const setSelectedCollectionItems = (selectedCollectionItems: FeatureCollection) => {
    dispatch({
      type: 'SET_SELECTED_COLLECTION_ITEMS',
      payload: selectedCollectionItems,
    });
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (state.selectedCollection && activeFilters.bounds) {
        try {
          const items = await getStacItems(
            state.selectedCollection,
            activeFilters.bounds,
            activeFilters.temporal.start,
            activeFilters.temporal.end,
          );
          setSelectedCollectionItems(items);
        } catch (error) {
          console.error('Error fetching STAC items:', error);
        }
      }
    };

    fetchItems();
  }, [
    activeFilters.bounds,
    activeFilters.temporal.end,
    activeFilters.temporal.start,
    state.selectedCollection,
  ]);

  const value = {
    state,
    actions: {
      setActivePage: (activePage: string) => {
        dispatch({ type: 'SET_ACTIVE_PAGE', payload: activePage });
      },
      setSelectedCollection: (selectedCollection: Collection) => {
        dispatch({
          type: 'SET_SELECTED_COLLECTION',
          payload: selectedCollection,
        });
      },
      setSelectedCollectionItems: (selectedCollectionItems: FeatureCollection) => {
        dispatch({
          type: 'SET_SELECTED_COLLECTION_ITEMS',
          payload: selectedCollectionItems,
        });
      },
      setSelectedCollectionItem: (selectedCollectionItem: StacFeature) => {
        dispatch({
          type: 'SET_SELECTED_COLLECTION_ITEM',
          payload: selectedCollectionItem,
        });
      },
    },
  };

  return <ToolboxContext.Provider value={value}>{children}</ToolboxContext.Provider>;
};

export { ToolboxContext, ToolboxProvider };
