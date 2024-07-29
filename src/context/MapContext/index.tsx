import React, { createContext, useReducer } from "react";
import {
  MapAction,
  MapContextType,
  MapProviderProps,
  MapState,
} from "./types";

const initialState: MapState = {
  map: null,
};

const reducer = (
  state: MapState,
  action: MapAction
): MapState => {
  switch (action.type) {
    case "SET_MAP":
      return {
        ...state,
        map: action.payload,
      };
  }
};

const MapContext = createContext<MapContextType | undefined>(
  undefined
);

const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    state,
    actions: {
      setMap: (map: any) => {
        dispatch({ type: "SET_MAP", payload: map });
      },
    }
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export { MapContext, MapProvider };
