import { getStacCollections } from "@/services/stac";
import React, { createContext, useEffect, useReducer } from "react";
import { Collection } from "typings/stac";
import {
  CatalogueAction,
  CatalogueContextType,
  CatalogueProviderProps,
  CatalogueState,
} from "./types";

const initialState: CatalogueState = {
  collectionSearchResults: [],
  textQuery: "",
  activePage: 1,
};

const reducer = (
  state: CatalogueState,
  action: CatalogueAction
): CatalogueState => {
  switch (action.type) {
    case "SET_COLLECTION_SEARCH_RESULTS":
      return { ...state, collectionSearchResults: action.payload };
    case "SET_TEXT_QUERY":
      return { ...state, textQuery: action.payload };
    case "SET_ACTIVE_PAGE":
      return { ...state, activePage: action.payload };
    default:
      return state;
  }
};

const CatalogueContext = createContext<CatalogueContextType | undefined>(
  undefined
);

const CatalogueProvider: React.FC<CatalogueProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setCollectionSearchResults = (collections: Collection[]) => {
    dispatch({ type: "SET_COLLECTION_SEARCH_RESULTS", payload: collections });
  };

  const setTextQuery = (query: string) => {
    dispatch({ type: "SET_TEXT_QUERY", payload: query });
  };

  const setActivePage = (page: number) => {
    dispatch({ type: "SET_ACTIVE_PAGE", payload: page });
  };

  useEffect(() => {
    const fetchInitialCollections = async () => {
      try {
        const collections: Collection[] = await getStacCollections("");
        setCollectionSearchResults(collections);
      } catch (error) {
        console.error("Error fetching initial collections:", error);
      }
    };
    if (!state.collectionSearchResults.length) {
      fetchInitialCollections();
    }
  }, []);

  const value = {
    state,
    actions: {
      setCollectionSearchResults,
      setTextQuery,
      setActivePage,
    },
  };

  return (
    <CatalogueContext.Provider value={value}>
      {children}
    </CatalogueContext.Provider>
  );
};

export { CatalogueContext, CatalogueProvider };
