import React, { createContext, useContext, useEffect, useReducer } from "react";
import { CatalogueState, CatalogueAction, CatalogueContextType, CatalogueProviderProps } from "./types";
import { getStacCollections } from "../../services/stac";
import { FilterContext } from "../FilterContext";

const initialState: CatalogueState = {
  collectionSearchResults: [],
  textQuery: "",
  activePage: 1,

};

const reducer = (state: CatalogueState, action: CatalogueAction): CatalogueState => {
  switch (action.type) {
    case "SET_COLLECTION_SEARCH_RESULTS":
      return { ...state, collectionSearchResults: action.payload };
    case "SET_TEXT_QUERY":
      return { ...state, textQuery: action.payload };
    case "ACTIVE_PAGE":
      return { ...state, activePage: action.payload };
    default:
      return state;
  }
};

const CatalogueContext = createContext<CatalogueContextType>({
  state: initialState,
  actions: {
    setCollectionSearchResults: () => { },
    setTextQuery: () => { },
    setActivePage: () => { },
  },
});

const CatalogueProvider: React.FC<CatalogueProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);


  const setCollectionSearchResults = async (payload: string) => {
    dispatch({ type: "SET_COLLECTION_SEARCH_RESULTS", payload });
  }

  const setTextQuery = (payload: string) => {
    dispatch({ type: "SET_TEXT_QUERY", payload });
  };

  const setActivePage = (payload: number) => {
    dispatch({ type: "ACTIVE_PAGE", payload });
  }

  useEffect(() => {
    const fetchInitialCollections = async () => {
      console.log('Fetching initial collections');
      try {
        const data = await getStacCollections('');
        setCollectionSearchResults(data);
      } catch (error) {
        console.error('Error fetching initial collections:', error);
      }
    };
    fetchInitialCollections();
  }, []);



  const value = {
    state: {
      collectionSearchResults: state.collectionSearchResults,
      textQuery: state.textQuery,
      activePage: state.activePage,
    },
    actions: {
      setCollectionSearchResults,
      setTextQuery,
      setActivePage,  
    },
  };

  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>;
};

export { CatalogueContext, CatalogueProvider };
