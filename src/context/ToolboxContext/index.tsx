import React, { createContext, useEffect, useReducer } from "react";
import {
  ToolboxAction,
  ToolboxContextType,
  ToolboxProviderProps,
  ToolboxState,
} from "./types";
import { Collection } from "typings/stac";
import { getStacItems } from "@/services/stac";

import { FeatureCollection } from "geojson";
import { useFilters } from "@/hooks/useFilters";

const initialState: ToolboxState = {
  activePage: "collections",
  selectedCollection: null,
  selectedCollectionItems: {
    type: "FeatureCollection",
    features: [],
  },
};

const reducer = (state: ToolboxState, action: ToolboxAction): ToolboxState => {
  switch (action.type) {
    case "SET_ACTIVE_PAGE":
      return { ...state, activePage: action.payload };
    case "SET_SELECTED_COLLECTION":
      return { ...state, selectedCollection: action.payload };
    case "SET_SELECTED_COLLECTION_ITEMS":
      return { ...state, selectedCollectionItems: action.payload };
  }
};

const ToolboxContext = createContext<ToolboxContextType | undefined>(undefined);

const ToolboxProvider: React.FC<ToolboxProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    state: { activeFilters },
  } = useFilters();

  const setSelectedCollectionItems = (
    selectedCollectionItems: FeatureCollection
  ) => {
    dispatch({
      type: "SET_SELECTED_COLLECTION_ITEMS",
      payload: selectedCollectionItems,
    });
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (state.selectedCollection) {
        console.log("[ToolboxProvider] activeFilters:", activeFilters);
        try {
          const items = await getStacItems(
            state.selectedCollection,
            activeFilters.bounds,
            activeFilters.temporal.start,
            activeFilters.temporal.end
          );
          setSelectedCollectionItems(items);
        } catch (error) {
          console.error("Error fetching STAC items:", error);
        }
      }
    };

    fetchItems();
  }, [state.selectedCollection, activeFilters]);

  const value = {
    state,
    actions: {
      setActivePage: (activePage: string) => {
        dispatch({ type: "SET_ACTIVE_PAGE", payload: activePage });
      },
      setSelectedCollection: (selectedCollection: Collection) => {
        dispatch({
          type: "SET_SELECTED_COLLECTION",
          payload: selectedCollection,
        });
      },
      setSelectedCollectionItems: (selectedCollectionItems: FeatureCollection) => {
        dispatch({
          type: "SET_SELECTED_COLLECTION_ITEMS",
          payload: selectedCollectionItems,
        });
      },
    },
  };

  return (
    <ToolboxContext.Provider value={value}>{children}</ToolboxContext.Provider>
  );
};

export { ToolboxContext, ToolboxProvider };
