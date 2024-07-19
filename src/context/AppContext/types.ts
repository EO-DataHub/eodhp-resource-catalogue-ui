import React from "react";

export interface AppState {
  filterSidebarOpen: boolean;
}

export type AppAction =
  | { type: "SET_FILTER_SIDEBAR_OPEN"; payload: boolean };

export interface AppContextType {
  state: AppState;
  actions: {
    setFilterSidebarOpen: (isOpen: boolean) => void;
  };
}

export interface AppProviderProps {
  children: React.ReactNode;
}
