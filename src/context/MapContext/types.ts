import React from "react";

export type Center = [number, number];

export interface MapState {
  center: Center;
}

export type MapAction =
  | { type: "SET_CENTER"; payload: Center };

export interface MapContextType {
  state: MapState;
  actions: {
    setCenter: (center: Center) => void;
  };
}

export interface MapProviderProps {
  children: React.ReactNode;
}
