import React from "react";
import { Collection } from "@/typings/stac"

export type Center = [number, number];

export interface MapState {
  center: Center;
  toolboxCollectionsResults: Collection[];
}

export type MapAction =
  | { type: "SET_CENTER"; payload: Center }
  | { type: "SET_TOOLBOX_COLLECTIONS_RESULTS"; payload: Collection[] };

export interface MapContextType {
  state: MapState;
  actions: {
    setCenter: (center: Center) => void;
    setToolboxCollectionsResults: (collections: Collection[]) => void;
  };
}

export interface MapProviderProps {
  children: React.ReactNode;
}
