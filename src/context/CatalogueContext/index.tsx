import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  CatalogueState,
  CatalogueAction,
  CatalogueContextType,
  CatalogueProviderProps,
  Collection,
} from "./types";
import { StacCollection } from "../../services/stac/types";
import { getStacCollections } from "../../services/stac";

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
      console.log("Fetching initial collections");
      try {
        const response = await getStacCollections("");
        const collections: Collection[] = response.collections.map(
          (col: StacCollection) => ({
            id: col.id,
            title: col.title,
            description: col.description,
            lastUpdated: col.updated,
            thumbnailUrl: col.thumbnail,
            type: col.type,
          })
        );
        setCollectionSearchResults(collections);
      } catch (error) {
        console.error("Error fetching initial collections:", error);
      }
    };
    if (!state.collectionSearchResults.length) {
      fetchInitialCollections();
    }
  }, [state.collectionSearchResults.length]);

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

const useCatalogue = () => {
  const context = useContext(CatalogueContext);
  if (!context) {
    throw new Error("useCatalogue must be used within a CatalogueProvider");
  }
  return context;
};

export { CatalogueContext, CatalogueProvider, useCatalogue };
