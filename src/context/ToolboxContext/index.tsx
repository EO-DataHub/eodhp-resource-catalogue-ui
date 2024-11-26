import React, { createContext, useCallback, useEffect, useReducer } from 'react';

import { useFilters } from '@/hooks/useFilters';
import { getStacItems } from '@/services/stac';
import { Collection, StacItem } from '@/typings/stac';
import { getCatalogueFromURL } from '@/utils/urlHandler';

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
    default:
      return state;
  }
};

const ToolboxContext = createContext<ToolboxContextType | undefined>(undefined);

const ToolboxProvider: React.FC<ToolboxProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    state: { activeFilters },
  } = useFilters();

  const catalogPath = getCatalogueFromURL();

  const setSelectedCollectionItems = useCallback(
    (selectedCollectionItems: ExtendedFeatureCollection) => {
      dispatch({
        type: 'SET_SELECTED_COLLECTION_ITEMS',
        payload: selectedCollectionItems,
      });
    },
    [],
  );

  const setCollectionItemsPending = useCallback((isPending: boolean) => {
    dispatch({
      type: 'SET_COLLECTION_ITEMS_PENDING',
      payload: isPending,
    });
  }, []);

  // Memoize the action functions using useCallback
  const setActivePage = useCallback((activePage: string) => {
    dispatch({ type: 'SET_ACTIVE_PAGE', payload: activePage });
  }, []);

  const setSelectedCollection = useCallback((selectedCollection: Collection) => {
    dispatch({
      type: 'SET_SELECTED_COLLECTION',
      payload: selectedCollection,
    });
  }, []);

  const setSelectedCollectionItem = useCallback((selectedCollectionItem: StacItem) => {
    dispatch({
      type: 'SET_SELECTED_COLLECTION_ITEM',
      payload: selectedCollectionItem,
    });
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (state.selectedCollection) {
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
    setCollectionItemsPending,
    setSelectedCollectionItems,
  ]);

  const returnResultsPage = useCallback(() => {
    if (state.selectedCollectionItems?.features) {
      const returnResultsPageOutput = state.selectedCollectionItems.features.slice(
        (activeFilters.resultsPage - 1) * 10,
        activeFilters.resultsPage * 10,
      );
      return returnResultsPageOutput;
    }
    return [];
  }, [activeFilters.resultsPage, state.selectedCollectionItems?.features]);

  const value = {
    state,
    actions: {
      setActivePage,
      setSelectedCollection,
      setSelectedCollectionItems,
      setSelectedCollectionItem,
      returnResultsPage,
    },
  };

  return <ToolboxContext.Provider value={value}>{children}</ToolboxContext.Provider>;
};

export { ToolboxContext, ToolboxProvider };
