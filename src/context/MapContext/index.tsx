import React, { createContext, useEffect, useReducer } from "react";
import {
  MapAction,
  MapContextType,
  MapProviderProps,
  MapState,
  Center,
} from "./types";
import { getStacCollections } from "@/services/stac";
import { useFilters } from "@/hooks/useFilters";

const initialState: MapState = {
  center: [51.505, -0.09],
  toolboxCollectionsResults: [],
};

const reducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case "SET_CENTER":
      return {
        ...state,
        center: action.payload,
      };
    case "SET_TOOLBOX_COLLECTIONS_RESULTS":
      return {
        ...state,
        toolboxCollectionsResults: action.payload,
      };
  }
};

const MapContext = createContext<MapContextType | undefined>(undefined);

const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: FilterState } = useFilters();
  const { activeFilters: activeFilters } = FilterState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collections = await getStacCollections(activeFilters.textQuery);
        console.log("[Detected Input Change] Fetched Collections", collections);
        dispatch({
          type: "SET_TOOLBOX_COLLECTIONS_RESULTS",
          payload: collections,
        });
      } catch (error) {
        console.error("Error fetching collections", error);
      }
    };

    fetchData();
  }, [activeFilters]);

  const value = {
    state,
    actions: {
      setCenter: (center: Center) => {
        dispatch({ type: "SET_CENTER", payload: center });
      },
      setToolboxCollectionsResults: (collections) => {
        dispatch({
          type: "SET_TOOLBOX_COLLECTIONS_RESULTS",
          payload: collections,
        });
      },
    },
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export { MapContext, MapProvider };
