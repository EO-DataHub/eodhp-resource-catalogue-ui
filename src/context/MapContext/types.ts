import React from "react";

export interface MapState {
  map: any;
}

export type MapAction =
  | { type: "SET_MAP"; payload: any };

export interface MapContextType {
  state: MapState;
  actions: {
    setMap: (map: any) => void;
  };
}

export interface MapProviderProps {
  children: React.ReactNode;
}
