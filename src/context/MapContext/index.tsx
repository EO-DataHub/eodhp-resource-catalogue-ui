import React, { createContext, useReducer } from "react";
import {
  MapAction,
  MapContextType,
  MapProviderProps,
  MapState,
  Center
} from "./types";

const initialState: MapState = {
  center: [0, 0],
};

const reducer = (
  state: MapState,
  action: MapAction
): MapState => {
  switch (action.type) {
    case "SET_CENTER":
      return {
        ...state,
        center: action.payload,
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
      setCenter: (center: Center) => {
        dispatch({ type: "SET_CENTER", payload: center });
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
