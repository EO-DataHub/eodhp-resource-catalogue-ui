import React, { createContext, useEffect, useReducer } from 'react';

import { useLocation } from 'react-router-dom';

import { useFilters } from '@/hooks/useFilters';
import { getStacItems } from '@/services/stac';
import { Collection, StacItem } from '@/typings/stac';

import { ToolboxAction, ToolboxContextType, ToolboxProviderProps, ToolboxState } from './types';

const initialState: ToolboxState = {
  activePage: 'collections',
  selectedCollection: null,
  selectedCollectionItems: {
    type: 'FeatureCollection',
    features: [],
  },

  selectedCollectionItem: null,
  isCollectionItemsPending: false,
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
    case 'SET_COLLECTION_ITEMS_PENDING':
      return { ...state, isCollectionItemsPending: action.payload };
  }
};

const ToolboxContext = createContext<ToolboxContextType | undefined>(undefined);

const ToolboxProvider: React.FC<ToolboxProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    state: { activeFilters },
  } = useFilters();

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const catalogPath = searchParams.get('catalogPath');

  const setSelectedCollectionItems = (selectedCollectionItems: ExtendedFeatureCollection) => {
    dispatch({
      type: 'SET_SELECTED_COLLECTION_ITEMS',
      payload: selectedCollectionItems,
    });
  };

  const setCollectionItemsPending = (isPending: boolean) => {
    dispatch({
      type: 'SET_COLLECTION_ITEMS_PENDING',
      payload: isPending,
    });
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (state.selectedCollection && activeFilters.aoi) {
        try {
          setCollectionItemsPending(true);
          const items = await getStacItems(
            catalogPath ?? '',
            state.selectedCollection,
            activeFilters.aoi,
            activeFilters.temporal.start,
            activeFilters.temporal.end,
          );
          setSelectedCollectionItems(items);
          setCollectionItemsPending(false);
        } catch (error) {
          console.error('Error fetching STAC items:', error);
        }
      }
    };

    fetchItems();
  }, [
    activeFilters.aoi,
    activeFilters.temporal.end,
    activeFilters.temporal.start,
    catalogPath,
    state.selectedCollection,
  ]);

  // Inside of selectedCollectionItems there is 100 items.
  // We only want to return 10 at a time, in relation to the active page the user is on. Ignore the resultsPerPage for now.
  const returnResultsPage = () => {
    if (state.selectedCollectionItems?.features) {
      const returnResultsPageOutput = state.selectedCollectionItems.features.slice(
        (activeFilters.resultsPage - 1) * 10,
        activeFilters.resultsPage * 10,
      );
      return returnResultsPageOutput;
    }
    return [];
  };

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
      setSelectedCollectionItems: (selectedCollectionItems: ExtendedFeatureCollection) => {
        dispatch({
          type: 'SET_SELECTED_COLLECTION_ITEMS',
          payload: selectedCollectionItems,
        });
      },
      setSelectedCollectionItem: (selectedCollectionItem: StacItem) => {
        dispatch({
          type: 'SET_SELECTED_COLLECTION_ITEM',
          payload: selectedCollectionItem,
        });
      },
      returnResultsPage,
    },
  };

  return <ToolboxContext.Provider value={value}>{children}</ToolboxContext.Provider>;
};

export { ToolboxContext, ToolboxProvider };
