import React, { createContext, useEffect, useReducer } from 'react';

import { getStacCollections } from '@/services/stac';
import { Collection } from '@/typings/stac';
import { getCatalogueFromURL } from '@/utils/urlHandler';

import {
  CatalogueAction,
  CatalogueContextType,
  CatalogueProviderProps,
  CatalogueState,
} from './types';

const initialState: CatalogueState = {
  collectionSearchResults: [],
  favouritedItems: {},
  textQuery: '',
  activePage: 1,
};

const reducer = (state: CatalogueState, action: CatalogueAction): CatalogueState => {
  switch (action.type) {
    case 'SET_COLLECTION_SEARCH_RESULTS':
      return { ...state, collectionSearchResults: action.payload };
    case 'SET_TEXT_QUERY':
      return { ...state, textQuery: action.payload };
    case 'SET_ACTIVE_PAGE':
      return { ...state, activePage: action.payload };
    case 'SET_FAVOURITED_ITEMS':
      return {
        ...state,
        favouritedItems: {
          ...state.favouritedItems,
          [action.payload.collectionId]: new Set(action.payload.itemIds),
        },
      };
    default:
      return state;
  }
};

const CatalogueContext = createContext<CatalogueContextType | undefined>(undefined);

const CatalogueProvider: React.FC<CatalogueProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const catalogPath = getCatalogueFromURL();

  const setCollectionSearchResults = (collections: Collection[]) => {
    dispatch({ type: 'SET_COLLECTION_SEARCH_RESULTS', payload: collections });
  };

  const setTextQuery = (query: string) => {
    dispatch({ type: 'SET_TEXT_QUERY', payload: query });
  };

  const setActivePage = (page: number) => {
    dispatch({ type: 'SET_ACTIVE_PAGE', payload: page });
  };

  useEffect(() => {
    const fetchInitialCollections = async () => {
      try {
        const collections: Collection[] = await getStacCollections(catalogPath ?? '', '');
        setCollectionSearchResults(collections);
      } catch (error) {
        console.error('Error fetching initial collections:', error);
      }
    };
    if (!state.collectionSearchResults.length) {
      fetchInitialCollections();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setFavouritedItems = (collectionId: string, itemIds: string[]) => {
    dispatch({ type: 'SET_FAVOURITED_ITEMS', payload: { collectionId, itemIds } });
  };

  const value = {
    state,
    actions: {
      setCollectionSearchResults,
      setTextQuery,
      setActivePage,
      setFavouritedItems,
    },
  };

  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>;
};

export { CatalogueContext, CatalogueProvider };
