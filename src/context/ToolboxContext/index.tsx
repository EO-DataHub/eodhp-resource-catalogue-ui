import React, { createContext, useEffect, useReducer } from 'react';

// eslint-disable-next-line import/no-unresolved
import { FeatureCollection } from 'geojson';
import { transformExtent } from 'ol/proj';

import { DATA_PROJECTION, MAP_PROJECTION } from '@/components/Map';
import { useFilters } from '@/hooks/useFilters';
import { useMap } from '@/hooks/useMap';
import { getStacItems } from '@/services/stac';
import { Collection } from '@/typings/stac';

import { ToolboxAction, ToolboxContextType, ToolboxProviderProps, ToolboxState } from './types';

const initialState: ToolboxState = {
  activePage: 'collections',
  selectedCollection: null,
  selectedCollectionItems: {
    type: 'FeatureCollection',
    features: [],
  },
};

const reducer = (state: ToolboxState, action: ToolboxAction): ToolboxState => {
  switch (action.type) {
    case 'SET_ACTIVE_PAGE':
      return { ...state, activePage: action.payload };
    case 'SET_SELECTED_COLLECTION':
      return { ...state, selectedCollection: action.payload };
    case 'SET_SELECTED_COLLECTION_ITEMS':
      return { ...state, selectedCollectionItems: action.payload };
  }
};

const ToolboxContext = createContext<ToolboxContextType | undefined>(undefined);

const ToolboxProvider: React.FC<ToolboxProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    state: { activeFilters },
  } = useFilters();

  const { map } = useMap();

  const setSelectedCollectionItems = (selectedCollectionItems: FeatureCollection) => {
    dispatch({
      type: 'SET_SELECTED_COLLECTION_ITEMS',
      payload: selectedCollectionItems,
    });
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (state.selectedCollection) {
        const extent = map.getView().calculateExtent(map.getSize());
        // Transform the map extent to the CRS used by the data.
        const transformedExtent = transformExtent(extent, MAP_PROJECTION, DATA_PROJECTION);
        const bounds = {
          west: transformedExtent[0],
          south: transformedExtent[1],
          east: transformedExtent[2],
          north: transformedExtent[3],
        };
        try {
          const items = await getStacItems(
            state.selectedCollection,
            bounds,
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
  }, [state.selectedCollection, activeFilters, map]);

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
    },
  };

  return <ToolboxContext.Provider value={value}>{children}</ToolboxContext.Provider>;
};

export { ToolboxContext, ToolboxProvider };
